
import { useEffect, useState } from "react";
import axios from "axios";
import {  FiPlus, FiDollarSign, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaPiggyBank, FaUtensils, FaPlane, FaSmile, FaMeh, FaFrown } from "react-icons/fa";
import ReceiptScanner from "../components/ReceiptScanner"; // Import your receipt scanner component
// import { useFinance } from "../contexts/FinanceContext.jsx"; // Import the Finance context
export default function Dashboard() {
  // const { refreshTransactions } = useFinance();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ income: 0, spent: 0, balance: 0 });
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
   
    refundable: false, // ✅ This must exist
  refundStatus: "pending", 
    emotion: "neutral",
  });

  const token = localStorage.getItem("token");

  const fetchSummary = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses/summary", {
      headers: { Authorization: token },
    });
    setSummary(res.data);
  };

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses", {
      headers: { Authorization: token },
    });
    setExpenses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/expenses", form, {
      headers: { Authorization: token },
    });
  
    if (window.location.pathname === "/analysis") {
      window.location.reload();
    }
    setForm({ title: "", amount: "", type: "expense" });
    fetchExpenses();
    fetchSummary();
    localStorage.setItem("triggerAnalysisReload", Date.now());
    navigate('/analysis'); // Navigate to analysis page after adding transaction
    // refreshTransactions(); // Call the refresh function from useFinance
  };

 

  // useEffect(() => {
  //   fetchSummary();
  //   fetchExpenses();
  // }, []);
  useEffect(() => {
  const fetchData = async () => {
    try {
      const catRes = await axios.get("http://localhost:5000/api/analysis/categories", {
        headers: { Authorization: token },
      });
      setCategoryData(catRes.data);
    } catch (err) {
      console.error("Category analysis fetch error:", err);
    }

    try {
      const monRes = await axios.get("http://localhost:5000/api/analysis/monthly", {
        headers: { Authorization: token },
      });
      setMonthlyData(monRes.data);
    } catch (err) {
      console.error("Monthly analysis fetch error:", err);
    }

    try {
      const leakRes = await axios.get("http://localhost:5000/api/analysis/leaks", {
        headers: { Authorization: token },
      });
      setLeaks(leakRes.data.leaks);
      setLeakSum(leakRes.data.leakSum);
    } catch (err) {
      console.error("Leak detection fetch error:", err);
    }

    try {
      const res = await axios.get("http://localhost:5000/api/analysis/forecast", {
        headers: { Authorization: token },
      });
      setPrediction(res.data.forecast?.[0]?.pred || null);
    } catch (err) {
      console.error("Prediction fetch error:", err);
    }

    try {
      const emoRes = await axios.get("http://localhost:5000/api/analysis/emotion", {
        headers: { Authorization: token },
      });
      setEmotionData(emoRes.data);
    } catch (err) {
      console.error("Emotion analysis fetch error:", err);
    }

    try {
      const sumRes = await axios.get("http://localhost:5000/api/expenses/summary", {
        headers: { Authorization: token },
      });
      setSummary(sumRes.data);

      const expRes = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: token },
      });
      setExpenses(expRes.data.sort((a, b) => b.amount - a.amount));
    } catch (err) {
      console.error("Error fetching report data:", err);
    }
  };

  fetchData();

  const interval = setInterval(() => {
    const trigger = localStorage.getItem("triggerAnalysisReload");
    if (trigger) {
      fetchData(); // re-fetch analysis data
      localStorage.removeItem("triggerAnalysisReload"); // reset flag
    }
  }, 2000);

  return () => clearInterval(interval);
}, []);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiDollarSign className="mr-2 text-blue-600" />
          Finance Dashboard
        </h1>
        {/* <button 
          onClick={logout} 
          className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition-all"
        >
          <FiLogOut /> Logout
        </button> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{summary.income.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiTrendingUp className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-500 mt-1">₹{summary.spent.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiTrendingDown className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Balance</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">₹{summary.balance.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaPiggyBank className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiPlus className="text-blue-600" /> Add Transaction
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Groceries, Salary"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category || "general"}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="general">General</option>
                <option value="savings">Savings</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="refundable"
                checked={form.refundable}
                onChange={(e) => setForm({ ...form, refundable: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="refundable" className="ml-2 block text-sm text-gray-700">
                Refundable?
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, emotion: "happy" })}
                  className={`p-2 rounded-full ${form.emotion === "happy" ? "bg-green-100 text-green-600" : "bg-gray-100"}`}
                >
                  <FaSmile className="text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, emotion: "neutral" })}
                  className={`p-2 rounded-full ${form.emotion === "neutral" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100"}`}
                >
                  <FaMeh className="text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, emotion: "sad" })}
                  className={`p-2 rounded-full ${form.emotion === "sad" ? "bg-red-100 text-red-600" : "bg-gray-100"}`}
                >
                  <FaFrown className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Transaction
          </button>
        </form>
      </div>
    <ReceiptScanner
  onExtract={(data) =>
    setForm((prev) => ({
      ...prev,
      title: data.title,
      amount: data.amount,
    }))
  }
/>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiDollarSign className="text-blue-600" /> Recent Transactions
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {e.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-semibold ${e.type === "income" ? "text-green-600" : "text-red-500"}`}>
                      ₹{e.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      e.type === "income" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {e.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {e.category || "General"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
