const listeners = new Set();

let renderCounts = {};
let totalRenders = 0;
let lastRender = null;

let resetVersion = 0;
let isResetting = false;

function notifyListeners() {
    const stats = getRenderStats();

    listeners.forEach((listener) => {
        listener(stats);
    });
}

export function trackRender(componentName) {
    /*
     * IMPORTANT:
     * Renders caused by the reset itself or by the
     * optimization toggle that triggered the reset
     * are deliberately not counted.
     */
    if (isResetting) {
        return;
    }

    renderCounts[componentName] =
        (renderCounts[componentName] || 0) + 1;

    totalRenders++;

    lastRender = {
        component: componentName,
        time: new Date().toLocaleTimeString(),
    };

    notifyListeners();
}

export function getRenderStats() {
    return {
        counts: { ...renderCounts },
        total: totalRenders,
        lastRender,
        resetVersion,
        isResetting,
    };
}

export function subscribeToRenderStats(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

/*
 * Begin a new measurement session.
 *
 * This function ONLY resets the measurement.
 * It does NOT automatically resume tracking.
 */
export function beginRenderReset() {
    renderCounts = {};
    totalRenders = 0;
    lastRender = null;

    resetVersion++;
    isResetting = true;

    notifyListeners();
}

/*
 * Resume render tracking.
 */
export function finishRenderReset() {
    isResetting = false;

    notifyListeners();
}

/*
 * Manual reset from the Rendering Monitor.
 *
 * The reset stays active until the next animation
 * frame, so the visible 0 survives the reset render.
 */
export function resetRenderStats() {
    beginRenderReset();

    requestAnimationFrame(() => {
        finishRenderReset();
    });
}