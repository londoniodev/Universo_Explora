import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      name: "María López",
      comment:
        "Gracias a Explora, logré definir mis objetivos y crecer mi negocio de manera exponencial.",
      date: "22-03-2023",
    },
    {
      name: "Luis García",
      comment:
        "La asesoría personalizada de Explora me ayudó a organizar mis proyectos y mejorar mi productividad.",
      date: "15-02-2023",
    },
    {
      name: "Ana Martínez",
      comment:
        "Una experiencia increíble que me permitió descubrir nuevas oportunidades para mi carrera.",
      date: "10-01-2023",
    },
    {
      name: "Carlos Ramírez",
      comment:
        "Con la ayuda de Explora, encontré claridad en mis metas y una guía constante para alcanzarlas.",
      date: "05-12-2022",
    },
    {
      name: "Elena Rodríguez",
      comment:
        "El equipo de Explora está comprometido con el éxito de sus usuarios. Los recomiendo ampliamente.",
      date: "18-11-2022",
    },
    {
      name: "Roberto Gutiérrez",
      comment:
        "Explora cambió mi forma de trabajar y de pensar. Ahora tengo un camino claro hacia el éxito.",
      date: "03-10-2022",
    },
  ];

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

  const textVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div id="Testimonios" className="relative bg-[#101010] text-white py-20 font-satoshi">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/50 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-[50%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-blue-500/50 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="relative text-center mb-12 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-white"
          variants={textVariants}
        >
          Testimonios
        </motion.h2>
        <motion.p className="mt-2 text-lg text-gray-500" variants={textVariants}>
          Descubre lo que nuestros usuarios opinan sobre{" "}
          <span className="font-semibold text-white">Explora</span>.
        </motion.p>
      </motion.div>

      <motion.div
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="relative p-6 bg-black/40 border border-gray-700 rounded-lg shadow-xl backdrop-blur-md"
            variants={itemVariants}
          >
            <div className="absolute -top-5 left-5 text-cyan-400 text-4xl">
              <FaQuoteLeft />
            </div>
            <p className="text-gray-300 leading-relaxed italic">{testimonial.comment}</p>
            <div className="mt-6">
              <h3 className="font-semibold text-white">{testimonial.name}</h3>
              <p className="text-sm text-gray-400">{testimonial.date}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonials;