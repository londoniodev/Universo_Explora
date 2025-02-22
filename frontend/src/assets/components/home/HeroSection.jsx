import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

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
    <div id="hero" className="relative min-h-screen bg-black w-full overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="absolute bottom-0 left-0 w-full h-[5rem] bg-gradient-to-b from-black to-[#101010]"></div>

      <div className="absolute inset-0 flex justify-center z-10 items-center pointer-events-none">
        <motion.div
          {...light2Animation}
          animate={{ x: ["-50vw", "50vw", "-50vw"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[50%] w-[700px] h-[700px] md:w-[1200px] md:h-[1200px] bg-gradient-to-r from-green-400 to-transparent rounded-full blur-[300px] transform -translate-x-1/2 -translate-y-1/2 opacity-60">
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center text-white w-full max-w-6xl px-8 md:px-12 lg:px-16"
      >
        <h2 className="relative text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[6rem] font-bold text-transparent bg-clip-text leading-tight before:content-['No_dejes_tu_futuro_en_manos_del_azar.'] before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-400 before:via-white before:to-gray-400 before:bg-clip-text before:text-transparent">
          No dejes tu futuro en manos del azar.
        </h2>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-400 leading-relaxed">
          Déjanos acompañarte en este momento clave de tu vida.{" "}
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