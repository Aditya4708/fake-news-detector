import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Detector from "./pages/Detector";
import History from "./pages/History";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "80vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#080808",
      }}>
        <div style={{
          width: "30px", height: "30px",
          border: "3px solid rgba(234,179,8,0.15)",
          borderTopColor: "#eab308",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function About() {
  return (
    <section style={{ minHeight: "calc(100vh - 64px)", background: "#080808", color: "#fafafa", padding: "6rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ color: "#eab308", letterSpacing: "2px", textTransform: "uppercase", fontSize: ".7rem", fontWeight: 700 }}>About TruthNet</p>
        <h1 style={{ maxWidth: "760px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.4rem, 7vw, 5.4rem)", lineHeight: .98, margin: "1rem 0 1.5rem" }}>Read the signal behind the story.</h1>
        <p style={{ maxWidth: "680px", color: "#a1a1aa", lineHeight: 1.75, fontSize: "1.05rem" }}>
          TruthNet combines sentiment, source credibility, fact patterns, and bias analysis into one transparent, confidence-aware verdict.
        </p>
      </div>
    </section>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout><Detector /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Layout><History /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}