import { motion } from "framer-motion";
import Light from "../../assets/images/ligth.png";

const HeroSection = () => {
  // Variants para la primera luz
  const light1Animation = {
    initial: { x: 0, y: 0 },
    animate: {
      x: [0, 40, -30, 20, -25, 0],
      y: [0, 30, -40, 25, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  // Variants para la segunda luz
  const light2Animation = {
    initial: { x: 0, y: 0 },
    animate: {
      x: [0, -35, 25, -20, 30, 0],
      y: [0, -30, 40, -25, 20, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-black w-full overflow-hidden flex flex-col items-center justify-center text-center">
      <img
        src={Light}
        alt="Light"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
      />

      <div className="absolute inset-0 z-0">
        {/* Primera luz con animación independiente */}
        <motion.div
          {...light1Animation}
          className="absolute top-[20%] left-[15%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-gradient-to-br from-purple-500/100 to-transparent rounded-full blur-2xl"
        ></motion.div>

        {/* Segunda luz con animación independiente */}
        <motion.div
          {...light2Animation}
          className="absolute top-[50%] left-[50%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-gradient-to-r from-blue-500/100 to-transparent rounded-full blur-3xl"
        ></motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center text-white w-full max-w-6xl px-8 md:px-12 lg:px-16"
      >
        <h2 className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-bold bg-clip-text text-white text-transparent leading-tight">
          Explora tu potencial profesional
        </h2>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-400 leading-relaxed">
          Descubre un universo de posibilidades y diseña tu camino hacia el{" "}
          <span className="font-semibold text-white">
            éxito profesional y personal
          </span>
          .
        </p>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#151515] to-[#101010] opacity-80 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;