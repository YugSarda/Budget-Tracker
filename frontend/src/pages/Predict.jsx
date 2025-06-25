import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from "recharts";

export default function Predict() {
  const [hist, setHist] = useState([]);
  const [fore, setFore] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/analysis/forecast", {
          headers: { Authorization: token },
        });
        setHist(data.history);
        setFore(data.forecast);
      } catch (err) {
        console.error("Forecast fetch error:", err);
      }
    })();
  }, []);

  const combined = [...hist.map(p => ({ ...p, type: "Actual" })), ...fore.map(f => ({
    month: f.month, total: f.pred, upper: f.upper, lower: f.lower, type: "Forecast"
  }))];

  const nextMonth = fore[0]?.month ?? "n/a";
  const nextAmt   = fore[0]?.pred ?? 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔮 Expense Forecast</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-lg font-semibold">
          Predicted total expense for <span className="font-bold">{nextMonth}</span>:
        </p>
        <p className="text-3xl text-indigo-600 font-bold">₹{nextAmt}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Trend &amp; Forecast (±1 σ)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={combined}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="total"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive
            />
            <Line
              dataKey="total"
              data={combined.filter(d => d.type === "Forecast")}
              stroke="#DC2626"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4 }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Confidence band for forecast */}
        {fore.length > 0 && (
          <ResponsiveContainer width="100%" height={160} className="mt-4">
            <AreaChart data={fore}>
              <defs>
                <linearGradient id="conf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#93C5FD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="url(#conf)"
                connectNulls
                baseValue={d => d.lower}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
