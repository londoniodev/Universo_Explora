import { motion } from "framer-motion";
import { FaDiagnoses, FaRegClipboard, FaChartLine, FaAward } from "react-icons/fa";

const AccompanimentSection = () => {
  // Variantes para animaciones
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
    initial: { x: 0, y: 0 },
    animate: {
      x: [0, 30, -30, 20, -20, 0],
      y: [0, -20, 20, -30, 30, 0],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
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
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Nuestro Acompañamiento
          </h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            En <span className="font-semibold text-white">Explora</span>, creemos en un acompañamiento integral, donde cada etapa está diseñada para maximizar tu potencial.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {[
            {
              title: "Diagnóstico",
              description: "Evaluamos tus necesidades y trazamos un camino claro.",
              gradient: "from-purple-600 to-indigo-400",
              icon: <FaDiagnoses className="h-8 w-8 text-white" />,
            },
            {
              title: "Planificación",
              description: "Diseñamos estrategias personalizadas para alcanzar tus objetivos.",
              gradient: "from-pink-600 to-red-400",
              icon: <FaRegClipboard className="h-8 w-8 text-white" />,
            },
            {
              title: "Seguimiento",
              description: "Revisamos tus progresos para ajustar el plan en tiempo real.",
              gradient: "from-blue-600 to-teal-400",
              icon: <FaChartLine className="h-8 w-8 text-white" />,
            },
            {
              title: "Resultados",
              description: "Logra el éxito con métricas claras y resultados tangibles.",
              gradient: "from-green-600 to-teal-500",
              icon: <FaAward className="h-8 w-8 text-white" />,
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative p-8 rounded-lg bg-gradient-to-br ${step.gradient} shadow-xl`}
            >
              <div className="absolute inset-0 bg-black/10 rounded-lg backdrop-blur-md pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-4 text-gray-200">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccompanimentSection;