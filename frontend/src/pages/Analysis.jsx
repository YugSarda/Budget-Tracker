import { useEffect, useState } from "react";
import Recommendations from "../components/Recommendations";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#4B0082",
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    marginBottom: 8,
    color: "#2F4F4F",
  },
  text: {
    marginBottom: 4,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "33.33%",
  },
  lastCell: {
    borderRightWidth: 0,
  },
});

const MonthlyPDF = ({ summary, expenses }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>💸 Monthly Finance Report</Text>
      <View style={styles.section}>
        <Text style={styles.heading}>🔍 Summary</Text>
        <Text style={styles.text}>Total Income: {summary.income}</Text>
        <Text style={styles.text}>Total Expenses: {summary.spent}</Text>
        <Text style={styles.text}>Balance: {summary.balance}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>📊 Top 5 Expenses</Text>
        <View style={styles.table}>
          <View style={[styles.row, { backgroundColor: "#eee" }]}>
            <Text style={styles.cell}>Title</Text>
            <Text style={styles.cell}>Amount (₹)</Text>
            <Text style={[styles.cell, styles.lastCell]}>Category</Text>
          </View>
          {expenses.slice(0, 5).map((e, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={styles.cell}>{e.title}</Text>
              <Text style={styles.cell}>{e.amount}</Text>
              <Text style={[styles.cell, styles.lastCell]}>{e.category}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>💡 Recommendations</Text>
        <Text style={styles.text}>• Try limiting discretionary spending to under 20% of income.</Text>
        <Text style={styles.text}>• Consider setting monthly goals for savings.</Text>
        <Text style={styles.text}>• Track refundable expenses to reclaim money back.</Text>
      </View>
    </Page>
  </Document>
);

export default function Analysis() {
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  
  const [summary, setSummary] = useState({ income: 0, spent: 0, balance: 0 });
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");

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
  const weekres = await axios.get("http://localhost:5000/api/analysis/weekly", {
    headers: { Authorization: token },
  });
  setWeeklyData(weekres.data);
} catch (err) {
  console.error("Weekly analysis fetch error:", err);
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
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Expense Analysis</h2>
        {expenses.length > 0 && (
          <PDFDownloadLink
            document={<MonthlyPDF summary={summary} expenses={expenses} />}
            fileName="Monthly_Report.pdf"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow"
          >
            {({ loading }) => (loading ? "Preparing PDF..." : "Download Report")}
          </PDFDownloadLink>
        )}
      </div>

      {/* Charts Start */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="amount"
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
  <h3 className="text-lg font-semibold mb-4">Weekly Expense Trend</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={weeklyData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
</div>

      </div>

      {/* {prediction && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🧠 Predicted Expense for Next Month:</h3>
          <p className="text-3xl font-bold text-blue-600">₹{prediction.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Based on your past spending trend</p>
        </div>
      )} */}

       <Recommendations />   
      </div>
    
  );
}
