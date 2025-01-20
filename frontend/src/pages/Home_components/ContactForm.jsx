import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

const ContactForm = ({ emailServiceId, emailTemplateId, emailPublicKey }) => {
  const [agreed, setAgreed] = useState(false);
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(emailServiceId, emailTemplateId, form.current, emailPublicKey)
      .then(
        () => {
          alert("¡Correo enviado con éxito! Gracias por tu mensaje.");
          e.target.reset();
        },
        (error) => {
          alert("Error al enviar el correo. Por favor, inténtalo nuevamente.");
          console.error("Error de EmailJS:", error);
        }
      );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      id="Contacto"
      className="relative isolate px-6 py-24 sm:py-32 lg:px-8 bg-[#101010]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <motion.div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem] dark:from-[#6ee7b7] dark:to-[#3b82f6]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      <motion.div
        className="mx-auto max-w-2xl text-center"
        variants={itemVariants}
      >
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Estemos en contacto
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Para nosotros lo más importante es resolver tus dudas y ayudarte a alcanzar tus objetivos.
        </p>
      </motion.div>

      <motion.form
        ref={form}
        onSubmit={sendEmail}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
        variants={containerVariants}
      >
        <motion.div
          className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Nombre
            </label>
            <div className="mt-2.5">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                required
                className="block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Apellido
            </label>
            <div className="mt-2.5">
              <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                required
                className="block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
              />
            </div>
          </motion.div>
          <motion.div className="sm:col-span-2" variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Correo Electrónico
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
              />
            </div>
          </motion.div>
          <motion.div className="sm:col-span-2" variants={itemVariants}>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Mensaje
            </label>
            <div className="mt-2.5">
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
              />
            </div>
          </motion.div>
          <motion.div className="flex gap-x-4 sm:col-span-2 items-center" variants={itemVariants}>
            <Switch
              checked={agreed}
              onChange={setAgreed}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                agreed ? "bg-indigo-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  agreed ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </Switch>
            <label htmlFor="agree" className="text-sm text-gray-400">
              Estoy de acuerdo con las{" "}
              <a href="#" className="font-semibold text-indigo-500">
                Políticas de Privacidad
              </a>
              .
            </label>
          </motion.div>
        </motion.div>

        <motion.div className="mt-10" variants={itemVariants}>
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-400 focus:outline-indigo-500"
          >
            Enviar
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

ContactForm.propTypes = {
  emailServiceId: PropTypes.string.isRequired,
  emailTemplateId: PropTypes.string.isRequired,
  emailPublicKey: PropTypes.string.isRequired,
};

export default ContactForm;