import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const Refunds = () => {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/refunds", {
          headers: { Authorization: token },
        });

        const formatted = res.data.map((expense) => ({
          id: expense._id,
          title: `${expense.title} - ₹${expense.amount} (${expense.refundStatus})`,
          start: new Date(expense.date),
          end: new Date(expense.date),
          allDay: true,
          status: expense.refundStatus,
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Fetch refunds error:", err);
      }
    };

    fetchRefunds();
  }, []);

  const handleSelectEvent = async (event) => {
    if (event.status === "claimed") return;

    const confirm = window.confirm("Mark this refund as claimed?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/api/refunds/${event.id}/claim`, {}, {
        headers: { Authorization: token },
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, status: "claimed", title: e.title.replace("pending", "claimed") } : e
        )
      );
    } catch (err) {
      console.error("Mark refund error:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">💸 Refund Reminder Calendar</h2>
      <p className="text-sm text-gray-600 mb-6">Click a refund to mark it as claimed.</p>

      <div className="bg-white rounded shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.status === "claimed" ? "#34D399" : "#FBBF24",
              color: "black",
              borderRadius: "5px",
              padding: "4px",
            },
          })}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
};

export default Refunds;
