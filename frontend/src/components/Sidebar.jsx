
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiMenu, FiX, FiPieChart, FiTarget, FiBarChart2,
   FiActivity, FiRotateCcw, FiLogOut
} from "react-icons/fi";

const Sidebar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <FiPieChart /> },
    { to: "/goals", label: "Goal", icon: <FiTarget /> },
    { to: "/analysis", label: "Analysis", icon: <FiBarChart2 /> },
    { to: "/predict", label: "Forecast", icon: <FiActivity /> },
    { to: "/refunds", label: "Refunds", icon: <FiRotateCcw /> },
    

  ];

  return (
    <>
      {/* Hamburger Icon */}
      <div className="fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(true)} className="text-purple-700 hover:text-purple-900 text-3xl">
          <FiMenu />
        </button>
      </div>

      {/* Sidebar Drawer & Backdrop */}
      {isOpen && (
        <>
          {/* Changed overlay to show blurred background */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-64 bg-purple-700 text-white z-50 shadow-lg transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-purple-500">
              <h1 className="text-2xl font-bold">💸 BudgetTracker</h1>
              <button onClick={() => setIsOpen(false)} className="text-white text-xl">
                <FiX />
              </button>
            </div>

            <nav className="flex-grow p-4 space-y-3">
              {isAuthenticated ? (
                navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center p-2 rounded hover:bg-purple-600 ${
                      location.pathname === link.to ? "bg-purple-600" : ""
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block p-2 rounded hover:bg-purple-600">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block p-2 rounded hover:bg-purple-600">Register</Link>
                </>
              )}
            </nav>

            {isAuthenticated && (
              <div className="p-4 border-t border-purple-500">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left p-2 rounded hover:bg-red-500 transition"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;