import { useEffect, useState } from "react";

import {
    getRenderStats,
    resetRenderStats,
    subscribeToRenderStats,
} from "../utils/renderTracker";

function RenderingPanel() {
    const [stats, setStats] = useState(
        getRenderStats()
    );

    useEffect(() => {
        const unsubscribe =
            subscribeToRenderStats((newStats) => {
                setStats(newStats);
            });

        return unsubscribe;
    }, []);

    const handleReset = () => {
        resetRenderStats();
    };

    const sortedComponents = Object.entries(
        stats.counts
    ).sort(
        ([, countA], [, countB]) =>
            countB - countA
    );

    return (
        <aside className="rendering-panel">

            {/* Header */}
            <div className="rendering-panel-header">
                <div>
                    <p className="section-eyebrow">
                        Performance
                    </p>

                    <h2>
                        Rendering Monitor
                    </h2>
                </div>

                <button
                    type="button"
                    className="render-reset-btn"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>

            {/* Total renders */}
            <div className="render-total-card">
                <span className="render-total-label">
                    Total Renders
                </span>

                <strong
                    className={`render-total-number ${
                        stats.isResetting
                            ? "is-reset"
                            : ""
                    }`}
                >
                    {stats.isResetting
                        ? 0
                        : stats.total}
                </strong>

                <span className="render-total-description">
                    Renders recorded in the current
                    measurement session
                </span>
            </div>

            {/* Component renders */}
            <div className="render-section">

                <div className="render-section-header">
                    <span>
                        Component Renders
                    </span>

                    <span className="render-count-badge">
                        {sortedComponents.length}
                    </span>
                </div>

                {sortedComponents.length === 0 ? (
                    <div className="render-empty-state">

                        <div className="render-empty-icon">
                            —
                        </div>

                        <p>
                            No renders recorded.
                        </p>

                        <span>
                            Render activity will
                            appear here.
                        </span>

                    </div>
                ) : (
                    <div className="render-component-list">

                        {sortedComponents.map(
                            ([component, count]) => (
                                <div
                                    className="render-component-row"
                                    key={component}
                                >
                                    <div className="render-component-info">

                                        <span className="render-component-dot" />

                                        <span>
                                            {component}
                                        </span>

                                    </div>

                                    <strong>
                                        {count}
                                    </strong>
                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

            {/* Last render */}
            <div className="last-render-card">

                <div className="last-render-header">
                    Last Render
                </div>

                {stats.isResetting ||
                !stats.lastRender ? (
                    <div className="last-render-empty">
                        No render recorded
                    </div>
                ) : (
                    <div className="last-render-details">

                        <strong>
                            {stats.lastRender.component}
                        </strong>

                        <span>
                            {stats.lastRender.time}
                        </span>

                    </div>
                )}

            </div>

        </aside>
    );
}

export default RenderingPanel;