import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";

/** Sample seed data returned by the mock API */
const samplePosts = [
  {
    id: "p1",
    title: "React Basics",
    description: "A beginner friendly walkthrough of components, props and state.",
    platform: "LinkedIn",
    status: "Published",
    createdAt: "2026-06-02",
  },
  {
    id: "p2",
    title: "Redux Toolkit Guide",
    description: "Slices, reducers and the store explained with practical examples.",
    platform: "Twitter/X",
    status: "Draft",
    createdAt: "2026-06-11",
  },
  {
    id: "p3",
    title: "JavaScript Tips",
    description: "Ten ES6+ tricks that make everyday JavaScript far cleaner.",
    platform: "Instagram",
    status: "Published",
    createdAt: "2026-06-19",
  },
  {
    id: "p4",
    title: "CSS Grid Layout",
    description: "Building responsive dashboards without a single media query hack.",
    platform: "Facebook",
    status: "Draft",
    createdAt: "2026-07-04",
  },
  {
    id: "p5",
    title: "AI and Machine Learning",
    description: "How modern teams ship ML features without a research lab.",
    platform: "LinkedIn",
    status: "Published",
    createdAt: "2026-07-21",
  },
];

/** Mock API call: resolves the sample posts after a short delay */
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const data = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.97) reject(new Error("Network error"));
      else resolve(samplePosts);
    }, 900);
  });
  return data;
});

const initialState = {
  posts: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.unshift(action.payload);
        state.lastUpdated = action.payload.createdAt;
      },
      // prepare() lets components dispatch plain form values
      prepare(post) {
        return {
          payload: {
            id: nanoid(6),
            createdAt: new Date().toISOString().slice(0, 10),
            ...post,
          },
        };
      },
    },
    updatePost(state, action) {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload };
        state.lastUpdated = new Date().toISOString().slice(0, 10);
      }
    },
    deletePost(state, action) {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
      state.lastUpdated = new Date().toISOString().slice(0, 10);
    },
    toggleStatus(state, action) {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.status = post.status === "Published" ? "Draft" : "Published";
    },
    clearPosts(state) {
      state.posts = [];
      state.lastUpdated = new Date().toISOString().slice(0, 10);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.lastUpdated = new Date().toISOString().slice(0, 10);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load posts";
      });
  },
});

export const { addPost, updatePost, deletePost, toggleStatus, clearPosts } = postsSlice.actions;

/* Selectors keep components free of state-shape knowledge */
export const selectPosts = (state) => state.posts.posts;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectLastUpdated = (state) => state.posts.lastUpdated;

export default postsSlice.reducer;
