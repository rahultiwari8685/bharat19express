import axios from "axios";

let cache = null;
let lastFetch = 0;

export const checkLiveStatus = async () => {
  if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
    console.error("Missing YouTube config");
    return { isLive: false };
  }

  const now = Date.now();

  if (cache && now - lastFetch < 60000) {
    return cache;
  }

  try {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        timeout: 5000,
        params: {
          part: "snippet",
          channelId: process.env.YOUTUBE_CHANNEL_ID,
          eventType: "live",
          type: "video",
          key: process.env.YOUTUBE_API_KEY,
        },
      },
    );

    let result = { isLive: false };

    if (res?.data?.items?.length > 0) {
      const liveVideo = res.data.items[0];

      result = {
        isLive: true,
        videoId: liveVideo.id?.videoId,
        title: liveVideo.snippet?.title,
      };
    }

    cache = result;
    lastFetch = now;

    return result;
  } catch (err) {
    console.error("YouTube API error:", err.message);

    return cache || { isLive: false };
  }
};
