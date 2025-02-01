import { motion } from "framer-motion";
import { FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const lightAnimation = {
    animate: {
      x: [0, 30, -30, 0],
      y: [0, -20, 20, 0],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  };

  return (
    <motion.footer
      className="relative bg-[#101010] text-white py-10 px-6 sm:px-10 font-satoshi overflow-hidden border-t border-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl"
        {...lightAnimation}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl"
        {...lightAnimation}
      />

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-extrabold text-white">universoexplora</h3>
            <p className="mt-4 text-gray-300 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Descubre herramientas y asesoramiento personalizado para alcanzar
              el éxito en tu vida profesional y personal.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces</h4>
            <ul className="flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start text-sm text-gray-300 gap-3 md:gap-6">
              {["Nosotros", "Acompañamiento", "Contáctanos", "Equipo"].map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.replace(/\s+/g, "")}`}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
            <div className="flex justify-center md:justify-start space-x-6">
              {[
                { href: "https://github.com", icon: <FaGithub size={24} /> },
                { href: "https://facebook.com", icon: <FaFacebook size={24} /> },
                { href: "https://linkedin.com", icon: <FaLinkedin size={24} /> },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-cyan-500 transition"
                  variants={itemVariants}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="border-t border-gray-800 mt-10" variants={itemVariants}></motion.div>

        <motion.div
          className="text-center mt-6 text-sm text-gray-500"
          variants={itemVariants}
        >
          © 2024 universoexplora. Todos los derechos reservados.
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;