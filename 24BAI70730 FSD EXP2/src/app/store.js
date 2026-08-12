import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "@/features/posts/postsSlice";
import platformsReducer from "@/features/platforms/platformSlice";

/** Single centralized store — no prop drilling anywhere in the app */
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
  },
});
