import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdHome, MdStore, MdAssessment, MdShoppingCart, MdExitToApp, MdPerson } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/AuthStore.jsx";
import { useCart } from "../../context/CartContext.jsx";
import Avatar from "react-avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const { cart } = useCart();
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    toast.success("Has salido con éxito");
    localStorage.removeItem("hasSeenWelcomeNotification");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav className="fixed top-0 w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md text-white z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6 relative">
          <div className="flex items-center gap-4">
            <Avatar
              name={user?.name || "Usuario"}
              size="40"
              round={true}
              className="center"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold">
                {user?.name || "Usuario"} {user?.last_name || ""}
              </span>
              <span className="text-xs text-gray-400">{user?.role || "Sin rol"}</span>
            </div>
          </div>

          <ul className="hidden md:flex items-center space-x-4">
            <li>
              <Link
                to="/api/auth/dashboard"
                className="hover:text-blue-400 flex bg-gray-800 py-2 px-4 rounded-lg items-center gap-2 transition"
              >
                <MdHome className="text-xl" /> Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/api/auth/dashboard/buy-tests"
                className="hover:text-blue-400 bg-gray-800 py-2 px-4 rounded-lg flex items-center gap-2 transition"
              >
                <MdStore className="text-xl" /> Comprar Test
              </Link>
            </li>
            <li>
              <Link
                to="/api/auth/dashboard/my-results"
                className="hover:text-blue-400 bg-gray-800 py-2 px-4 rounded-lg flex items-center gap-2 transition"
              >
                <MdAssessment className="text-xl" /> Resultados
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Link to="/api/auth/dashboard/cart" className="hover:text-blue-400 flex items-center">
                <MdShoppingCart className="text-2xl" />
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>

            <div className="relative" ref={menuRef}>
              <button className="flex flex-col justify-center items-center gap-1 w-8 h-8" onClick={toggleMenu}>
                <span
                  className={`h-1 w-full bg-white rounded transition-transform duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`h-1 w-full bg-white rounded transition-opacity duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`h-1 w-full bg-white rounded transition-transform duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </button>

              <div
                className={`absolute right-0 mt-2 bg-gray-900 text-white rounded-lg shadow-lg py-2 w-48 transition-transform ${
                  isOpen ? "scale-100" : "scale-0"
                } origin-top-right`}
              >
                <Link
                  to="/api/auth/dashboard/my-account"
                  className="block px-4 py-2 hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <MdPerson className="text-xl" /> Mi Cuenta
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <MdExitToApp className="text-xl" /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden flex justify-center gap-4 bg-gradient-to-r from-gray-800 to-gray-700 py-3 px-6 rounded-lg shadow-lg backdrop-blur-xl">
        <Link to="/api/auth/dashboard" className="text-white hover:text-blue-400 flex flex-col items-center">
          <MdHome className="text-2xl" />
          <span className="text-xs mt-1">Inicio</span>
        </Link>
        <Link to="/api/auth/dashboard/buy-tests" className="text-white hover:text-blue-400 flex flex-col items-center">
          <MdStore className="text-2xl" />
          <span className="text-xs mt-1">Comprar</span>
        </Link>
        <Link to="/api/auth/dashboard/my-results" className="text-white hover:text-blue-400 flex flex-col items-center">
          <MdAssessment className="text-2xl" />
          <span className="text-xs mt-1">Resultados</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;