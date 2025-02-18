import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage.jsx";
import Signup from "./pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ForgotPassword from "./pages/ForgotPasswordPage.jsx";
import RecoveryPassword from "./pages/RecoveryPasswordPage.jsx";
import VerifyEmail from "./pages/VerifyEmailPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import BuyTests from "./pages/BuyTests.jsx";
import FirstPackage from "./pages/FirstPackage.jsx";
import AutoevaluationTest from "./assets/components/AutoevaluationTest.jsx";
import ContextualizationTest from "./assets/components/ContextualizationTest.jsx";
import SixteenPfTest from "./assets/components/SixteenPfTest.jsx";
import CartPage from "./pages/CartPage.jsx";
import GraphicResults from "./assets/components/GraphicResults.jsx";
import ShortContextualizationAnswer from "./assets/components/ContextualizationShort.jsx";
import RegisterPsychologist from "./pages/Psychologist_components/RegisterPsychologist.jsx"; // 🔥 Importamos la nueva página
import PsychologistDashboard from "./pages/PsychologistDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ThankYouPage from "./pages/ThankYouPage.jsx";
import LoadingSpinner from "./pages/LoadingSpinner.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { useAuthStore } from "./store/AuthStore.jsx";

const socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true, transports: ["websocket"],});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) return <LoadingSpinner />;
  if (!isAuthenticated || !user) return <Navigate to="/api/auth/login" replace />;
  if (!user.isVerified) return <Navigate to="/verify-code" replace />;

  const roleRoutes = {
    admin: ["/api/auth/admin-dashboard"],
    psychologist: ["/api/auth/psychologist-dashboard", "/api/auth/dashboard/my-account"],
  };

  if (user.role in roleRoutes && !roleRoutes[user.role].includes(location.pathname)) {
    return <Navigate to={roleRoutes[user.role][0]} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated && user?.isVerified) {
    if (user.role === "admin") return <Navigate to="/api/auth/admin-dashboard" replace />;
    if (user.role === "psychologist" && location.pathname !== "/api/auth/psychologist-dashboard") {
      return <Navigate to="/api/auth/psychologist-dashboard" replace />;
    }
    if (user.role === "user") return <Navigate to="/api/auth/dashboard" replace />;
  }

  return children;
};

RedirectAuthenticatedUser.propTypes = { children: PropTypes.node.isRequired };

const App = () => {
  const { 
    isCheckingAuth, 
    checkAuth, 
    fetchCart, 
    getAutoevaluationAnswers, 
    saveAutoevaluationAnswers, 
    getContextualizationAnswers, 
    saveContextualizationAnswers, 
    completeTest,
    user
  } = useAuthStore();

  useEffect(() => {
    checkAuth()
      .then(fetchCart)
      .catch((err) => console.warn("Error al verificar autenticación:", err.message));
  }, []);

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    if (tokenExpiration) {
      const expirationTime = new Date(tokenExpiration).getTime();
      if (Date.now() >= expirationTime - 5 * 60 * 1000) {
        toast.warning("Por tu seguridad, tu sesión está a punto de expirar.");
      }
    }
  }, []);

  useEffect(() => {
    if (user?.role === "psychologist" && user?._id) {
      socket.emit("join-psychologist-room", user._id);
    }
  }, [user]);
  

  useEffect(() => {
    if (user?.role === "psychologist") {
      socket.on("new-request", () => {
        toast.success("Tienes una nueva solicitud de paciente.");
      });

      socket.on("assigned-user", ({ psychologistId }) => {
        if (psychologistId === user._id) {
          toast.success("Se te ha asignado un nuevo paciente.");
        }
      });
    }

    return () => {
      socket.off("new-request");
      socket.off("assigned-user");
    };
  }, [user]);

  if (isCheckingAuth) return <LoadingSpinner />;

  const routes = [
    { path: "/", element: <Home /> },
    { path: "/api/auth/login", element: <RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser> },
    { path: "/api/auth/signup", element: <RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser> },
    { path: "/api/auth/register-psychologist", element: <RedirectAuthenticatedUser><RegisterPsychologist /></RedirectAuthenticatedUser> }, // ✅ Nueva ruta
    { path: "/verify-code", element: <VerifyEmail /> },
    { path: "/api/auth/forgot-password", element: <RedirectAuthenticatedUser><ForgotPassword /></RedirectAuthenticatedUser> },
    { path: "/recovery-password/:token", element: <RedirectAuthenticatedUser><RecoveryPassword /></RedirectAuthenticatedUser> },
    { path: "/api/auth/dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
    { path: "/api/auth/dashboard/my-account", element: <ProtectedRoute><MyAccount /></ProtectedRoute> },
    { path: "/api/auth/dashboard/buy-tests", element: <ProtectedRoute><BuyTests /></ProtectedRoute> },
    { path: "/api/auth/dashboard/package/:packageId", element: <ProtectedRoute><FirstPackage /></ProtectedRoute> },
    { path: "/api/auth/dashboard/package/:packageId/autoevaluation", element: <ProtectedRoute><AutoevaluationTest loadAnswers={getAutoevaluationAnswers} saveAnswers={saveAutoevaluationAnswers} completeTest={completeTest} /></ProtectedRoute> },
    { path: "/api/auth/dashboard/package/:packageId/contextualization", element: <ProtectedRoute><ContextualizationTest loadAnswers={getContextualizationAnswers} saveAnswers={saveContextualizationAnswers} completeTest={completeTest} /></ProtectedRoute> },
    { path: "/api/auth/dashboard/package/:packageId/sixteenpf-test", element: <ProtectedRoute><SixteenPfTest /></ProtectedRoute> },
    { path: "/api/auth/dashboard/my-results", element: <ProtectedRoute><GraphicResults /></ProtectedRoute> },
    { path: "/api/auth/dashboard/cart", element: <ProtectedRoute><CartPage /></ProtectedRoute> },
    { path: "/api/auth/dashboard/payment/thank-you", element: <ProtectedRoute><ThankYouPage /></ProtectedRoute> },
    { path: "/api/auth/dashboard/package/:packageId/short-contextualization", element: <ProtectedRoute><ShortContextualizationAnswer /></ProtectedRoute> },
    { path: "/api/auth/psychologist-dashboard", element: <ProtectedRoute><PsychologistDashboard /></ProtectedRoute> },
    { path: "/api/auth/admin-dashboard", element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
    { path: "*", element: <NotFoundPage /> }
  ];

  return (
    <CartProvider>
      <Routes>{routes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}</Routes>
      <Toaster />
    </CartProvider>
  );
};

export default App;