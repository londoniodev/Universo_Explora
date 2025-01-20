  import { useEffect } from "react";
  import { Routes, Route, Navigate, useLocation } from "react-router-dom";
  import PropTypes from "prop-types";
  import toast, { Toaster } from "react-hot-toast";
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
  import SixteenPfTestResults from "./assets/components/SixteenPfResults.jsx";
  import ShortContextualizationAnswer from "./assets/components/ContextualizationShort.jsx";
  import PsychologistDashboard from "./pages/PsychologistDashboard.jsx";
  import ThankYouPage from "./pages/ThankYouPage.jsx";
  import LoadingSpinner from "./pages/LoadingSpinner.jsx";
  import { CartProvider } from "./context/CartContext.jsx";
  import { useAuthStore } from "./store/AuthStore.jsx";

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
    const location = useLocation();
    if (isCheckingAuth) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/api/auth/login" replace />;
    if (user && !user.isVerified) return <Navigate to="/verify-code" replace />;
    if (user?.role === "psychologist" && location.pathname === "/api/auth/dashboard/my-account") return children;
    if (user?.role === "psychologist" && !["/api/auth/psychologist-dashboard", "/api/auth/dashboard/my-account"].includes(location.pathname)) return <Navigate to="/api/auth/psychologist-dashboard" replace />;
    return children;
  };

  ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

  const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();
    if (isAuthenticated && user?.isVerified) {
      if (user.role === "psychologist" && location.pathname === "/api/auth/dashboard") return <Navigate to="/api/auth/psychologist-dashboard" replace />;
      if (user.role === "user") return <Navigate to="/api/auth/dashboard" replace />;
    }
    return children;
  };

  RedirectAuthenticatedUser.propTypes = { children: PropTypes.node.isRequired };

  const App = () => {
    const { isCheckingAuth, checkAuth, fetchCart, getAutoevaluationAnswers, saveAutoevaluationAnswers, getContextualizationAnswers, saveContextualizationAnswers, completeTest } = useAuthStore();

    useEffect(() => {
      checkAuth().then(() => fetchCart()).catch((err) => console.warn("Error al verificar autenticación:", err.message));
    }, [ checkAuth, fetchCart ]);

    useEffect(() => {
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      if (tokenExpiration) {
        const warningTime = new Date(tokenExpiration).getTime() - 5 * 60 * 1000;
        if (Date.now() >= warningTime) toast.warning("Por tu seguridad, tu sesión está a punto de expirar.");
      }
    }, []);

    if (isCheckingAuth) return <LoadingSpinner />;

    const routes = [
      { path: "/", element: <Home /> },
      { path: "/api/auth/login", element: <RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser> },
      { path: "/api/auth/signup", element: <RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser> },
      { path: "/verify-code", element: <VerifyEmail /> },
      { path: "/api/auth/forgot-password", element: <RedirectAuthenticatedUser><ForgotPassword /></RedirectAuthenticatedUser> },
      { path: "/recovery-password/:token", element: <RedirectAuthenticatedUser><RecoveryPassword /></RedirectAuthenticatedUser> },
      { path: "/api/auth/dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: "/api/auth/dashboard/my-account", element: <ProtectedRoute><MyAccount /></ProtectedRoute> },
      { path: "/api/auth/dashboard/buy-tests", element: <ProtectedRoute><BuyTests /></ProtectedRoute> },
      { path: "/api/auth/dashboard/package/:packageId", element: <ProtectedRoute><FirstPackage /></ProtectedRoute> },
      { path: "/api/auth/dashboard/package/:packageId/autoevaluation", element: <ProtectedRoute><AutoevaluationTest loadAnswers={getAutoevaluationAnswers} saveAnswers={saveAutoevaluationAnswers} saveAutoevaluationAnswers={saveAutoevaluationAnswers} completeTest={completeTest} /></ProtectedRoute> },
      { path: "/api/auth/dashboard/package/:packageId/contextualization", element: <ProtectedRoute><ContextualizationTest loadAnswers={getContextualizationAnswers} saveAnswers={saveContextualizationAnswers} completeTest={completeTest} /></ProtectedRoute> },
      { path: "/api/auth/dashboard/package/:packageId/sixteenpf-test", element: <ProtectedRoute><SixteenPfTest /></ProtectedRoute> },
      { path: "/api/auth/dashboard/my-results", element: <ProtectedRoute><SixteenPfTestResults /></ProtectedRoute> },
      { path: "/api/auth/dashboard/cart", element: <ProtectedRoute><CartPage /></ProtectedRoute> },
      { path: "/api/auth/dashboard/payment/thank-you", element: <ProtectedRoute><ThankYouPage /></ProtectedRoute> },
      { path: "/api/auth/dashboard/package/:packageId/short-contextualization", element: <ProtectedRoute><ShortContextualizationAnswer /></ProtectedRoute> },
      { path: "/api/auth/psychologist-dashboard", element: <ProtectedRoute><PsychologistDashboard /></ProtectedRoute> },
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