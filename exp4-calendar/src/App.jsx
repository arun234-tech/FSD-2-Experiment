import {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";

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

  const [showForm, setShowForm] = useState(false);

  const [postTitle, setPostTitle] = useState("");

  const [postDate, setPostDate] =
    useState("2026-09-22");

  const [renderTime, setRenderTime] = useState(0);

  const renderStart = useRef(performance.now());


  // ==========================================
  // NON-OPTIMIZED PERFORMANCE
  // ==========================================

  const nonOptimizedStart =
    performance.now();

  let nonOptimizedResult = 0;

  for (let i = 0; i < 1000000; i++) {
    nonOptimizedResult += Math.sqrt(i);
  }

  const nonOptimizedTime =
    performance.now() -
    nonOptimizedStart;


  // ==========================================
  // OPTIMIZED PERFORMANCE
  // ==========================================

  const optimizedStart =
    performance.now();

  const optimizedResult = useMemo(() => {
    let result = 0;

    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i);
    }

    return result;
  }, []);

  const optimizedTime =
    performance.now() -
    optimizedStart;


  // ==========================================
  // IMPROVEMENT
  // ==========================================

  const improvement =
    nonOptimizedTime > 0
      ? (
          ((nonOptimizedTime -
            optimizedTime) /
            nonOptimizedTime) *
          100
        )
      : 0;


  // ==========================================
  // RENDERING TIME
  // ==========================================

  useEffect(() => {
    const time =
      performance.now() -
      renderStart.current;

    setRenderTime(time.toFixed(2));
  }, [events]);


  // ==========================================
  // ADD POST
  // ==========================================

  const handleAddPost = () => {
    if (postTitle.trim() === "") {
      alert("Please enter a post title.");
      return;
    }

    if (postDate === "") {
      alert("Please select a date.");
      return;
    }

    const newPost = {
      id: String(Date.now()),
      title: postTitle,
      date: postDate,
    };

    setEvents((previousEvents) => [
      ...previousEvents,
      newPost,
    ]);

    setPostTitle("");

    setPostDate("2026-09-22");

    setShowForm(false);

    renderStart.current =
      performance.now();
  };


  // ==========================================
  // CLICK DATE
  // ==========================================

  const handleDateClick = (info) => {
    setPostDate(info.dateStr);

    setShowForm(true);
  };


  // ==========================================
  // DRAG & DROP
  // ==========================================

  const handleEventDrop = (info) => {
    const newDate =
      info.event.startStr;

    const eventId =
      info.event.id;

    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              date: newDate,
            }
          : event
      )
    );

    renderStart.current =
      performance.now();
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
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >

        {/* HEADER */}

        <h1>
          📅 Social Media Post Scheduler
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Interactive Calendar for Scheduling,
          Managing and Rescheduling Posts
        </p>


        {/* PERFORMANCE */}

        <h2>
          ⚡ Performance Comparison
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >

          {/* NON OPTIMIZED */}

          <div
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "20px",
              background: "#ffecec",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >

            <h3>
              ❌ Non-Optimized
            </h3>

            <h2>
              {nonOptimizedTime.toFixed(2)}
              {" ms"}
            </h2>

            <p>
              More calculations
            </p>

          </div>


          {/* OPTIMIZED */}

          <div
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "20px",
              background: "#ecfff0",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >

            <h3>
              ✅ Optimized
            </h3>

            <h2>
              {optimizedTime.toFixed(2)}
              {" ms"}
            </h2>

            <p>
              Uses memoization
            </p>

          </div>


          {/* IMPROVEMENT */}

          <div
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "20px",
              background: "#eef3ff",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >

            <h3>
              📈 Improvement
            </h3>

            <h2>
              {Math.max(
                improvement,
                0
              ).toFixed(2)}
              {"%"}
            </h2>

            <p>
              Performance difference
            </p>

          </div>


          {/* RENDERING */}

          <div
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "20px",
              background: "#fff8e7",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >

            <h3>
              🖥️ Rendering Time
            </h3>

            <h2>
              {renderTime} ms
            </h2>

            <p>
              UI update rendering
            </p>

          </div>

        </div>


        {/* CALENDAR HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >

          <h2 style={{ margin: 0 }}>
            📆 Content Calendar
          </h2>

          <button
            onClick={() =>
              setShowForm(!showForm)
            }
            style={{
              padding: "12px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            + Add Post
          </button>

        </div>


        {/* ADD POST FORM */}

        {showForm && (
          <div
            style={{
              background: "#f8fafc",
              border:
                "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "25px",
            }}
          >

            <h3>
              ➕ Schedule New Post
            </h3>

            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "end",
                flexWrap: "wrap",
              }}
            >

              {/* TITLE */}

              <div
                style={{
                  flex: 2,
                }}
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Post Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Instagram Campaign"
                  value={postTitle}
                  onChange={(e) =>
                    setPostTitle(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    border:
                      "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "15px",
                  }}
                />

              </div>


              {/* DATE */}

              <div
                style={{
                  flex: 1,
                }}
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Post Date
                </label>

                <input
                  type="date"
                  value={postDate}
                  onChange={(e) =>
                    setPostDate(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border:
                      "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "15px",
                  }}
                />

              </div>


              {/* SAVE */}

              <button
                onClick={handleAddPost}
                style={{
                  padding:
                    "11px 20px",
                  backgroundColor:
                    "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                ✓ Schedule Post
              </button>

            </div>

          </div>
        )}


        {/* DRAG & DROP INFORMATION */}

        <div
          style={{
            padding: "12px 15px",
            background: "#f0f7ff",
            borderRadius: "8px",
            marginBottom: "15px",
            color: "#333",
          }}
        >
          💡 <strong>Tip:</strong> Drag any scheduled
          post to another date to reschedule it.
        </div>


        {/* CALENDAR */}

        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          initialDate="2026-09-01"
          events={events}
          dateClick={handleDateClick}
          eventDrop={handleEventDrop}
          editable={true}
          eventDurationEditable={false}
          height="650px"
        />

      </div>

    </div>
  );
}

export default App;