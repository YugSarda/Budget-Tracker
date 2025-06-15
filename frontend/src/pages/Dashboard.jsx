import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Dexie from 'dexie';

const db = new Dexie("BudgetTracker");
db.version(1).stores({ expenses: "++_id,title,amount,category,date,upi,emotion" });

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: "", upi: "" });
  const [editId, setEditId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [burnRate, setBurnRate] = useState("");
  const [prediction, setPrediction] = useState("");
  const [budgetLimit, setBudgetLimit] = useState(localStorage.getItem("budgetLimit") || "");
  const [currency, setCurrency] = useState("INR");
  const [rates, setRates] = useState({ INR: 1, USD: 0.012, EUR: 0.011 });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("dark") === "1");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split(".")[1])).id;

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("dark", isDarkMode ? "1" : "0");
  }, [isDarkMode]);

  useEffect(() => { fetchExpenses(); initVoice(); }, []);

  useEffect(() => { calculateBurnRate(); }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`/api/expenses/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const arr = Array.isArray(res.data) ? res.data : [];
      setExpenses(arr);
      await db.expenses.bulkPut(arr);
      notifyBudget(arr);
    } catch {
      toast.warn("Offline mode: loading saved data");
      const arr = await db.expenses.toArray();
      setExpenses(arr);
    }
  };

  const notifyBudget = (arr) => {
    if (!budgetLimit) return;
    const total = arr.reduce((sum, e) => sum + Number(e.amount), 0);
    if (total > Number(budgetLimit)) {
      toast.error("⚠️ You exceeded your monthly budget!");
      new Notification("Budget Alert", { body: "You have exceeded your budget limit." });
    }
  };

  const initVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-IN'; rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = e => { parseVoice(e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
  };

  const startListening = () => {
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const parseVoice = (text) => {
    const updated = { ...form };
    const m = text.match(/(\d+)/); if (m) updated.amount = m[1];
    const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (dateMatch) {
      const [_, d, m2, y] = dateMatch;
      updated.date = `${y.length === 2 ? "20"+y : y}-${m2.padStart(2,'0')}-${d.padStart(2,'0')}`;
    }
    const cats = ["food","rent","shopping","travel","medical","movie","grocery"];
    for (const w of text.split(" ")) if (cats.includes(w)) updated.category = w;
    const t = text.replace(/rupees|amount|on|date|for|\d+|-[\d-]+/g,'').trim();
    updated.title = t || updated.title;
    setForm(updated);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    const url = editId ? `/api/expenses/${editId}` : `/api/expenses`;
    const method = editId ? "put" : "post";
    try {
      const res = await axios[method](url, { ...form, userId }, { headers: { Authorization: `Bearer ${token}` } });
      const arr = editId ? expenses.map(e => e._id === editId ? res.data : e) : [res.data, ...expenses];
      setExpenses(arr); toast.success(editId ? "Updated" : "Added");
      await db.expenses.bulkPut(arr); setForm({ title:"",amount:"",category:"",date:"",upi:"" }); setEditId(null);
      notifyBudget(arr);
    } catch { toast.error("Save failed"); }
  };

  const handleEdit = e => setForm({ title:e.title,amount:e.amount,category:e.category,date:e.date.split("T")[0],upi:e.upi||"" });
  const handleDelete = async id => {
    try {
      await axios.delete(`/api/expenses/${id}`, { headers:{ Authorization:`Bearer ${token}` }});
      const arr = expenses.filter(e=>e._id!==id);
      setExpenses(arr); toast.info("Deleted"); await db.expenses.bulkPut(arr); notifyBudget(arr);
    } catch { toast.error("Delete failed"); }
  };

  const calculateBurnRate = () => {
    const total = expenses.reduce((s,e)=>s+Number(e.amount),0);
    const days = Math.max(1,new Set(expenses.map(e=>new Date(e.date).toDateString())).size);
    setBurnRate(`₹${(total/days).toFixed(2)}/day`);
  };

  const convert = amt => (amt * (rates[currency]||1)).toFixed(2);

  const chartData = Object.entries(
    expenses.reduce((a,e)=>{
      const m = new Date(e.date).toLocaleDateString("en-IN",{month:"short"});
      a[m] = (a[m]||0)+Number(e.amount); return a;
    }, {})
  ).map(([name,amt])=>({name, amt}));

  const filtered = expenses.filter(e=>filterCategory?e.category===filterCategory:true)
                           .sort((a,b)=>sortKey==="amount"?b.amount-a.amount:new Date(b.date)-new Date(a.date));

  return (
    <div className={isDarkMode ? "dark bg-gray-800 text-gray-100" : ""}>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={()=>setIsDarkMode(!isDarkMode)} className="px-3 py-1 bg-indigo-600 rounded text-white">
            {isDarkMode?"Light Mode":"Dark Mode"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-4 rounded shadow mb-6 space-y-3">
          <div className="flex gap-2">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="flex-1 p-2 border rounded"/>
            <button type="button" onClick={startListening} className={`px-3 py-1 rounded ${isListening?"bg-red-500":"bg-purple-500"} text-white`}>
              🎤 {isListening?"Listening":"Voice"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" type="number" required className="p-2 border rounded"/>
            <input name="date" value={form.date} onChange={handleChange} type="date" required className="p-2 border rounded"/>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="p-2 border rounded"/>
            <input name="upi" value={form.upi} onChange={handleChange} placeholder="UPI ID" className="p-2 border rounded"/>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
              {editId?"Update":"Add"} Expense
            </button>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="p-2 border rounded">
              <option value="INR">INR</option><option value="USD">USD</option><option value="EUR">EUR</option>
            </select>
          </div>
        </form>

        <div className="flex gap-4 mb-4 flex-wrap">
          <select onChange={e=>setFilterCategory(e.target.value)} className="p-2 border rounded">
            <option value="">All Categories</option>
            {[...new Set(expenses.map(e=>e.category))].map(c=> <option key={c}>{c}</option>)}
          </select>
          <select onChange={e=>setSortKey(e.target.value)} className="p-2 border rounded">
            <option value="date">Sort by Date</option><option value="amount">Sort by Amount</option>
          </select>
          <button onClick={()=>{setFilterCategory("");setSortKey("date")}} className="p-2 border rounded">Clear Filters</button>
          <input type="number" placeholder="Set Budget Limit" value={budgetLimit} onChange={e=>{setBudgetLimit(e.target.value); localStorage.setItem("budgetLimit", e.target.value)}} className="p-2 border rounded"/>
        </div>

        <div className="mb-4"><strong>Burn Rate:</strong> {burnRate}</div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="name"/><YAxis/><Tooltip/>
            <Line type="monotone" dataKey="amt" stroke="#8884d8"/>
          </LineChart>
        </ResponsiveContainer>

        {filtered.length===0 ? (
          <p className="mt-4">No expenses found.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {filtered.map(e=>(
              <li key={e._id} className="bg-white dark:bg-gray-700 p-4 rounded shadow space-y-1">
                <p><strong>Title:</strong> {e.title}</p>
                <p><strong>Amount:</strong> {convert(e.amount)} {currency}</p>
                <p><strong>Date:</strong> {new Date(e.date).toLocaleDateString()}</p>
                <p><strong>Category:</strong> {e.category}</p>
                {e.upi && <p><strong>UPI:</strong> {e.upi}</p>}
                <p><strong>Emotion:</strong> {e.emotion}</p>
                <div className="flex gap-2 pt-2">
                  <button onClick={()=>handleEdit(e)} className="px-3 py-1 bg-green-500 text-white rounded">Edit</button>
                  <button onClick={()=>handleDelete(e._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
