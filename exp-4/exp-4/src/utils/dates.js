export function toDateString(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function parseDate(dateString) {
    const [year, month, day] =
        dateString.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}

export function isSameDay(dateA, dateB) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
}

export function startOfMonth(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );
}

export function getMonthDays(date) {
    const firstDay = startOfMonth(date);

    const firstWeekday = firstDay.getDay();

    const startDate = new Date(firstDay);

    startDate.setDate(
        firstDay.getDate() - firstWeekday
    );

    return Array.from(
        { length: 42 },
        (_, index) => {
            const day = new Date(startDate);

            day.setDate(
                startDate.getDate() + index
            );

            return day;
        }
    );
}

export function getWeekDays(date) {
    const result = new Date(date);

    result.setDate(
        result.getDate() - result.getDay()
    );

    return Array.from(
        { length: 7 },
        (_, index) => {
            const day = new Date(result);

            day.setDate(
                result.getDate() + index
            );

            return day;
        }
    );
}

export function formatMonthYear(date) {
    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        }
    );
}

export function formatDayLabel(date) {
    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            day: "numeric",
        }
    );
}

export function formatFullDate(date) {
    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );
}

export function formatHour(hour) {
    const suffix = hour >= 12 ? "PM" : "AM";

    const displayHour =
        hour % 12 || 12;

    return `${displayHour}:00 ${suffix}`;
}

export function timeToMinutes(time) {
    const [hours, minutes] =
        time.split(":").map(Number);

    return (
        hours * 60 + minutes
    );
}

export function addDays(date, amount) {
    const result = new Date(date);

    result.setDate(
        result.getDate() + amount
    );

    return result;
}