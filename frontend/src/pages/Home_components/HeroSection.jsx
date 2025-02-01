import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import Light from "../../assets/images/ligth.png";

const HeroSection = () => {
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        controls.start({ opacity: 0, y: 20 });
      } else {
        controls.start({ opacity: 1, y: 0 });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

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
      <div className="absolute bottom-0 left-0 w-full h-[5rem] bg-gradient-to-b from-black to-[#101010]"></div>
      <img
        src={Light}
        alt="Light"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
      />

      <div className="absolute inset-0 z-0">
        <motion.div
          {...light1Animation}
          className="absolute top-[20%] left-[15%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-gradient-to-br from-purple-500/100 to-transparent rounded-full blur-2xl"
        ></motion.div>

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
        <h2 className="text-[1rem] sm:text-[4rem] md:text-[5rem] lg:text-[4rem] font-bold bg-clip-text text-white text-transparent leading-tight">
          No dejes tu futuro en manos del azar.
          Déjanos acompañarte en este momento clave de tu vida. Agenda tu sesión ahora.
        </h2>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-400 leading-relaxed">
          ¿Te sientes confundido o con muchas dudas para elegir carrera profesional?{" "}
          <span className="font-semibold text-white">No estás solo</span>.
        </p>
      </motion.div>

      <motion.div
        animate={controls}
        initial={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-20 flex justify-center items-center z-10"
      >
        <motion.div
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center"
        >
          <FaChevronDown className="text-white text-5xl opacity-90 animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#151515] to-[#101010] opacity-80 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;