import { motion } from "framer-motion";
import { FaDiagnoses, FaRegClipboard, FaChartLine, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";

const AccompanimentSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const lightAnimation = {
    initial: { opacity: 0.3, scale: 1 },
    animate: {
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.2, 1],
    },
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div id="Acompañamiento" className="relative bg-[#101010] text-white py-20 font-satoshi">
      <div className="absolute inset-0 z-0">
        <motion.div
          {...lightAnimation}
          className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-gradient-to-br from-purple-800/50 to-transparent rounded-full blur-2xl"
        ></motion.div>
        <motion.div
          {...lightAnimation}
          className="absolute top-[50%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-blue-500/50 to-transparent rounded-full blur-3xl"
        ></motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-[1.95rem] sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mx-auto">
            Nuestro Acompañamiento
          </h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            En <span className="font-semibold text-white">Explora</span>, te guiamos paso a paso hacia la decisión correcta.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            {
              title: "Diagnóstico",
              description: "Identificamos tus talentos, intereses y valores.",
              gradient: "from-purple-600 to-indigo-400",
              icon: <FaDiagnoses className="h-8 w-8 text-white" />,
            },
            {
              title: "Planificación",
              description: "Te mostramos oportunidades alineadas con tu potencial.",
              gradient: "from-pink-600 to-red-400",
              icon: <FaRegClipboard className="h-8 w-8 text-white" />,
            },
            {
              title: "Seguimiento",
              description: "Te damos claridad para elegir con confianza.",
              gradient: "from-blue-600 to-teal-400",
              icon: <FaChartLine className="h-8 w-8 text-white" />,
            },
            {
              title: "Resultados",
              description: "Más que una carrera, creamos contigo un plan para un futuro exitoso y pleno.",
              gradient: "from-green-600 to-teal-500",
              icon: <FaAward className="h-8 w-8 text-white" />,
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative p-6 sm:p-8 rounded-lg bg-gradient-to-br ${step.gradient} shadow-xl`}
            >
              <div className="absolute inset-0 bg-black/10 rounded-lg backdrop-blur-md pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center text-center sm:text-left">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-4 text-gray-200">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <Link
            to={"/api/auth/login"}
            className="w-full sm:w-auto px-6 py-4 text-lg font-semibold text-white text-center bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-lg hover:from-blue-500 hover:to-indigo-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            ¿Listo para elegir con seguridad? 🚀
          </Link>
        </div>
      </motion.div>
    </div>
  );
};  
export default AccompanimentSection;