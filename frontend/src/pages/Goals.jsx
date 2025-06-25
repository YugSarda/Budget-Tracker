// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Goals() {
//   const [form, setForm] = useState({
//     title: "",
//     targetAmount: "",
//     deadline: "",
//     goalType: "savings",
//     category: "savings",
//   });
//   const [goals, setGoals] = useState([]);
//   const token = localStorage.getItem("token");

//   const fetchGoals = async () => {
//     const res = await axios.get("http://localhost:5000/api/goals", {
//       headers: { Authorization: token },
//     });
//     setGoals(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:5000/api/goals", form, {
//       headers: { Authorization: token },
//     });
//     setForm({
//       title: "",
//       targetAmount: "",
//       deadline: "",
//       goalType: "savings",
//       category: "savings",
//     });
//     fetchGoals();
//   };

//   useEffect(() => {
//     fetchGoals();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h2 className="text-2xl font-bold mb-4">Set Financial Goals</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
//         <input
//           type="text"
//           placeholder="Goal Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           className="w-full border rounded p-2"
//           required
//         />
//         <input
//           type="number"
//           placeholder="Target Amount"
//           value={form.targetAmount}
//           onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
//           className="w-full border rounded p-2"
//           required
//         />
//         <input
//           type="date"
//           value={form.deadline}
//           onChange={(e) => setForm({ ...form, deadline: e.target.value })}
//           className="w-full border rounded p-2"
//           required
//         />
//         <select
//           value={form.goalType}
//           onChange={(e) => setForm({ ...form, goalType: e.target.value })}
//           className="w-full border rounded p-2"
//         >
//           <option value="savings">Savings Goal</option>
//           <option value="spending">Expense Limit</option>
//         </select>
//         <select
//           value={form.category}
//           onChange={(e) => setForm({ ...form, category: e.target.value })}
//           className="w-full border rounded p-2"
//         >
//           <option value="savings">Savings</option>
//           <option value="food">Food</option>
//           <option value="travel">Travel</option>
//           <option value="general">General</option>
//         </select>
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Goal</button>
//       </form>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {goals.map((goal) => {
//   const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(2);
//   const exceeded = goal.currentAmount > goal.targetAmount;
//   const nearing = !exceeded && percentage >= 80;

//   return (
//     <div key={goal._id} className="bg-white p-4 rounded shadow border my-4">
//       <h3 className="text-xl font-semibold">{goal.title}</h3>
//       <p>🎯 Target: ₹{goal.targetAmount}</p>
//       <p>📅 Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
//       <p>📊 Progress: ₹{goal.currentAmount} ({percentage}%)</p>

//       {/* Progress Bar */}
//       <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//         <div
//           className={`h-2 rounded-full transition-all duration-500 ${
//             exceeded ? "bg-red-500" : nearing ? "bg-yellow-500" : "bg-green-500"
//           }`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>

//       {/* Alerts */}
//       {exceeded && <p className="text-red-600 mt-2 font-semibold">⚠️ Limit exceeded!</p>}
//       {nearing && !exceeded && (
//         <p className="text-yellow-600 mt-2 font-semibold">⚠️ Approaching limit</p>
//       )}
//     </div>
//   );
// })}

//         </div>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBullseye, FaPiggyBank, FaUtensils, FaPlane, FaWallet } from "react-icons/fa";
import { FiTarget, FiCalendar, FiDollarSign, FiAlertTriangle } from "react-icons/fi";

export default function Goals() {
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    goalType: "savings",
    category: "savings",
  });
  const [goals, setGoals] = useState([]);
  const token = localStorage.getItem("token");

  // Keep all your existing logic functions exactly the same
  const fetchGoals = async () => {
    const res = await axios.get("http://localhost:5000/api/goals", {
      headers: { Authorization: token },
    });
    setGoals(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/goals", form, {
      headers: { Authorization: token },
    });
    setForm({
      title: "",
      targetAmount: "",
      deadline: "",
      goalType: "savings",
      category: "savings",
    });
    fetchGoals();
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Icon mapping for categories
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'savings': return <FaPiggyBank className="text-blue-500" />;
      case 'food': return <FaUtensils className="text-green-500" />;
      case 'travel': return <FaPlane className="text-purple-500" />;
      default: return <FaWallet className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <FaBullseye className="text-3xl text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Financial Goals</h1>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goal Creation Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiTarget className="mr-2 text-indigo-500" />
            Set New Goal
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
              <input
                type="text"
                placeholder="e.g. Vacation Fund"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
              <input
                type="number"
                placeholder="50000"
                value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
              <select
                value={form.goalType}
                onChange={(e) => setForm({ ...form, goalType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="savings">Savings Goal</option>
                <option value="spending">Expense Limit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="savings">Savings</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="general">General</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Goal
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiTarget className="mr-2 text-indigo-500" />
            Your Goals
          </h2>

          {goals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No goals set yet. Create your first goal!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(2);
                const exceeded = goal.currentAmount > goal.targetAmount;
                const nearing = !exceeded && percentage >= 80;
                const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={goal._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-50 mr-3">
                          {getCategoryIcon(goal.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{goal.category}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.goalType === 'savings' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {goal.goalType === 'savings' ? 'Savings' : 'Spending Limit'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600">
                          <FiDollarSign className="mr-1" />
                          <span>Progress: ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <span className="font-medium">{percentage}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            exceeded ? "bg-red-500" : nearing ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                        <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
                      </div>

                      {/* Alerts */}
                      {exceeded && (
                        <div className="flex items-center text-red-600 text-sm font-medium p-2 bg-red-50 rounded-lg">
                          <FiAlertTriangle className="mr-2" />
                          Limit exceeded by ₹{(goal.currentAmount - goal.targetAmount).toLocaleString()}
                        </div>
                      )}
                      {nearing && !exceeded && (
                        <div className="flex items-center text-yellow-600 text-sm font-medium p-2 bg-yellow-50 rounded-lg">
                          <FiAlertTriangle className="mr-2" />
                          Approaching limit ({(100 - percentage).toFixed(2)}% remaining)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}