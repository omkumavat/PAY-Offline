import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect,useState } from "react";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { useAuth } from "./context/AuthContext";
import { PublicRoute } from "./Route/PublicRoute";
import { ProtectedRoute } from "./Route/ProtectedRoute";
import { deleteAllTransactions, syncPendingTransactions } from "./db/indexedDB";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

function App() {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  // deleteAllTransactions();

  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const trySync = async () => {
      // if (!user?.id) return;
      if(!(JSON.parse(user).id)) return;

      try {
        console.log("Trying sync...");
        await syncPendingTransactions(JSON.parse(user).id);
        console.log("Sync complete");
        setSyncing(!syncing);
      } catch (error) {
        console.error("Sync error:", error);
      }
    };

    // Run once when component mounts
    trySync();

    // Run when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        trySync();
      }
    };

    // Run when window gains focus
    const handleFocus = () => {
      trySync();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };

  }, [user]);


  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Dashboard syncing={syncing} />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
