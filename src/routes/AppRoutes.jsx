import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useUser } from "../context/UserContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminLayout from "../components/AdminLayout";

// Lazy-loaded page components
const Login = React.lazy(() => import("../pages/Login"));

const Matches = React.lazy(() => import("../pages/Matches"));
const Quiz = React.lazy(() => import("../pages/Quiz"));
const Results = React.lazy(() => import("../pages/Results"));
const Leaderboard = React.lazy(() => import("../pages/Leaderboard"));
const HomePage = React.lazy(() => import("../pages/HomePage"));

const AdminLogin = React.lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const AdminMatches = React.lazy(() => import("../pages/admin/AdminMatches"));
const AdminQuizManager = React.lazy(() => import("../pages/admin/AdminQuizManager"));
const AdminSetAnswers = React.lazy(() => import("../pages/admin/AdminSetAnswers"));
const AdminScoreQuiz = React.lazy(() => import("../pages/admin/AdminScoreQuiz"));
const AdminPublishResults = React.lazy(() => import("../pages/admin/AdminPublishResults"));
const QuizAnalytics = React.lazy(() => import("../pages/admin/QuizAnalytics"));
const AdminAnalyticsHome = React.lazy(() => import("../pages/admin/AdminAnalyticsHome"));
const AdminLeaderboard = React.lazy(() => import("../pages/admin/AdminLeaderboard"));
const AdminWinnerOverride = React.lazy(() => import("../pages/admin/AdminWinnerOverride"));
const AdminUsers = React.lazy(() => import("../pages/admin/AdminUsers"));
const AdminScorePublishHub = React.lazy(() => import("../pages/admin/AdminScorePublishHub"));
const AdminQuizHub = React.lazy(() => import("../pages/admin/AdminQuizHub"));
const AdminSetWinner = React.lazy(() => import("../pages/admin/AdminSetWinner"));

/* =======================
   USER PROTECTED ROUTE
======================= */
function ProtectedRoute({ children }) {
  const { user, initializing } = useUser();

  if (initializing) {
    return <div style={{ padding: 20 }}>Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =======================
   ADMIN PROTECTED ROUTE
======================= */
function AdminProtectedRoute({ children }) {
  const { isAdminAuthed, initializing } = useAdminAuth();

  if (initializing) {
    return <div style={{ padding: 20 }}>Loading admin session...</div>;
  }

  if (!isAdminAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

/* =======================
   ROUTES
======================= */
export default function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Lexend, system-ui, sans-serif", background: "#d5dbd7" }}>Loading...</div>}>
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ================= USER AUTH ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= USER APP ================= */}
      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:matchId"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:quizId"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard/:quizId"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      <Route path="/home" element={<HomePage />} />

      {/* ================= ADMIN AUTH ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= ADMIN APP ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/matches"
        element={
          <AdminProtectedRoute>
            <AdminMatches />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/quizzes/:matchId"
        element={
          <AdminProtectedRoute>
            <AdminQuizManager />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/matches/:matchId/answers"
        element={
          <AdminProtectedRoute>
            <AdminSetAnswers />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/matches/:matchId/score"
        element={
          <AdminProtectedRoute>
            <AdminScoreQuiz />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/matches/:matchId/publish"
        element={
          <AdminProtectedRoute>
            <AdminPublishResults />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <AdminProtectedRoute>
            <AdminAnalyticsHome />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics/quizzes/:quizId"
        element={
          <AdminProtectedRoute>
            <QuizAnalytics />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/matches/:matchId/leaderboard"
        element={
          <AdminProtectedRoute>
            <AdminLeaderboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/matches/:matchId/override"
        element={
          <AdminProtectedRoute>
            <AdminWinnerOverride />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/score-publish"
        element={
          <AdminProtectedRoute>
            <AdminScorePublishHub />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/quiz-hub"
        element={
          <AdminProtectedRoute>
            <AdminQuizHub />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/matches/:matchId/set-winner"
        element={
          <AdminProtectedRoute>
            <AdminSetWinner />
          </AdminProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>
  );
}
