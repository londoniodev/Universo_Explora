import { motion } from "framer-motion";

const AboutUs = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
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
          className="absolute top-[20%] left-[15%] w-[250px] h-[250px] z-10 bg-gradient-to-br from-blue-700 to-transparent rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          {...lightAnimation}
          className="absolute top-[50%] right-[15%] w-[350px] h-[350px] z-10 bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f8f8f8] to-[#d4d4d4]">
            Nuestro Propósito 
          </h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            En <span className="font-semibold text-white">Explora</span>, empoderamos a las personas para lograr su máximo potencial mediante tecnología avanzada, estrategias personalizadas y acompañamiento continuo.
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
              description: "Acompañar y orientar a los jóvenes de todo Latinoamérica en su transición de la escuela a la universidad, desde la confusión hacia la certeza de un futuro profesional feliz y exitoso.",
            },
            {
              title: "Nuestros Valores",
              description: (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Claridad", text: "Simplificamos el proceso de decisión para que tomes la mejor elección." },
                    { title: "Innovación", text: "Nos adaptamos a las nuevas tendencias y profesiones del futuro." },
                    { title: "Empatía", text: "Te guiamos sin juicios ni presiones." },
                    { title: "Responsabilidad", text: "Fomentamos decisiones informadas." },
                    { title: "Transformación", text: "Te ayudamos a dar el primer paso hacia un futuro exitoso." },
                    { title: "Compromiso", text: "Acompañamos tu crecimiento con dedicación y constancia." },
                  ].map((value, index) => (
                    <motion.div 
                      key={index} 
                      variants={cardVariants} 
                      className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg"
                    >
                      <h4 className="text-xl font-semibold text-white">{value.title}</h4>
                      <p className="mt-2 text-gray-300 text-sm">{value.text}</p>
                    </motion.div>
                  ))}
                </div>
              ),
            },
            {
              title: "Nuestra Visión",
              description: "Ser la empresa líder en orientación vocacional y profesional en habla hispana, preparando a las nuevas generaciones para elegir con confianza y diseñar un futuro alineado con sus talentos y las tendencias globales.",
            },
          ].map((item, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants} 
              className="relative p-8 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg 
                        overflow-hidden text-center"
            >
              <h3 className="text-3xl font-bold text-white">{item.title}</h3>
              <div className="mt-4 text-gray-300 text-lg leading-relaxed">{item.description}</div>
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
              className="relative group p-6 rounded-xl bg-white/10 backdrop-blur-xl border z-50 border-white/20 shadow-lg"
            >
              <h3 className="relative text-2xl font-bold text-white">{item.title}</h3>
              <p className="relative mt-3 text-gray-300 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;