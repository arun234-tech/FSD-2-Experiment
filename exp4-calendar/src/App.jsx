import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function App() {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "📸 Instagram Post",
      date: "2026-09-15",
    },
    {
      id: "2",
      title: "💼 LinkedIn Post",
      date: "2026-09-17",
    },
    {
      id: "3",
      title: "▶️ YouTube Post",
      date: "2026-09-20",
    },
  ]);

  // Non-optimized
  const nonOptimizedStart = performance.now();

  let nonOptimizedResult = 0;

  for (let i = 0; i < 1000000; i++) {
    nonOptimizedResult += Math.sqrt(i);
  }

  const nonOptimizedTime =
    performance.now() - nonOptimizedStart;

  // Optimized using useMemo
  const optimizedStart = performance.now();

  const optimizedResult = useMemo(() => {
    let result = 0;

    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i);
    }

    return result;
  }, []);

  const optimizedTime =
    performance.now() - optimizedStart;

  const improvement =
    nonOptimizedTime > 0
      ? ((nonOptimizedTime - optimizedTime) /
          nonOptimizedTime) *
        100
      : 0;

  const handleDateClick = (info) => {
    const title = prompt("Enter post title:");

    if (title) {
      setEvents((previousEvents) => [
        ...previousEvents,
        {
          id: String(previousEvents.length + 1),
          title: title,
          date: info.dateStr,
        },
      ]);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1>📅 Social Media Post Scheduler</h1>

        <p style={{ color: "#666" }}>
          Interactive Calendar for Scheduling and Managing Posts
        </p>

        <h2>⚡ Performance Comparison</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "#ffecec",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>❌ Non-Optimized</h3>
            <h2>{nonOptimizedTime.toFixed(2)} ms</h2>
            <p>More calculations</p>
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "#ecfff0",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>✅ Optimized</h3>
            <h2>{optimizedTime.toFixed(2)} ms</h2>
            <p>Uses memoization</p>
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "#eef3ff",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>📈 Improvement</h3>
            <h2>{Math.max(improvement, 0).toFixed(2)}%</h2>
            <p>Performance difference</p>
          </div>
        </div>

        <h2>📆 Content Calendar</h2>

        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          initialDate="2026-09-01"
          events={events}
          dateClick={handleDateClick}
          height="650px"
        />
      </div>
    </div>
  );
}

export default App;