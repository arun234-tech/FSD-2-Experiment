import {
    beginRenderReset,
    finishRenderReset,
} from "../utils/renderTracker";

function OptimizationPanel({
    optimizations,
    setOptimizations,
    clockEnabled,
    setClockEnabled,
}) {
    const toggleOptimization = (name) => {
        /*
         * Start a completely new measurement session.
         * The counter immediately becomes 0.
         */
        beginRenderReset();

        /*
         * Apply the optimization change while the
         * tracker is still ignoring transition renders.
         */
        setOptimizations((previous) => ({
            ...previous,
            [name]: !previous[name],
        }));

        /*
         * Allow the browser to complete the state-change
         * render first, then start counting new renders.
         */
        requestAnimationFrame(() => {
            finishRenderReset();
        });
    };

    const toggleClock = () => {
        beginRenderReset();

        setClockEnabled(
            (previous) => !previous
        );

        requestAnimationFrame(() => {
            finishRenderReset();
        });
    };

    return (
        <section className="optimization-panel">
            <div className="optimization-header">
                <div>
                    <p className="section-eyebrow">
                        Experiment 1.4.2
                    </p>

                    <h2>
                        Performance Controls
                    </h2>
                </div>

                <p className="optimization-description">
                    Enable or disable individual React
                    performance optimizations and observe
                    their rendering impact.
                </p>
            </div>

            <div className="optimization-grid">

                {/* React.memo */}
                <div className="optimization-card">
                    <div className="optimization-card-content">
                        <div className="optimization-title-row">
                            <span className="optimization-title">
                                React.memo
                            </span>

                            <span
                                className={`optimization-status ${
                                    optimizations.memo
                                        ? "active"
                                        : ""
                                }`}
                            >
                                {optimizations.memo
                                    ? "ON"
                                    : "OFF"}
                            </span>
                        </div>

                        <p>
                            Prevent unnecessary child
                            renders when props remain
                            unchanged.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`toggle ${
                            optimizations.memo
                                ? "on"
                                : ""
                        }`}
                        onClick={() =>
                            toggleOptimization("memo")
                        }
                        aria-pressed={
                            optimizations.memo
                        }
                    >
                        <span />
                    </button>
                </div>

                {/* useMemo */}
                <div className="optimization-card">
                    <div className="optimization-card-content">
                        <div className="optimization-title-row">
                            <span className="optimization-title">
                                useMemo
                            </span>

                            <span
                                className={`optimization-status ${
                                    optimizations.useMemo
                                        ? "active"
                                        : ""
                                }`}
                            >
                                {optimizations.useMemo
                                    ? "ON"
                                    : "OFF"}
                            </span>
                        </div>

                        <p>
                            Memoize calculated values
                            to avoid unnecessary
                            recalculation.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`toggle ${
                            optimizations.useMemo
                                ? "on"
                                : ""
                        }`}
                        onClick={() =>
                            toggleOptimization(
                                "useMemo"
                            )
                        }
                        aria-pressed={
                            optimizations.useMemo
                        }
                    >
                        <span />
                    </button>
                </div>

                {/* useCallback */}
                <div className="optimization-card">
                    <div className="optimization-card-content">
                        <div className="optimization-title-row">
                            <span className="optimization-title">
                                useCallback
                            </span>

                            <span
                                className={`optimization-status ${
                                    optimizations.useCallback
                                        ? "active"
                                        : ""
                                }`}
                            >
                                {optimizations.useCallback
                                    ? "ON"
                                    : "OFF"}
                            </span>
                        </div>

                        <p>
                            Memoize callback references
                            passed to child components.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`toggle ${
                            optimizations.useCallback
                                ? "on"
                                : ""
                        }`}
                        onClick={() =>
                            toggleOptimization(
                                "useCallback"
                            )
                        }
                        aria-pressed={
                            optimizations.useCallback
                        }
                    >
                        <span />
                    </button>
                </div>

                {/* Live Clock */}
                <div className="optimization-card">
                    <div className="optimization-card-content">
                        <div className="optimization-title-row">
                            <span className="optimization-title">
                                Live Clock
                            </span>

                            <span
                                className={`optimization-status ${
                                    clockEnabled
                                        ? "active"
                                        : ""
                                }`}
                            >
                                {clockEnabled
                                    ? "ON"
                                    : "OFF"}
                            </span>
                        </div>

                        <p>
                            Update the clock every second
                            to observe continuous rendering
                            activity.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`toggle ${
                            clockEnabled
                                ? "on"
                                : ""
                        }`}
                        onClick={toggleClock}
                        aria-pressed={
                            clockEnabled
                        }
                    >
                        <span />
                    </button>
                </div>

            </div>
        </section>
    );
}

export default OptimizationPanel;