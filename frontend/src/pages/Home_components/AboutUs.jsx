import { motion } from "framer-motion";

const AboutUs = () => {
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
    <div id="Nosotros" className="relative bg-[#101010] text-white py-20 font-satoshi">
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

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Sobre Nosotros
          </h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            En <span className="font-semibold text-white">Explora</span>, empoderamos a las personas para lograr su máximo
            potencial mediante tecnología avanzada, estrategias personalizadas y acompañamiento continuo.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="relative flex flex-col gap-12 mb-16"
        >
          {[
            {
              title: "Nuestra Misión",
              description:
                "Acompañar y orientar a los jóvenes de todo Latinoamérica en su transición de la escuela a la universidad, desde la confusión hacia la certeza de un futuro profesional feliz y exitoso.",
              gradient: "from-purple-600 to-indigo-400",
            },
            {
              title: "Nuestros Valores",
              description: (
                <>
                  ✅ <strong>Claridad:</strong> Simplificamos el proceso de decisión para que tomes la mejor elección. <br />
                  ✅ <strong>Innovación:</strong> Nos adaptamos a las nuevas tendencias y profesiones del futuro. <br />
                  ✅ <strong>Empatía:</strong> Te guiamos sin juicios ni presiones. <br />
                  ✅ <strong>Responsabilidad:</strong> Fomentamos decisiones informadas. <br />
                  ✅ <strong>Transformación:</strong> Te ayudamos a dar el primer paso hacia un futuro exitoso.
                </>
              ),
              gradient: "from-pink-600 to-red-400",
            },
            {
              title: "Nuestra Visión",
              description:
                "Ser la empresa líder en orientación vocacional y profesional en habla hispana, preparando a las nuevas generaciones para elegir con confianza y diseñar un futuro alineado con sus talentos y las tendencias globales.",
              gradient: "from-blue-600 to-teal-400",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative p-8 rounded-lg bg-gradient-to-br ${item.gradient} text-center shadow-xl backdrop-blur-lg`}
            >
              <h3 className="text-3xl font-bold text-white">{item.title}</h3>
              <p className="mt-4 text-gray-200 text-lg text-left leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              title: "Asesoramiento Personalizado",
              description: "Estrategias diseñadas para tus objetivos únicos.",
            },
            {
              title: "Herramientas Innovadoras",
              description: "Tecnología de punta para datos precisos y relevantes.",
            },
            {
              title: "Resultados Medibles",
              description: "Métricas claras para monitorear tu progreso.",
            },
            {
              title: "Acompañamiento Continuo",
              description: "Apoyo en cada paso hacia tu éxito.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative group p-6 rounded-lg bg-black/10 backdrop-blur-md border border-gray-700 shadow-lg hover:shadow-xl transition-transform duration-300 overflow-hidden"
              style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            >
              <div
                className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/60 to-transparent rounded-full blur-lg opacity-50"
                style={{
                  transform: "translate(-20%, -20%)",
                }}
              ></div>
              <h3 className="relative text-2xl font-bold text-white z-10">{item.title}</h3>
              <p className="relative mt-3 text-gray-200 text-sm leading-relaxed z-10">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;