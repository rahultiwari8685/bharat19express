
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./pages/home/about";
import Contact from "./pages/home/contact";
import Post1 from "./pages/home/post1";
import LayoutTheme2 from "./component/Layout/LayoutTheme2";
import HomeTwo from "./pages/homeTwo";
import HomeTwoBusiness from "./pages/homeTwo/business";
import HomeTwoEntertainment from "./pages/homeTwo/entertainment";
import HomeTwoFeature from "./pages/homeTwo/Feature";
import HomeTwoTrending from "./pages/homeTwo/trending";
import HomeTwoSports from "./pages/homeTwo/sports";
import HomeTwoArchive from "./pages/homeTwo/archive";
import HomeTwoPost2 from "./pages/homeTwo/post2";
import HomeTwoPost3 from "./pages/homeTwo/post3";
import HomeTwoVideoPost1 from "./pages/homeTwo/video_post1";
import HomeTwoVideoPost2 from "./pages/homeTwo/video_post2";
import HomeTwoVideoPost3 from "./pages/homeTwo/video_post3";
import HomeTwoAudioPost1 from "./pages/homeTwo/audio_post1";
import HomeTwoAudioPost2 from "./pages/homeTwo/audio_post2";
import HomeTwoAudioPost3 from "./pages/homeTwo/audio_post3";
import HomeTwoLeftPost2 from "./pages/homeTwo/left_post2";

import Category from "./pages/home/category";
import SubscriberLogin from "./pages/homeTwo/subscriberLogin";
import SubscriberRegister from "./pages/homeTwo/subscriberRegister";
import Epaper from "./pages/homeTwo/epaper/Epaper";
import EpaperReader from "./pages/homeTwo/epaper/EpaperReader";
import Gallery from "./pages/homeTwo/Gallery";
import Privacy from "./pages/homeTwo/privacy";
import SearchNews from "./pages/homeTwo/searchNews";
const router = createBrowserRouter([
  {
    path: "/",
    Component: LayoutTheme2,
    children: [
      {
        index: true,
        element: <HomeTwo />,
      },
      {
        path: "category/:categoryId",
        element: <Category />,
      },
      { path: "/login", element: <SubscriberLogin /> },
      { path: "/register", element: <SubscriberRegister /> },
      { path: "/search", element: <SearchNews /> },
      { path: "/epaper", element: <Epaper /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/epaper/read/:id", element: <EpaperReader /> },
      {
        path: "business",
        element: <HomeTwoBusiness />,
      },
      {
        path: "entertainment",
        element: <HomeTwoEntertainment />,
      },
      {
        path: "features",
        element: <HomeTwoFeature />,
      },
      {
        path: "trending",
        element: <HomeTwoTrending />,
      },
      {
        path: "sports",
        element: <HomeTwoSports />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "archive",
        element: <HomeTwoArchive />,
      },
      {
        path: "contact",
        element: <Contact />,
      },

      {
        path: "/:categorySlug/:slug",
        element: <Post1 />,
      },
      {
        path: "post2",
        element: <HomeTwoPost2 />,
      },
      {
        path: "post3",
        element: <HomeTwoPost3 />,
      },
      {
        path: "video_post1",
        element: <HomeTwoVideoPost1 />,
      },
      {
        path: "video_post2",
        element: <HomeTwoVideoPost2 />,
      },
      {
        path: "video_post3",
        element: <HomeTwoVideoPost3 />,
      },
      {
        path: "audio_post1",
        element: <HomeTwoAudioPost1 />,
      },
      {
        path: "audio_post2",
        element: <HomeTwoAudioPost2 />,
      },
      {
        path: "audio_post3",
        element: <HomeTwoAudioPost3 />,
      },
      {
        path: "left_post2",
        element: <HomeTwoLeftPost2 />,
      },
    ],
  },
 
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
