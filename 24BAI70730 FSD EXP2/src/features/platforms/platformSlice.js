import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  platforms: ["LinkedIn", "Twitter/X", "Instagram", "Facebook"],
};

const platformSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    addPlatform(state, action) {
      const name = action.payload.trim();
      if (name && !state.platforms.includes(name)) state.platforms.push(name);
    },
    removePlatform(state, action) {
      state.platforms = state.platforms.filter((p) => p !== action.payload);
    },
  },
});

export const { addPlatform, removePlatform } = platformSlice.actions;
export const selectPlatforms = (state) => state.platforms.platforms;

export default platformSlice.reducer;
