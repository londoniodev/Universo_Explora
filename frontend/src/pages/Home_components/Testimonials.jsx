import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    { name: "Ana", comment: "Los recomiendo porque llegamos a la meta que teníamos y se comunican y explican muy bien.", date: "22-03-2023" },
    { name: "Tomas", comment: "Son concretos, eficaces y motivacionales.", date: "15-02-2023" },
    { name: "Alejandro", comment: "Fue muy conciso y el psicólogo tomó un papel neutral durante las sesiones.", date: "10-01-2023" },
    { name: "Nicolas", comment: "Logré descubrir lo que me apasiona y van más allá de simplemente escoger una carrera.", date: "05-12-2022" },
    { name: "Gloria", comment: "Lograron enfocar a mi hija para que ella tomara su propia decisión. Gran experiencia, forma de comunicación óptima, gran metodología.", date: "18-11-2022" },
    { name: "Edith", comment: "Me gustó por la seguridad con la que siento a mi hija con respecto a su vida futura y los recomiendo por seriedad, la confianza y la seguridad.", date: "03-10-2022" },
    { name: "Jhon", comment: "Los recomiendo porque ayudaron a mi hijo a defender su preferencia vocacional. Tienen una variedad de actividades.", date: "23-11-2022" },
    { name: "Carlos", comment: "Se realizó un seguimiento perfecto encontrando la carrera ideal según sus aptitudes y actitudes. Lenguaje adecuado.", date: "11-05-2023" },
    { name: "Maria Eugenia", comment: "Más allá de una carrera, ayudaron a mi hija a diseñar su proyecto de vida. Profesionalismo y cumplimiento garantizados.", date: "04-07-2023" },
    { name: "Oscar", comment: "El resultado fue satisfactorio porque mi hija está segura de lo que quiere estudiar, la veo muy decidida.", date: "26-08-2024" },
    { name: "Fernanda", comment: "Gracias a Explora, mi hijo logró aclarar sus dudas sobre su futuro y ahora está seguro de su elección profesional. ¡Gran equipo!", date: "12-09-2023" },
    { name: "Ricardo",comment: "El acompañamiento fue excelente. Me brindaron herramientas que realmente me ayudaron a entender mis opciones y tomar la mejor decisión.", date: "30-06-2023" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div id="Testimonios" className="relative bg-[#101010] text-white py-20 font-satoshi">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/50 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-[50%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-blue-500/50 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div className="relative text-center mb-12 z-10" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-white" variants={itemVariants}>
          Testimonios
        </motion.h2>
        <motion.p className="mt-2 text-lg text-gray-500" variants={itemVariants}>
          Descubre lo que nuestros usuarios opinan sobre <span className="font-semibold text-white">Explora</span>.
        </motion.p>
      </motion.div>

      <motion.div
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div key={index} className="relative p-6 bg-black/40 border border-gray-700 rounded-lg shadow-xl backdrop-blur-md" variants={itemVariants}>
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