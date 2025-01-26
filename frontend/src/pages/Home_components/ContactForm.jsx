import { useState, useRef } from "react";
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import { FiLoader } from "react-icons/fi";

const ContactForm = () => {
  const [agreed, setAgreed] = useState(false);
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const emailServiceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
  const emailTemplateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
  const emailPublicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

  const sanitizeInput = (value) => {
    return value.replace(/[^a-zA-Z0-9\s@.,_-]/g, "").trim();
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const sendEmail = async (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const data = {
      name: sanitizeInput(formData.get("name")),
      last_name: sanitizeInput(formData.get("last_name")),
      email: sanitizeInput(formData.get("email")),
      message: sanitizeInput(formData.get("message")),
    }

    if(!isValidEmail(data.email)){
      swal.fire({
        icon: "error",
        title: "Correo Inválido",
        text: "Por favor, ingresa un correo electrónico válido.",
        confirmButtonText: "Aceptar",
      });
      return
    }

    if(!data.name || !data.email || !data.message) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: "Todos los campos son obligatorios.",
        confirmButtonText: "Aceptar",
      });
      return
    }

    if (!agreed) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debes aceptar las Políticas de Privacidad para enviar tu mensaje.",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    
    setLoading(true);

    try {
      await emailjs.sendForm(
        emailServiceId,
        emailTemplateId,
        form.current,
        emailPublicKey
      );
      Swal.fire({
        icon: "success",
        title: "¡Mensaje Enviado!",
        text: "Gracias por tu mensaje. Te contactaremos pronto.",
        confirmButtonText: "Aceptar",
      });
      e.target.reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar tu mensaje. Por favor, inténtalo nuevamente.",
        confirmButtonText: "Aceptar",
      });
    }finally {
      setLoading(false);      
    }
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
        <p className="mt-2 text-lg text-white">
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
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-900 dark:text-white"
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-2.5 block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="last_name"
              className="block text-sm font-semibold text-gray-900 dark:text-white"
            >
              Apellido
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              className="mt-2.5 block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
            />
          </motion.div>

          <motion.div className="sm:col-span-2" variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900 dark:text-white"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2.5 block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
            />
          </motion.div>

          <motion.div className="sm:col-span-2" variants={itemVariants}>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-900 dark:text-white"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="mt-2.5 block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-white outline outline-1 outline-gray-600 placeholder-gray-400 focus:outline-indigo-500"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex gap-x-4 items-center sm:col-span-2 mt-6"
          variants={itemVariants}
        >
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
            , para el tratamiento de mis datos.
          </label>
        </motion.div>

        <motion.div className="mt-10" variants={itemVariants}>
        <button
            type="submit"
            disabled={loading}
            className={`flex justify-center items-center w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg focus:outline-indigo-500 ${
              loading ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-700"
            }`}
          >
            {loading ? (
              <FiLoader className="animate-spin h-5 w-5" />
            ) : (
              "Enviar"
            )}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default ContactForm;