// import { BrowserRouter } from "react-router-dom";
// import Navbar from "./components/Navbar";

// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <BrowserRouter>
//         <Navbar />
//         <main className="flex-grow">
//           <AppRoutes />
//         </main>
//         {/* <ToastContainer position="top-right" autoClose={3000} /> */}
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
// import { BrowserRouter } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import AppRoutes from "./routes/AppRoutes";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function App() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <BrowserRouter>
//         <Navbar />
//         <main className="flex-grow">
//           <AppRoutes />
//         </main>
//         <ToastContainer position="top-right" autoClose={3000} />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
// src/App.jsx
// App.jsx
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
        <Sidebar />
        <main className="relative z-10 p-6">
          <AppRoutes />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;
