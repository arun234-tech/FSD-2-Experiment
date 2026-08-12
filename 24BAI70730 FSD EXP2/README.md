# Redux Post Hub

Build a React Redux Toolkit State Management Demo

Create a modern React web application that demonstrates centralized state management using Redux Toolkit and React-Redux.

Project Goal

Build a simple "Post Management Dashboard" where users can view, add, edit, and delete posts while managing application state through Redux Toolkit instead of local component state.

Tech Stack

React.js (latest)

Redux Toolkit

React-Redux

JavaScript (ES6+)

CSS (responsive, modern UI)

Features

1. Dashboard

Display a page title: Redux Toolkit Post Manager

Show summary cards:

Total Posts

Total Platforms

Last Updated

2. Posts Management

Display posts in a responsive table.

Each post should contain:

ID

Title

Description

Platform

Status (Draft/Published)

Created Date

Actions (Edit/Delete)

Include buttons:

Add Post

Edit Post

Delete Post

3. Platform Management

Maintain a separate Redux slice for platforms.

Default platforms:

LinkedIn

Twitter/X

Instagram

Facebook

Allow users to:

Add Platform

Remove Platform

4. Redux Store

Create a Redux store using configureStore().

Create two slices:

postsSlice

State:

{
  posts: []
}


Reducers:

addPost

updatePost

deletePost

toggleStatus

clearPosts

platformSlice

State:

{
  platforms: []
}


Reducers:

addPlatform

removePlatform

5. State Management

Use:

useSelector()

useDispatch()

No prop drilling should be used.

6. Forms

Create a modal or form to:

Add Post

Edit Post

Fields:

Title

Description

Platform (Dropdown)

Status

Validation:

Required fields

Title minimum 3 characters

7. UI Design

Use a professional dashboard layout with:

Sidebar

Navbar

Cards

Responsive table

Modern buttons

Clean typography

Light theme with blue accent colors

Mobile responsive

8. Folder Structure

src/
│
├── app/
│   └── store.js
│
├── features/
│   ├── posts/
│   │   └── postsSlice.js
│   └── platforms/
│       └── platformSlice.js
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── PostTable.jsx
│   ├── PostForm.jsx
│   └── DashboardCards.jsx
│
├── pages/
│   └── Dashboard.jsx
│
├── App.jsx
└── index.js


9. Sample Data

Create at least five sample posts.

Example:

React Basics

Redux Toolkit Guide

JavaScript Tips

CSS Grid Layout

AI and Machine Learning

Each should have different platforms and statuses.

10. Optional Async Feature

Implement a mock API using createAsyncThunk().

Create:

fetchPosts()

Show:

Loading spinner

Error message

Successfully loaded posts

11. Code Quality

Use functional components only.

Follow React best practices.

Keep code modular.

Comment important sections.

Use clean variable names.

12. Final Deliverable

Generate a fully working React project that includes:

Complete source code

Redux Toolkit implementation

Responsive UI

CRUD operations

Mock API support

Proper folder structure

Ready to run using:

npm install
npm start


The final application should look like a professional admin dashboard suitable for a college practical demonstration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2ae70eac-6a5d-4120-a6cb-38f761259072).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
