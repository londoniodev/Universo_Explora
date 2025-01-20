import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";
import { useEffect } from "react";

const TeamCarousel = () => {
  const { ref, inView } = useInView({ threshold: 0.2 }); // Trigger when 20% of the section is visible
  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start({ opacity: 1, y: 0 });
    } else {
      animation.start({ opacity: 0, y: 50 });
    }
  }, [inView, animation]);

  const teamMembers = [
    {
      name: "Dr. Juan Pérez",
      role: "Psicólogo Profesional",
      description: "Psicólogo especializado en desarrollo personal.",
      backgroundImage:
        "https://images.unsplash.com/photo-1525875101783-8a1dff5a6d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=150",
      socialLinks: {
        github: "https://github.com",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Carlos Mendoza",
      role: "Asistente Técnico",
      description: "Encargado de tecnología y marketing.",
      backgroundImage:
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=150",
      socialLinks: {
        github: "https://github.com",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Juan Carlos Zambrano",
      role: "Desarrollador de Software",
      description: "Creando herramientas digitales innovadoras.",
      backgroundImage:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      profileImage:
        "https://images.unsplash.com/photo-1502767089025-657258bf0411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=150",
      socialLinks: {
        github: "https://github.com",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com",
      },
    },
  ];

  return (
    <div
      id="Equipo"
      ref={ref}
      className="relative bg-[#101010] text-white py-20 font-satoshi"
    >
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ x: [0, 30, -30, 20, -20, 0], y: [0, -20, 20, -30, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-gradient-to-br from-purple-800/50 to-transparent rounded-full blur-2xl"
        ></motion.div>
        <motion.div
          animate={{ x: [0, -30, 30, -20, 20, 0], y: [0, 30, -30, 20, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-blue-500/50 to-transparent rounded-full blur-3xl"
        ></motion.div>
      </div>

      <motion.div
        animate={animation}
        transition={{ duration: 1 }}
        className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Nuestro Equipo
          </h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Conoce a las personas detrás de{" "}
            <span className="font-semibold text-white">Explora</span>.
          </p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="team-carousel"
        >
          {teamMembers.map((member, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative h-[450px] rounded-lg overflow-hidden shadow-lg group"
                style={{
                  backgroundImage: `url(${member.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4 shadow-lg">
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                  <p className="text-lg text-gray-300">{member.role}</p>
                  <p className="mt-3 text-sm text-gray-400 max-w-xs">
                    {member.description}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-black/30 p-3 rounded-full shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a
                      href={member.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-black/30 p-3 rounded-full shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      <FaFacebook size={20} />
                    </a>
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-black/30 p-3 rounded-full shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

export default TeamCarousel;