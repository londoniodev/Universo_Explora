import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "../../assets/images/explora.png";

const HomeNavbar = () => {
  const [activeNav, setActiveNav] = useState("#Nosotros");
  const [menuOpen, setMenuOpen] = useState(false);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className="flex justify-between items-center px-4 py-2 fixed w-full bg-transparent top-0 left-0 rounded-b-3xl backdrop-blur-lg z-50"
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.8, ease: "easeOut" }}
      variants={navVariants}
    >
      {/* Logo */}
      <img src={Logo} alt="Logo" className="w-12 pointer-events-none z-50" />

      {/* Desktop Menu */}
      <motion.div
        className="hidden md:flex space-x-6 items-center"
        variants={navVariants}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { href: "#Nosotros", label: "Nosotros" },
          { href: "#Acompañamiento", label: "Acompañamiento" },
          { href: "#Equipo", label: "Equipo" },
          { href: "#Testimonios", label: "Testimonios" },
          { href: "#Contacto", label: "Contáctanos" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setActiveNav(item.href)}
            className={`text-sm font-medium ${
              activeNav === item.href ? "text-[#004e92]" : "text-white"
            } hover:text-gray-400 transition duration-300`}
          >
            {item.label}
          </a>
        ))}
        <div className="flex items-center space-x-4">
          <Link
            to="/api/auth/login"
            className="flex items-center text-white border border-gray-400 px-4 py-2 rounded-lg text-sm font-medium hover:text-gray-400 transition duration-300"
          >
            <FaLock className="mr-2" />
            Ingresar
          </Link>
          <Link
            to="/api/auth/signup"
            className="flex items-center bg-white text-black text-sm font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-gray-400 transition duration-300"
          >
            <FaUserPlus className="mr-2" />
            Registrarme
          </Link>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <div className="flex flex-col md:hidden items-center w-full">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center space-x-2">
            <Link
              to="/api/auth/login"
              className="flex items-center text-white border border-gray-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:text-gray-400 transition duration-300"
            >
              <FaLock className="mr-1" />
              Ingresar
            </Link>
            <Link
              to="/api/auth/signup"
              className="flex items-center bg-white text-black text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg hover:bg-gray-400 transition duration-300"
            >
              <FaUserPlus className="mr-1" />
              Registrarme
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className="text-white text-2xl ml-2"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {menuOpen && (
          <motion.div
            className="absolute top-14 left-0 w-full bg-[#181818] rounded-b-3xl shadow-lg"
            initial="hidden"
            animate="visible"
            variants={navVariants}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              {[
                { href: "#Nosotros", label: "Nosotros" },
                { href: "#Acompañamiento", label: "Acompañamiento" },
                { href: "#Equipo", label: "Equipo" },
                { href: "#Testimonios", label: "Testimonios" },
                { href: "#Contacto", label: "Contáctanos" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveNav(item.href);
                    setMenuOpen(false);
                  }}
                  className={`text-base font-medium ${
                    activeNav === item.href ? "text-[#004e92]" : "text-white"
                  } hover:text-gray-400 transition duration-300`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default HomeNavbar;