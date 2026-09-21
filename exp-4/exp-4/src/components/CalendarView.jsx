import {
    useCallback,
    useMemo,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    updatePostDate,
} from "../store/postsSlice";

import {
    addDays,
    formatDayLabel,
    formatHour,
    formatMonthYear,
    getMonthDays,
    getWeekDays,
    isSameDay,
    parseDate,
    timeToMinutes,
    toDateString,
} from "../utils/dates";

import {
    trackRender,
} from "../utils/renderTracker";

import CalendarEvent, {
    MemoizedCalendarEvent,
} from "./CalendarEvent";

function CalendarView({
    currentDate,
    view,
    optimizations,
    onPostClick,
}) {
    trackRender("CalendarView");

    const dispatch = useDispatch();

    const posts = useSelector(
        (state) => state.posts.posts
    );

    /*
     * New object every render.
     *
     * When useMemo/useCallback are disabled,
     * this deliberately invalidates memoization.
     */
    const unstableDependency = {};


    /* =====================================================
       MEMOIZED CALENDAR DATA
    ===================================================== */

    const monthDays = useMemo(
        () =>
            getMonthDays(
                currentDate
            ),
        [
            currentDate,
            optimizations.useMemo
                ? "stable"
                : unstableDependency,
        ]
    );


    const weekDays = useMemo(
        () =>
            getWeekDays(
                currentDate
            ),
        [
            currentDate,
            optimizations.useMemo
                ? "stable"
                : unstableDependency,
        ]
    );


    const sortedPosts = useMemo(
        () =>
            [...posts].sort(
                (a, b) =>
                    timeToMinutes(
                        a.time
                    ) -
                    timeToMinutes(
                        b.time
                    )
            ),
        [
            posts,
            optimizations.useMemo
                ? "stable"
                : unstableDependency,
        ]
    );


    /* =====================================================
       DRAG & DROP
    ===================================================== */

    const movePost = useCallback(
        (
            postId,
            targetDate,
            targetTime
        ) => {

            dispatch(
                updatePostDate({
                    id: postId,

                    date: targetDate,

                    time: targetTime,
                })
            );
        },

        optimizations.useCallback
            ? [dispatch]
            : [
                dispatch,
                unstableDependency,
            ]
    );


    const handleDrop = useCallback(
        (
            event,
            targetDate,
            targetTime
        ) => {

            event.preventDefault();

            const postId =
                event.dataTransfer.getData(
                    "postId"
                );

            if (!postId) {
                return;
            }

            movePost(
                postId,
                targetDate,
                targetTime
            );
        },

        optimizations.useCallback
            ? [movePost]
            : [
                movePost,
                unstableDependency,
            ]
    );


    const handleDragOver = useCallback(
        (event) => {
            event.preventDefault();

            event.dataTransfer.dropEffect =
                "move";
        },

        optimizations.useCallback
            ? []
            : [unstableDependency]
    );


    /* =====================================================
       EVENT COMPONENT
    ===================================================== */

    const EventComponent =
        optimizations.memo
            ? MemoizedCalendarEvent
            : CalendarEvent;


    /* =====================================================
       MONTH VIEW
    ===================================================== */

    if (view === "month") {

        return (
            <section className="calendar-section">

                <div className="calendar-heading">

                    <div>

                        <h2>
                            Content Calendar
                        </h2>

                        <p>
                            Drag a post to another date
                            or click it to edit.
                        </p>

                    </div>

                </div>

                <div className="month-calendar">

                    <div className="weekday-row">

                        {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                        ].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="weekday"
                                >
                                    {day}
                                </div>
                            )
                        )}

                    </div>


                    <div className="month-grid">

                        {monthDays.map(
                            (day) => {

                                const date =
                                    toDateString(
                                        day
                                    );

                                const dayPosts =
                                    sortedPosts.filter(
                                        (post) =>
                                            post.date === date
                                    );

                                const isCurrentMonth =
                                    day.getMonth() ===
                                    currentDate.getMonth();

                                const isToday =
                                    isSameDay(
                                        day,
                                        new Date()
                                    );

                                return (
                                    <div
                                        className={`month-cell ${
                                            isCurrentMonth
                                                ? ""
                                                : "outside-month"
                                        } ${
                                            isToday
                                                ? "today"
                                                : ""
                                        }`}

                                        key={date}

                                        onDragOver={
                                            handleDragOver
                                        }

                                        onDrop={(event) =>
                                            handleDrop(
                                                event,
                                                date,
                                                "10:00"
                                            )
                                        }
                                    >

                                        <div className="date-number">
                                            {day.getDate()}
                                        </div>

                                        <div className="day-events">

                                            {dayPosts.map(
                                                (post) => (
                                                    <EventComponent
                                                        key={
                                                            post.id
                                                        }
                                                        post={
                                                            post
                                                        }
                                                        onClick={
                                                            onPostClick
                                                        }
                                                    />
                                                )
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

            </section>
        );
    }


    /* =====================================================
       WEEK / DAY TIME GRID
    ===================================================== */

    const displayedDays =
        view === "week"
            ? weekDays
            : [
                currentDate,
            ];


    const hours = Array.from(
        { length: 13 },
        (_, index) => index + 8
    );


    return (
        <section className="calendar-section">

            <div className="calendar-heading">

                <div>

                    <h2>
                        {view === "week"
                            ? "Weekly Schedule"
                            : "Daily Schedule"}
                    </h2>

                    <p>
                        Drag a post onto another
                        time slot to reschedule it.
                    </p>

                </div>

            </div>


            <div className="time-grid">

                <div className="time-header-spacer" />

                {displayedDays.map(
                    (day) => (
                        <div
                            className={`time-day-header ${
                                isSameDay(
                                    day,
                                    new Date()
                                )
                                    ? "today"
                                    : ""
                            }`}
                            key={
                                toDateString(
                                    day
                                )
                            }
                        >
                            {formatDayLabel(
                                day
                            )}
                        </div>
                    )
                )}


                <div className="time-labels">

                    {hours.map(
                        (hour) => (
                            <div
                                className="time-label"
                                key={hour}
                            >
                                {formatHour(
                                    hour
                                )}
                            </div>
                        )
                    )}

                </div>


                {displayedDays.map(
                    (day) => {

                        const date =
                            toDateString(
                                day
                            );

                        const dayPosts =
                            sortedPosts.filter(
                                (post) =>
                                    post.date ===
                                    date
                            );

                        return (
                            <div
                                className="time-day-column"
                                key={date}
                            >

                                {hours.map(
                                    (hour) => {

                                        const hourTime =
                                            `${String(
                                                hour
                                            ).padStart(
                                                2,
                                                "0"
                                            )}:00`;

                                        return (
                                            <div
                                                className="time-slot"
                                                key={
                                                    hourTime
                                                }
                                                onDragOver={
                                                    handleDragOver
                                                }
                                                onDrop={(event) =>
                                                    handleDrop(
                                                        event,
                                                        date,
                                                        hourTime
                                                    )
                                                }
                                            />
                                        );
                                    }
                                )}


                                {dayPosts.map(
                                    (post) => {

                                        const minutes =
                                            timeToMinutes(
                                                post.time
                                            );

                                        const startMinutes =
                                            8 * 60;

                                        const top =
                                            Math.max(
                                                0,
                                                minutes -
                                                    startMinutes
                                            );

                                        const topPixels =
                                            (top / 60) *
                                            64;

                                        return (
                                            <div
                                                className="time-event-wrapper"
                                                key={
                                                    post.id
                                                }
                                                style={{
                                                    top:
                                                        `${topPixels}px`,
                                                }}
                                            >

                                                <EventComponent
                                                    post={
                                                        post
                                                    }
                                                    onClick={
                                                        onPostClick
                                                    }
                                                />

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        );
                    }
                )}

            </div>

        </section>
    );
}

export default CalendarView;