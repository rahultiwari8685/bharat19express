import axios from "axios";

// export const checkLiveStatus = async () => {
//   if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
//     console.error("Missing YouTube config");
//     return { isLive: false };
//   }

//   const now = Date.now();

//   if (cache && now - lastFetch < 60000) {
//     return cache;
//   }

//   try {
//     const res = await axios.get(
//       "https://www.googleapis.com/youtube/v3/search",
//       {
//         timeout: 5000,
//         params: {
//           part: "snippet",
//           channelId: process.env.YOUTUBE_CHANNEL_ID,
//           eventType: "live",
//           type: "video",
//           key: process.env.YOUTUBE_API_KEY,
//         },
//       },
//     );

//     let result = { isLive: false };

//     if (res?.data?.items?.length > 0) {
//       const liveVideo = res.data.items[0];

//       result = {
//         isLive: true,
//         videoId: liveVideo.id?.videoId,
//         title: liveVideo.snippet?.title,
//       };
//     }

//     cache = result;
//     lastFetch = now;

//     return result;
//   } catch (err) {
//     console.error("YouTube API error:", err.message);

//     return cache || { isLive: false };
//   }
// };

let liveCache = null;
let liveLastFetch = 0;

// Cache latest videos for 10 minutes
let videosCache = null;
let videosLastFetch = 0;

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

/*
|--------------------------------------------------------------------------
| Bharat 19 YouTube Channels
|--------------------------------------------------------------------------
*/

const YOUTUBE_CHANNELS = [
  {
    name: "भारत 19 एक्सप्रेस",
    channelId: "UCygk_AnahPPNje9H3NLK1tA",
  },
  {
    name: "Bharat 19 Entertainment",
    channelId: "UCkJQAejO5Zx1TaQzzA_3Hvg",
  },
  {
    name: "Bharat 19 Express Regional",
    channelId: "UC7_OlirbGWvmG0-0Nc3WedA",
  },
  {
    name: "Bharat 19 Express Nation",
    channelId: "UC0lg7tqrUdlky_u1Wug7uEw",
  },
];

/*
|--------------------------------------------------------------------------
| Check Live Status
|--------------------------------------------------------------------------
| Your existing functionality
|--------------------------------------------------------------------------
*/

export const checkLiveStatus = async () => {
  if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
    console.error("Missing YouTube config");

    return {
      isLive: false,
    };
  }

  const now = Date.now();

  if (liveCache && now - liveLastFetch < 60000) {
    return liveCache;
  }

  try {
    const res = await axios.get(`${YOUTUBE_API_URL}/search`, {
      timeout: 5000,
      params: {
        part: "snippet",
        channelId: process.env.YOUTUBE_CHANNEL_ID,
        eventType: "live",
        type: "video",
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    let result = {
      isLive: false,
    };

    if (res?.data?.items?.length > 0) {
      const liveVideo = res.data.items[0];

      result = {
        isLive: true,
        videoId: liveVideo.id?.videoId,
        title: liveVideo.snippet?.title,
      };
    }

    liveCache = result;
    liveLastFetch = now;

    return result;
  } catch (err) {
    console.error("YouTube Live API error:", err.message);

    return (
      liveCache || {
        isLive: false,
      }
    );
  }
};

/*
|--------------------------------------------------------------------------
| Get Latest Videos From All 4 Channels
|--------------------------------------------------------------------------
*/

export const getLatestYouTubeVideos = async () => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is missing");
  }

  const now = Date.now();

  /*
    |--------------------------------------------------------------------------
    | Return cache if less than 10 minutes old
    |--------------------------------------------------------------------------
    */

  if (videosCache && now - videosLastFetch < 10 * 60 * 1000) {
    return videosCache;
  }

  /*
    |--------------------------------------------------------------------------
    | Get channel details for all 4 channels
    |--------------------------------------------------------------------------
    */

  const channelIds = YOUTUBE_CHANNELS.map((channel) => channel.channelId).join(
    ",",
  );

  const channelResponse = await axios.get(`${YOUTUBE_API_URL}/channels`, {
    timeout: 10000,

    params: {
      part: "contentDetails,snippet",
      id: channelIds,
      key: process.env.YOUTUBE_API_KEY,
    },
  });

  const channelItems = channelResponse.data?.items || [];

  /*
    |--------------------------------------------------------------------------
    | Get latest 5 videos for every channel
    |--------------------------------------------------------------------------
    */

  const channelResults = await Promise.all(
    YOUTUBE_CHANNELS.map(async (channel) => {
      const channelData = channelItems.find(
        (item) => item.id === channel.channelId,
      );

      if (!channelData) {
        return {
          channelName: channel.name,

          channelId: channel.channelId,

          channelThumbnail: "",

          videos: [],
        };
      }

      const uploadsPlaylistId =
        channelData.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        return {
          channelName: channel.name,

          channelId: channel.channelId,

          channelThumbnail: channelData.snippet?.thumbnails?.default?.url || "",

          videos: [],
        };
      }

      /*
            |--------------------------------------------------------------------------
            | Get latest 5 uploads
            |--------------------------------------------------------------------------
            */

      const playlistResponse = await axios.get(
        `${YOUTUBE_API_URL}/playlistItems`,
        {
          timeout: 10000,

          params: {
            part: "snippet,contentDetails",

            playlistId: uploadsPlaylistId,

            maxResults: 5,

            key: process.env.YOUTUBE_API_KEY,
          },
        },
      );

      const videos = (playlistResponse.data?.items || [])
        .map((item) => {
          const videoId = item.contentDetails?.videoId;

          if (!videoId) {
            return null;
          }

          return {
            videoId,

            title: item.snippet?.title || "",

            description: item.snippet?.description || "",

            thumbnail:
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.default?.url ||
              "",

            publishedAt:
              item.contentDetails?.videoPublishedAt ||
              item.snippet?.publishedAt ||
              "",

            channelName: channel.name,

            channelId: channel.channelId,
          };
        })
        .filter(Boolean);

      /*
            |--------------------------------------------------------------------------
            | Ensure newest first
            |--------------------------------------------------------------------------
            */

      videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      return {
        channelName: channel.name,

        channelId: channel.channelId,

        channelThumbnail:
          channelData.snippet?.thumbnails?.high?.url ||
          channelData.snippet?.thumbnails?.default?.url ||
          "",

        videos,
      };
    }),
  );

  /*
    |--------------------------------------------------------------------------
    | Save cache
    |--------------------------------------------------------------------------
    */

  videosCache = channelResults;

  videosLastFetch = now;

  return channelResults;
};
