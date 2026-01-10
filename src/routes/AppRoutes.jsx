import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import Matches from "../pages/Matches";
import Quiz from "../pages/Quiz";
import Results from "../pages/Results";
import Leaderboard from "../pages/Leaderboard";
import HomePage from "../pages/HomePage";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminMatches from "../pages/admin/AdminMatches";
import AdminQuizManager from "../pages/admin/AdminQuizManager";
import AdminSetAnswers from "../pages/admin/AdminSetAnswers";
import AdminScoreQuiz from "../pages/admin/AdminScoreQuiz";
import AdminPublishResults from "../pages/admin/AdminPublishResults";
import QuizAnalytics from "../pages/admin/QuizAnalytics";
import AdminAnalyticsHome from "../pages/admin/AdminAnalyticsHome";

import { useUser } from "../context/UserContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminLeaderboard from "../pages/admin/AdminLeaderboard";

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

  return children;
}

/* =======================
   ROUTES
======================= */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= USER AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

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
        path="/admin/leaderboard/:quizId"
        element={
          <AdminProtectedRoute>
            <AdminLeaderboard />
          </AdminProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
