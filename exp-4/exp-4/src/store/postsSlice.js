import { createSlice } from "@reduxjs/toolkit";

const today = new Date();

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const addDays = (date, amount) => {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
};

const initialState = {
    posts: [
        {
            id: "post-1",
            title: "React Performance Tips",
            platform: "LinkedIn",
            date: formatDate(today),
            time: "10:00",
        },
        {
            id: "post-2",
            title: "JavaScript Weekly Update",
            platform: "Twitter",
            date: formatDate(addDays(today, 1)),
            time: "14:00",
        },
        {
            id: "post-3",
            title: "Frontend Development Guide",
            platform: "Instagram",
            date: formatDate(addDays(today, 2)),
            time: "11:30",
        },
        {
            id: "post-4",
            title: "New Product Announcement",
            platform: "Facebook",
            date: formatDate(addDays(today, 4)),
            time: "16:00",
        },
        {
            id: "post-5",
            title: "Understanding React Hooks",
            platform: "LinkedIn",
            date: formatDate(addDays(today, 6)),
            time: "09:30",
        },
    ],
};

const postsSlice = createSlice({
    name: "posts",

    initialState,

    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },

        updatePost: (state, action) => {
            const index = state.posts.findIndex(
                (post) => post.id === action.payload.id
            );

            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },

        deletePost: (state, action) => {
            state.posts = state.posts.filter(
                (post) => post.id !== action.payload
            );
        },

        updatePostDate: (state, action) => {
            const post = state.posts.find(
                (item) => item.id === action.payload.id
            );

            if (!post) {
                return;
            }

            if (action.payload.date) {
                post.date = action.payload.date;
            }

            if (action.payload.time) {
                post.time = action.payload.time;
            }
        },
    },
});

export const {
    addPost,
    updatePost,
    deletePost,
    updatePostDate,
} = postsSlice.actions;

export default postsSlice.reducer;