import React from "react";
import { trackRender } from "../utils/renderTracker";

function getPostClass(platform) {
    switch (platform?.toLowerCase()) {
        case "linkedin":
            return "post-linkedin";

        case "twitter":
            return "post-twitter";

        case "instagram":
            return "post-instagram";

        case "facebook":
            return "post-facebook";

        default:
            return "post-default";
    }
}

function CalendarEvent({ post, onClick }) {
    trackRender(`Post ${post.id}`);

    const postClass = getPostClass(post.platform);

    const handleDragStart = (event) => {
        event.dataTransfer.setData("postId", post.id);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <button
            type="button"
            className={`calendar-event ${postClass}`}
            draggable
            onDragStart={handleDragStart}
            onClick={() => onClick(post)}
            title={`${post.time} • ${post.title} • ${post.platform}`}
        >
            <span className="calendar-event-time">
                {post.time}
            </span>

            <span className="calendar-event-title">
                {post.title}
            </span>

            <span className="calendar-event-platform">
                {post.platform}
            </span>
        </button>
    );
}

export const MemoizedCalendarEvent = React.memo(
    CalendarEvent
);

export default CalendarEvent;