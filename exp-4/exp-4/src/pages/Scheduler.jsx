import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    trackRender,
} from "../utils/renderTracker";

import CalendarView from "../components/CalendarView";
import OptimizationPanel from "../components/OptimizationPanel";
import RenderingPanel from "../components/RenderingPanel";
import PostModal from "../components/PostModal";

function Scheduler() {

    trackRender("Scheduler");

    /* =====================================================
       CALENDAR STATE
    ===================================================== */

    const [currentDate, setCurrentDate] =
        useState(new Date());

    const [view, setView] =
        useState("month");


    /* =====================================================
       OPTIMIZATION STATE
    ===================================================== */

    const [optimizations, setOptimizations] =
        useState({
            memo: true,
            useMemo: true,
            useCallback: true,
        });


    /* =====================================================
       LIVE CLOCK
    ===================================================== */

    const [clockEnabled, setClockEnabled] =
        useState(true);

    const [clock, setClock] =
        useState(new Date());


    useEffect(() => {

        if (!clockEnabled) {
            return;
        }

        const timer = setInterval(() => {
            setClock(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };

    }, [clockEnabled]);


    /* =====================================================
       POST MODAL
    ===================================================== */

    const [selectedPost, setSelectedPost] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);


    const handlePostClick = useCallback(
        (post) => {

            setSelectedPost(post);

            setModalOpen(true);

        },
        []
    );


    const handleNewPost = () => {

        setSelectedPost(null);

        setModalOpen(true);

    };


    const closeModal = () => {

        setModalOpen(false);

        setSelectedPost(null);

    };


    /* =====================================================
       CALENDAR NAVIGATION
    ===================================================== */

    const movePrevious = () => {

        const nextDate =
            new Date(currentDate);

        if (view === "month") {

            nextDate.setMonth(
                nextDate.getMonth() - 1
            );

        } else if (view === "week") {

            nextDate.setDate(
                nextDate.getDate() - 7
            );

        } else {

            nextDate.setDate(
                nextDate.getDate() - 1
            );
        }

        setCurrentDate(nextDate);
    };


    const moveNext = () => {

        const nextDate =
            new Date(currentDate);

        if (view === "month") {

            nextDate.setMonth(
                nextDate.getMonth() + 1
            );

        } else if (view === "week") {

            nextDate.setDate(
                nextDate.getDate() + 7
            );

        } else {

            nextDate.setDate(
                nextDate.getDate() + 1
            );
        }

        setCurrentDate(nextDate);
    };


    const goToday = () => {

        setCurrentDate(
            new Date()
        );

    };


    /* =====================================================
       PAGE TITLE
    ===================================================== */

    const pageTitle =
        view === "month"
            ? currentDate.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric",
                }
            )
            : currentDate.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                }
            );


    return (
        <main className="scheduler-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="top-header">

                <div>

                    <span className="eyebrow">
                        Experiment 4
                    </span>

                    <h1>
                        Interactive Calendar
                    </h1>

                    <p>
                        Schedule posts and analyze
                        React rendering performance.
                    </p>

                </div>


                {/* =================================================
                    LIVE CLOCK
                ================================================= */}

                <div
                    className={`clock-card ${
                        clockEnabled
                            ? ""
                            : "clock-disabled"
                    }`}
                >

                    <div className="clock-label">

                        <span
                            className={`clock-dot ${
                                clockEnabled
                                    ? "active"
                                    : ""
                            }`}
                        />

                        Live Clock

                    </div>


                    <strong>

                        {clockEnabled
                            ? clock.toLocaleTimeString()
                            : "Clock Off"}

                    </strong>


                    <span>

                        {clockEnabled
                            ? clock.toLocaleDateString()
                            : "Rendering updates paused"}

                    </span>

                </div>

            </header>


            {/* =================================================
                CALENDAR NAVIGATION
            ================================================= */}

            <section className="calendar-controls">

                <div className="navigation-controls">

                    <button
                        type="button"
                        className="control-btn"
                        onClick={movePrevious}
                        aria-label="Previous"
                    >
                        ←
                    </button>


                    <button
                        type="button"
                        className="control-btn"
                        onClick={goToday}
                    >
                        Today
                    </button>


                    <button
                        type="button"
                        className="control-btn"
                        onClick={moveNext}
                        aria-label="Next"
                    >
                        →
                    </button>

                </div>


                <h2>
                    {pageTitle}
                </h2>


                <div className="view-switcher">

                    <button
                        type="button"
                        className={
                            view === "month"
                                ? "view-btn active"
                                : "view-btn"
                        }
                        onClick={() =>
                            setView("month")
                        }
                    >
                        Month
                    </button>


                    <button
                        type="button"
                        className={
                            view === "week"
                                ? "view-btn active"
                                : "view-btn"
                        }
                        onClick={() =>
                            setView("week")
                        }
                    >
                        Week
                    </button>


                    <button
                        type="button"
                        className={
                            view === "day"
                                ? "view-btn active"
                                : "view-btn"
                        }
                        onClick={() =>
                            setView("day")
                        }
                    >
                        Day
                    </button>

                </div>

            </section>


            {/* =================================================
                SCHEDULE POST
            ================================================= */}

            <div className="action-row">

                <button
                    type="button"
                    className="primary-btn"
                    onClick={handleNewPost}
                >
                    + Schedule Post
                </button>

            </div>


            {/* =================================================
                OPTIMIZATION CONTROLS
            ================================================= */}

            <OptimizationPanel

                optimizations={
                    optimizations
                }

                setOptimizations={
                    setOptimizations
                }

                clockEnabled={
                    clockEnabled
                }

                setClockEnabled={
                    setClockEnabled
                }

            />


            {/* =================================================
                CALENDAR + RENDER MONITOR
            ================================================= */}

            <div className="main-layout">

                <CalendarView

                    currentDate={
                        currentDate
                    }

                    view={
                        view
                    }

                    optimizations={
                        optimizations
                    }

                    onPostClick={
                        handlePostClick
                    }

                />


                <RenderingPanel />

            </div>


            {/* =================================================
                POST MODAL
            ================================================= */}

            {modalOpen && (

                <PostModal

                    post={
                        selectedPost
                    }

                    onClose={
                        closeModal
                    }

                />

            )}

        </main>
    );
}

export default Scheduler;