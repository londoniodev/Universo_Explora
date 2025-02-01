import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Opening = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start({ opacity: 1, y: 0 });
    }
  }, [inView, animation]);

  return (
    <motion.div
      ref={ref}
      className="relative max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 mt-[-2rem] text-white overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ x: [0, 25, -20, 15, -15, 0], y: [0, -15, 20, -10, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] w-[200px] h-[200px] bg-gradient-to-br from-purple-500/60 to-transparent rounded-full blur-2xl opacity-50"
        ></motion.div>
        <motion.div
          animate={{ x: [0, -20, 15, -10, 10, 0], y: [0, 20, -15, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-gradient-to-br from-blue-500/60 to-transparent rounded-full blur-3xl opacity-40"
        ></motion.div>
      </div>

      <div className="relative z-10">
        <motion.h1
          className="text-3xl font-bold text-center mb-6 leading-snug text-white drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={animation}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Cada año, miles de jóvenes enfrentan la incertidumbre de elegir una
          carrera sin tener claridad sobre su futuro. La presión, la
          desinformación y el miedo a equivocarse pueden hacer que tomes una
          decisión que no refleje quién eres realmente.
        </motion.h1>

        <motion.h2
          className="text-2xl font-semibold text-center text-indigo-400 mb-6 drop-shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={animation}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Pero no tiene que ser así.
        </motion.h2>

        <motion.h3
          className="text-xl font-medium text-white text-center mb-8 drop-shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={animation}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          Llevamos más de{" "}
          <span className="text-indigo-300 font-semibold">10 años</span>{" "}
          ayudando a jóvenes como tú a descubrir su vocación con un método
          probado que te dará confianza, visión y un plan claro para tu futuro.
        </motion.h3>

        <motion.div
          className="bg-black/30 p-6 rounded-xl shadow-lg border border-white/40 relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={animation}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <p className="text-lg font-semibold text-indigo-300 mb-4 drop-shadow-md">
            🔹 Nuestro Método: Te guiamos paso a paso hacia la decisión correcta
          </p>
          <ul className="space-y-4 text-white text-lg leading-relaxed drop-shadow-md">
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 text-xl">✔</span>{" "}
              <span>
                <strong>Descubre quién eres realmente:</strong> Identificamos
                tus talentos, intereses y valores.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 text-xl">✔</span>{" "}
              <span>
                <strong>Explora las profesiones del futuro:</strong> Te mostramos
                oportunidades alineadas con tu potencial.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 text-xl">✔</span>{" "}
              <span>
                <strong>Toma una decisión con seguridad:</strong> Te damos
                claridad para elegir con confianza.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 text-xl">✔</span>{" "}
              <span>
                <strong>Diseña tu proyecto de vida:</strong> Más que una
                carrera, creamos contigo un plan para un futuro exitoso y pleno.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Opening;