# FSD Experiment 4 - Interactive Social Media Calendar

## Aim

To design and implement an interactive calendar interface for scheduling and managing social media posts.

## Objective

* To create an interactive calendar using React and FullCalendar.
* To allow users to add posts by clicking on a calendar date.
* To display scheduled posts on specific dates.
* To compare optimized and non-optimized code performance.
* To demonstrate the use of React useMemo for optimization.

## Technologies Used

* React.js
* JavaScript
* FullCalendar
* Vite
* HTML
* CSS

## Features

### 1. Interactive Calendar

The application displays a monthly calendar using FullCalendar.

### 2. Schedule Posts

Users can click on any date and enter a post title. The post is then displayed on the selected date.

### 3. Sample Posts

The application contains sample posts for September 2026:

* Instagram Post - September 15
* LinkedIn Post - September 17
* YouTube Post - September 20

### 4. Performance Comparison

The application compares:

* Non-Optimized execution
* Optimized execution using useMemo
* Performance improvement percentage

The execution time is measured using JavaScript's performance.now().

## Optimization

The optimized calculation uses React's useMemo hook to reduce unnecessary calculations.

This demonstrates how memoization can improve application performance.

## How to Run

### Step 1 - Install dependencies

```bash
npm install
```

### Step 2 - Start the development server

```bash
npm run dev
```

### Step 3 - Open the application

Open the localhost URL provided by Vite in your browser.

## Project Structure

```text
exp4-calendar/
|-- src/
|   |-- App.jsx
|   |-- main.jsx
|   |-- index.css
|
|-- public/
|-- package.json
|-- package-lock.json
|-- README.md
```

## Result

A functional interactive social media scheduling calendar was successfully developed using React and FullCalendar. The application allows users to schedule posts and compare optimized and non-optimized performance.

## Conclusion

The experiment demonstrates the implementation of an interactive calendar in React along with basic performance optimization using memoization.
