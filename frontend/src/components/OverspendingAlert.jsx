import { useEffect, useState } from "react";
import axios from "axios";

export default function OverspendingAlert() {
  const [limits, setLimits] = useState([]);
  const [form, setForm] = useState({ category: "", limit: "" });
  const token = localStorage.getItem("token");

  const fetchLimits = async () => {
    const res = await axios.get("http://localhost:5000/api/alerts/limits", {
      headers: { Authorization: token },
    });
    setLimits(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/alerts/set-limit", form, {
      headers: { Authorization: token },
    });
    setForm({ category: "", limit: "" });
    fetchLimits();
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-2">Set Category Spending Limits</h3>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border px-3 py-2 rounded w-1/2"
          required
        />
        <input
          placeholder="Limit ₹"
          type="number"
          value={form.limit}
          onChange={(e) => setForm({ ...form, limit: e.target.value })}
          className="border px-3 py-2 rounded w-1/2"
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">Set</button>
      </form>
      <ul className="text-sm text-gray-700">
        {limits.map((l, idx) => (
          <li key={idx}>💡 {l.category}: ₹{l.limit}</li>
        ))}
      </ul>
    </div>
  );
}
