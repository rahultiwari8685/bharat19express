
import mongoose from "mongoose";
import News from "../models/News.js";
import NewsView from "../models/NewsView.js";


const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
};

const getLastSevenDays = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);
        days.push(date);
    }

    return days;
};

const getPublishingActivity = async (filter = {}) => {
    const days = getLastSevenDays();
    const start = days[0];

    const results = await News.aggregate([
        {
            $match: {
                ...filter,
                type: 1,
                createdAt: { $gte: start },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
    ]);

    return days.map((day) => {
        const result = results.find(
            (item) =>
                item._id.year === day.getFullYear() &&
                item._id.month === day.getMonth() + 1 &&
                item._id.day === day.getDate()
        );

        return {
            date: day,
            label: day.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            }),
            count: result?.count || 0,
        };
    });
};

const getMostViewedNews = async ({
    authorId = null,
    limit = 7,
} = {}) => {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pipeline = [
        {
            $match: {
                viewedAt: { $gte: last24Hours },
            },
        },
        {
            $group: {
                _id: "$newsId",
                recentViews: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: "news",
                localField: "_id",
                foreignField: "_id",
                as: "news",
            },
        },
        { $unwind: "$news" },
        {
            $match: {
                "news.type": 1,
                ...(authorId
                    ? {
                        "news.author": new mongoose.Types.ObjectId(
                            String(authorId)
                        ),
                    }
                    : {}),
            },
        },
        { $sort: { recentViews: -1 } },
        { $limit: limit },
        {
            $project: {
                _id: "$news._id",
                title: "$news.title",
                subtitle: "$news.subtitle",
                slug: "$news.slug",
                thumbnail: "$news.thumbnail",
                views: "$news.views",
                recentViews: 1,
                createdAt: "$news.createdAt",
            },
        },
    ];

    return NewsView.aggregate(pipeline);
};

const getPublishingStats = async (filter = {}) => {
    const { start, end } = getTodayRange();

    const [totalPublished, todayPublished, drafts, mostViewed, activity] =
        await Promise.all([
            News.countDocuments({
                ...filter,
                type: 1,
            }),

            News.countDocuments({
                ...filter,
                type: 1,
                createdAt: { $gte: start, $lt: end },
            }),

            News.countDocuments({
                ...filter,
                type: 2,
            }),

            getMostViewedNews({
                authorId: filter.author,
            }),

            getPublishingActivity(filter),
        ]);

    return {
        totalPublished,
        todayPublished,
        drafts,
        mostViewed,
        publishingActivity: activity,
    };
};

export const getAdminDashboard = async (req, res) => {
    try {
        if (String(req.user.role) !== "1") {
            return res.status(403).json({
                status: false,
                message: "Admin access denied",
            });
        }

        const { start, end } = getTodayRange();

        const [
            totalNews,
            publishedNews,
            draftNews,
            todayPublished,
            totalViewsResult,
            mostViewed,
            publishingActivity,
            authorsToday,
        ] = await Promise.all([
            News.countDocuments({}),

            News.countDocuments({ type: 1 }),

            News.countDocuments({ type: 2 }),

            News.countDocuments({
                type: 1,
                createdAt: { $gte: start, $lt: end },
            }),

            News.aggregate([
                { $match: { type: 1 } },
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: "$views" },
                    },
                },
            ]),

            getMostViewedNews(),

            getPublishingActivity(),

            News.aggregate([
                {
                    $match: {
                        type: 1,
                        createdAt: { $gte: start, $lt: end },
                    },
                },
                {
                    $group: {
                        _id: "$author",
                        publishedCount: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "author",
                    },
                },
                {
                    $unwind: {
                        path: "$author",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: { $ifNull: ["$author.name", "Unknown Author"] },
                        publishedCount: 1,
                    },
                },
                { $sort: { publishedCount: -1 } },
                { $limit: 7 },
            ]),
        ]);

        return res.status(200).json({
            status: true,
            message: "Admin dashboard data loaded",
            data: {
                totalNews,
                publishedNews,
                draftNews,
                todayPublished,
                totalViews: totalViewsResult[0]?.totalViews || 0,
                mostViewed,
                authorsToday,
                publishingActivity,
            },
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        return res.status(500).json({
            status: false,
            message: "Unable to load admin dashboard",
        });
    }
};


export const getEditorDashboard = async (req, res) => {
    try {
        if (String(req.user.role) !== "2") {
            return res.status(403).json({
                status: false,
                message: "Editor access denied",
            });
        }

        const authorId = req.user._id;

        const stats = await getPublishingStats({
            author: authorId,
        });

        const recentNews = await News.find({
            author: authorId,
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title slug thumbnail type views createdAt");

        const totalViews = await News.aggregate([
            {
                $match: {
                    author: authorId,
                    type: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                },
            },
        ]);

        return res.status(200).json({
            status: true,
            message: "Editor dashboard data loaded",
            data: {
                ...stats,
                totalViews: totalViews[0]?.totalViews || 0,
                recentNews,
            },
        });
    } catch (error) {
        console.error("Editor Dashboard Error:", error);

        return res.status(500).json({
            status: false,
            message: "Unable to load editor dashboard",
        });
    }
};


export const getCorrespondenceDashboard = async (req, res) => {
    try {
        if (String(req.user.role) !== "3") {
            return res.status(403).json({
                status: false,
                message: "Correspondence access denied",
            });
        }

        const authorId = req.user._id;

        const stats = await getPublishingStats({
            author: authorId,
        });

        const recentNews = await News.find({
            author: authorId,
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title slug thumbnail type views createdAt");

        const totalViews = await News.aggregate([
            {
                $match: {
                    author: authorId,
                    type: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                },
            },
        ]);

        return res.status(200).json({
            status: true,
            message: "Correspondence dashboard data loaded",
            data: {
                ...stats,
                totalViews: totalViews[0]?.totalViews || 0,
                recentNews,
            },
        });
    } catch (error) {
        console.error("Correspondence Dashboard Error:", error);

        return res.status(500).json({
            status: false,
            message: "Unable to load correspondence dashboard",
        });
    }
};

export const getSubscriberDashboard = async (req, res) => {
    try {
        const customerId = req.user.customerId;

        const [totalViewed, recentViewed, mostViewed] = await Promise.all([
            NewsView.countDocuments({
                viewerId: customerId,
                viewerType: "customer",
            }),

            NewsView.aggregate([
                {
                    $match: {
                        viewerId: new mongoose.Types.ObjectId(String(customerId)),
                        viewerType: "customer",
                    },
                },
                { $sort: { viewedAt: -1 } },
                {
                    $group: {
                        _id: "$newsId",
                        lastViewedAt: { $first: "$viewedAt" },
                        viewCount: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: "news",
                        localField: "_id",
                        foreignField: "_id",
                        as: "news",
                    },
                },
                { $unwind: "$news" },
                {
                    $project: {
                        _id: "$news._id",
                        title: "$news.title",
                        slug: "$news.slug",
                        thumbnail: "$news.thumbnail",
                        lastViewedAt: 1,
                        viewCount: 1,
                    },
                },
                { $sort: { lastViewedAt: -1 } },
                { $limit: 10 },
            ]),

            NewsView.aggregate([
                {
                    $match: {
                        viewerId: new mongoose.Types.ObjectId(String(customerId)),
                        viewerType: "customer",
                    },
                },
                {
                    $group: {
                        _id: "$newsId",
                        viewCount: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: "news",
                        localField: "_id",
                        foreignField: "_id",
                        as: "news",
                    },
                },
                { $unwind: "$news" },
                {
                    $project: {
                        _id: "$news._id",
                        title: "$news.title",
                        slug: "$news.slug",
                        thumbnail: "$news.thumbnail",
                        viewCount: 1,
                    },
                },
                { $sort: { viewCount: -1 } },
                { $limit: 7 },
            ]),
        ]);

        return res.status(200).json({
            status: true,
            message: "Subscriber dashboard data loaded",
            data: {
                totalViewed,
                recentViewed,
                mostViewed,
            },
        });
    } catch (error) {
        console.error("Subscriber Dashboard Error:", error);

        return res.status(500).json({
            status: false,
            message: "Unable to load subscriber dashboard",
        });
    }
};
