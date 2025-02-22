import { motion } from "framer-motion";
import { FaDiagnoses, FaRegClipboard, FaChartLine, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";

const AccompanimentSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div id="Acompañamiento" className="relative bg-[#101010] text-white py-20 font-satoshi">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-[20%] left-[15%] w-[250px] h-[250px] bg-blue-500/30 rounded-full blur-3xl animate-pulse"
        ></motion.div>
        <motion.div
          className="absolute top-[50%] right-[15%] w-[350px] h-[350px] bg-purple-500/30 rounded-full blur-3xl animate-pulse"
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
          <h2 className="text-[1.95rem] sm:text-5xl md:text-6xl font-extrabold p-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mx-auto">
            Programa de Orientación Vocacional
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
              title:"Diagnóstico y Contexto Vocacional",
              description: "Profundizamos en tu historia y te orientamos en la toma de decisiones difíciles.",
              icon: <FaDiagnoses className="h-10 w-10 text-white drop-shadow-lg" />,
            },
            {
              title: "pruebas vocacionales",
              description: "Conocemos tus habilidades, rasgos de personalidad, intereses y desempeño académico.",
              icon: <FaRegClipboard className="h-10 w-10 text-white drop-shadow-lg" />,
            },
            {
              title: "Exploración y Experiencias",
              description: "Investigas, conoces, escuchas y tienes contacto con profesionales de las áreas más a fines a tu perfil.",
              icon: <FaChartLine className="h-10 w-10 text-white drop-shadow-lg" />,
            },
            {
              title: "Resultados y Recomendaciones",
              description: "Con una matriz de decisiones y más de 6 criterios de elección eliges tu camino y te damos un plan de acción para comenzar.",
              icon: <FaAward className="h-10 w-10 text-white drop-shadow-lg" />,
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative p-6 sm:p-8 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 before:absolute before:w-24 before:h-24 before:bg-gradient-to-br from-blue-500/40 to-transparent before:rounded-full before:blur-xl before:opacity-50 before:transition-all before:hover:scale-125"></div>
              <div className="relative z-10 flex flex-col items-center text-center sm:text-left">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">{step.icon}</div>
                <h3 className="text-3xl font-bold text-white">{step.title}</h3>
                <p className="mt-4 text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <Link
            to={"/api/auth/login"}
            className="w-full sm:w-auto px-6 py-4 text-lg font-semibold text-white text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg hover:bg-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:outline-none">
            ¿Listo para elegir con seguridad? 🚀
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AccompanimentSection;