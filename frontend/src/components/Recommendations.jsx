// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Recommendations() {
//   const [tips, setTips] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchTips = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/recommendations", {
//           headers: { Authorization: token },
//         });
//         setTips(res.data.recommendations);
//       } catch (err) {
//         console.error("Failed to fetch recommendations", err);
//       }
//     };

//     fetchTips();
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-bold mb-4">🎯 Personalized Recommendations</h2>
//         {tips.length === 0 ? (
//           <p className="text-gray-500">No recommendations at the moment.</p>
//         ) : (
//           <ul className="space-y-3">
//             {tips.map((tip, idx) => (
//               <li key={idx} className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded">
//                 {tip}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
