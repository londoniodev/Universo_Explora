import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import LoadingSpinner from "../../pages/LoadingSpinner.jsx";

const ContextualizationTest = ({ loadAnswers, saveAnswers, completeTest }) => {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const totalQuestions = 24;

  const checkCompletion = () => {
    const answeredQuestions = Object.keys(answers).length;
    return answeredQuestions === totalQuestions;
  }

  useEffect(() => {
    const verifyCompletionStatus = async () => {
      try {
        setIsLoading(true);
        const savedAnswers = await loadAnswers(packageId);

        if (savedAnswers.isCompleted) {
          setIsCompleted(true);
          setAnswers(savedAnswers.answers || {});
          toast.error("El test ya está completado.");
          navigate(`/api/auth/dashboard/package/${packageId}`);
        } else {
          setAnswers(savedAnswers.answers || {});
        }
      } catch (error) {
        setError("Error al cargar las respuestas.");
        toast.error("Error al cargar las respuestas.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyCompletionStatus();
  }, [loadAnswers, packageId, navigate]);
  

  const handleInputChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await saveAnswers(answers, packageId);
      toast.success("¡Respuestas guardadas correctamente!");

      if (checkCompletion()) {
        await completeTest(packageId, "contextualization");
        setIsCompleted(true);
        toast.success("¡Test completado!");
        navigate(`/api/auth/dashboard/package/${packageId}`);
      }
    } catch (err) {
      setError("Error al guardar las respuestas.");
      toast.error("Error al guardar las respuestas.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <form onSubmit={handleSubmit} className="contextualization-container ml-auto">
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
            <div className="flex justify-center items-center text-center">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold text-white py-10">
                    Cuestionario de Contextualización
                    </h1>
                    <div className="space-y-6 w-full flex flex-col items-center">
                        <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl w-full max-w-4xl shadow-lg">
                            <label
                            htmlFor="nivelEducativoPadre"
                            className="font-semibold text-white text-2xl block mb-4"
                            >
                            Nivel educativo del padre:
                            </label>
                            <div className="flex flex-wrap justify-center gap-6">
                            {["Bachillerato", "Técnico/Tecnólogo", "Profesional", "Doctorado"].map((nivel) => (
                                <label
                                key={nivel}
                                className="flex items-center text-lg text-white font-medium cursor-pointer"
                                >
                                <input
                                    type="radio"
                                    id={nivel}
                                    name="nivelEducativoPadre"
                                    value={nivel}
                                    checked={answers.nivelEducativoPadre === nivel}
                                    onChange={(e) => handleInputChange("nivelEducativoPadre", e.target.value)}
                                    className="mr-2 scale-150 cursor-pointer"
                                />
                                {nivel}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl w-full max-w-4xl shadow-lg">
                        <label
                        htmlFor="nivelEducativoMadre"
                        className="font-semibold text-white text-2xl block mb-4"
                        >
                        Nivel educativo de la madre:
                        </label>
                        <div className="flex flex-wrap justify-center gap-6">
                        {["Bachillerato", "Técnico/Tecnólogo", "Profesional", "Doctorado"].map((nivel) => (
                            <label
                            key={nivel}
                            className="flex items-center text-lg text-white font-medium cursor-pointer"
                            >
                            <input
                                type="radio"
                                id={nivel}
                                name="nivelEducativoMadre"
                                value={nivel}
                                checked={answers.nivelEducativoMadre === nivel}
                                onChange={(e) => handleInputChange("nivelEducativoMadre", e.target.value)}
                                className="mr-2 scale-150 cursor-pointer"
                            />
                            {nivel}
                            </label>
                        ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl w-full max-w-4xl shadow-lg">
                        <label
                        htmlFor="numeroIntegrantesFamilia"
                        className="font-semibold text-white text-2xl block mb-4"
                        >
                        Número de integrantes de la familia:
                        </label>
                        <input
                        type="number"
                        id="numeroIntegrantesFamilia"
                        name="numeroIntegrantesFamilia"
                        value={answers.numeroIntegrantesFamilia || ""}
                        onChange={(e) => handleInputChange("numeroIntegrantesFamilia", e.target.value)}
                        className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        min="1"
                        />
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl w-full max-w-4xl shadow-lg">
                        {/* Pregunta: Razón de orientación vocacional */}
                        <label
                            htmlFor="razonOrientacionVocacional"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Por qué decidieron tomar un proceso de orientación vocacional?
                        </label>
                        <textarea
                            id="razonOrientacionVocacional"
                            name="razonOrientacionVocacional"
                            rows="4"
                            className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            value={answers.razonOrientacionVocacional || ""}
                            onChange={(e) =>
                            handleInputChange("razonOrientacionVocacional", e.target.value)
                            }
                        />
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl w-full max-w-4xl shadow-lg">
                        {/* Pregunta: Empresarios en la familia */}
                        <label
                            htmlFor="empresariosFamilia"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Hay empresarios, independientes, comerciantes o emprendedores en la familia?{" "}
                            <span className="text-lg">(Si hay, mencione quién de sus familiares)</span>
                        </label>
                        <textarea
                            id="empresariosFamilia"
                            name="empresariosFamilia"
                            rows="4"
                            className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            value={answers.empresariosFamilia || ""}
                            onChange={(e) =>
                            handleInputChange("empresariosFamilia", e.target.value)
                            }
                        />
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl w-full max-w-4xl shadow-lg">
                        {/* Pregunta: Expectativa de los padres */}
                        <label
                            htmlFor="expectativaPadres"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué expectativa crees que tienen sobre tu futuro tus padres?
                        </label>
                        <textarea
                            id="expectativaPadres"
                            name="expectativaPadres"
                            rows="4"
                            className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            value={answers.expectativaPadres || ""}
                            onChange={(e) =>
                            handleInputChange("expectativaPadres", e.target.value)
                            }
                        />
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl w-full max-w-4xl shadow-lg">
                        {/* Pregunta: Plan post-graduación */}
                        <label
                            htmlFor="planPostGraduacion"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué has pensado hacer una vez te gradúes?
                        </label>
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                            "Entrar a la universidad",
                            "Ir de intercambio unos meses",
                            "Entrar a trabajar",
                            "Tomarme 6 meses",
                            ].map((option) => (
                            <label
                                key={option}
                                className="flex items-center text-lg text-white font-medium cursor-pointer"
                            >
                                <input
                                type="radio"
                                id={option}
                                name="planPostGraduacion"
                                value={option}
                                checked={answers.planPostGraduacion === option}
                                onChange={(e) =>
                                    handleInputChange("planPostGraduacion", e.target.value)
                                }
                                className="mr-2 scale-150 cursor-pointer"
                                />
                                {option}
                            </label>
                            ))}
                        </div>
                    </div>


                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-8 rounded-xl shadow-lg">
                        {/* Pregunta: Autoconocimiento Vocacional */}
                        <label
                            htmlFor="autoconocimientoVocacional"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Has hecho un proceso de autoconocimiento o exploración vocacional?
                        </label>
                        <div className="flex flex-wrap justify-center gap-4">
                            {["Sí", "No"].map((choice) => (
                            <label
                                key={choice}
                                className="flex items-center text-lg text-white font-medium cursor-pointer"
                            >
                                <input
                                type="radio"
                                id={choice}
                                name="autoconocimientoVocacional"
                                value={choice}
                                checked={answers.autoconocimientoVocacional === choice}
                                onChange={(e) =>
                                    handleInputChange("autoconocimientoVocacional", e.target.value)
                                }
                                className="mr-2 scale-150 cursor-pointer"
                                />
                                {choice}
                            </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-8 w-full rounded-xl shadow-lg">
                        {/* Pregunta: Mayor sueño */}
                        <label
                            htmlFor="mayorSueno"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Cuál es tu mayor sueño?
                        </label>
                        <textarea
                            id="mayorSueno"
                            name="mayorSueno"
                            rows="4"
                            className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            value={answers.mayorSueno || ""}
                            onChange={(e) => handleInputChange("mayorSueno", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-8 rounded-xl shadow-lg">
                        {/* Pregunta: Cumplir sueños/metas */}
                        <label
                            htmlFor="cumplirSuenosMetas"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué estarías dispuest@ a hacer para cumplir tus sueños/metas?
                        </label>
                        <textarea
                            id="cumplirSuenosMetas"
                            name="cumplirSuenosMetas"
                            rows="4"
                            className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            value={answers.cumplirSuenosMetas || ""}
                            onChange={(e) => handleInputChange("cumplirSuenosMetas", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-teal-500 p-8 rounded-xl shadow-lg">
                        {/* Pregunta: Mayor obstáculo */}
                        <label
                            htmlFor="mayorObstaculo"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Cuál crees que es tu mayor obstáculo para cumplir tus sueños/metas?
                        </label>
                        <textarea
                            id="mayorObstaculo"
                            name="mayorObstaculo"
                            rows="4"
                            className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            value={answers.mayorObstaculo || ""}
                            onChange={(e) => handleInputChange("mayorObstaculo", e.target.value)}
                        />
                    </div>


                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        {/* Pregunta: Mayor temor */}
                        <label
                            htmlFor="mayorTemor"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Cuál es tu mayor temor?
                        </label>
                        <textarea
                            id="mayorTemor"
                            name="mayorTemor"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.mayorTemor || ""}
                            onChange={(e) => handleInputChange("mayorTemor", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        {/* Pregunta: Éxito */}
                        <label
                            htmlFor="exito"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué es el éxito para ti?
                        </label>
                        <textarea
                            id="exito"
                            name="exito"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.exito || ""}
                            onChange={(e) => handleInputChange("exito", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        {/* Pregunta: Actividad favorita */}
                        <label
                            htmlFor="actividadFavorita"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué me gusta hacer?
                        </label>
                        <textarea
                            id="actividadFavorita"
                            name="actividadFavorita"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.actividadFavorita || ""}
                            onChange={(e) => handleInputChange("actividadFavorita", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        {/* Pregunta: Habilidades */}
                        <label
                            htmlFor="habilidades"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Para qué soy buen@?
                        </label>
                        <p className="text-sm text-white italic mb-4">
                            (Cuales son las actividades que se te dan más fácilmente y sobresales)
                        </p>
                        <textarea
                            id="habilidades"
                            name="habilidades"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.habilidades || ""}
                            onChange={(e) => handleInputChange("habilidades", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg">
                        {/* Pregunta: Quién dice que soy bueno */}
                        <label
                            htmlFor="quienDiceHabilidades"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Quién dice que soy bueno para eso?
                            <span className="text-sm block text-gray-100">(Menciona quién o quienes lo dicen)</span>
                        </label>
                        <textarea
                            id="quienDiceHabilidades"
                            name="quienDiceHabilidades"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.quienDiceHabilidades || ""}
                            onChange={(e) => handleInputChange("quienDiceHabilidades", e.target.value)}
                        />
                    </div>


                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        <label
                            htmlFor="queHagoMejorQueOtros"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué hago mejor que otros?
                        </label>
                        <textarea
                            id="queHagoMejorQueOtros"
                            name="queHagoMejorQueOtros"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.queHagoMejorQueOtros || ""}
                            onChange={(e) => handleInputChange("queHagoMejorQueOtros", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        <label
                            htmlFor="aplicacionesProductivas"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué aplicaciones productivas tiene o para qué sirve lo que yo sé hacer mejor que otros?
                        </label>
                        <textarea
                            id="aplicacionesProductivas"
                            name="aplicacionesProductivas"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.aplicacionesProductivas || ""}
                            onChange={(e) =>
                            handleInputChange("aplicacionesProductivas", e.target.value)
                            }
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        <label
                            htmlFor="queNoMeGustaHacer"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Qué no me gusta hacer?
                        </label>
                        <textarea
                            id="queNoMeGustaHacer"
                            name="queNoMeGustaHacer"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.queNoMeGustaHacer || ""}
                            onChange={(e) => handleInputChange("queNoMeGustaHacer", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        <label
                            htmlFor="noSoyBueno"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Para qué NO soy buen@?
                        </label>
                        <textarea
                            id="noSoyBueno"
                            name="noSoyBueno"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.noSoyBueno || ""}
                            onChange={(e) => handleInputChange("noSoyBueno", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg mb-6">
                        <label
                            htmlFor="quienDiceNoSoyBueno"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Quién dice que no soy bueno para eso?
                        </label>
                        <textarea
                            id="quienDiceNoSoyBueno"
                            name="quienDiceNoSoyBueno"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.quienDiceNoSoyBueno || ""}
                            onChange={(e) => handleInputChange("quienDiceNoSoyBueno", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 w-full to-green-400 p-8 rounded-xl shadow-lg">
                        <label
                            htmlFor="temasQuieroAprender"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Sobre qué tema(s) quiero aprender en mi vida?
                        </label>
                        <textarea
                            id="temasQuieroAprender"
                            name="temasQuieroAprender"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.temasQuieroAprender || ""}
                            onChange={(e) => handleInputChange("temasQuieroAprender", e.target.value)}
                        />
                    </div>


                    <div className="bg-gradient-to-br from-green-600 to-green-400 my-16 p-8 rounded-xl shadow-lg w-full max-w-4xl">
                        <label
                            htmlFor="comoMeVeoEn10Anios"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Cómo me veo en 10 años? <br />
                            <span className="text-lg font-normal text-gray-100">
                            (Describe siendo quién, haciendo qué, teniendo qué)
                            </span>
                        </label>
                        <textarea
                            id="comoMeVeoEn10Anios"
                            name="comoMeVeoEn10Anios"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.comoMeVeoEn10Anios || ""}
                            onChange={(e) => handleInputChange("comoMeVeoEn10Anios", e.target.value)}
                        />
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-400 p-8 rounded-xl shadow-lg w-full max-w-4xl">
                        <label
                            htmlFor="metaEstadoIdeal"
                            className="font-semibold text-white text-2xl block mb-4"
                        >
                            ¿Cuál sería una meta o un estado ideal que quisieras alcanzar con este programa?
                        </label>
                        <textarea
                            id="metaEstadoIdeal"
                            name="metaEstadoIdeal"
                            rows="4"
                            className="p-4 w-full border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md focus:ring-2 focus:ring-green-300 outline-none transition duration-200"
                            value={answers.metaEstadoIdeal || ""}
                            onChange={(e) => handleInputChange("metaEstadoIdeal", e.target.value)}
                        />
                    </div>

                    <div className="p-8 rounded-xl text-center mt-12 bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg">
                        <h2 className="text-[#C8FF00] text-3xl font-semibold mb-4">¡Excelente trabajo, astronauta!</h2>
                        <p className="text-lg md:text-xl text-gray-100 font-medium leading-relaxed">
                            Has completado el formulario de contextualización y has dado un paso importante
                            en tu viaje de autodescubrimiento. Sigue adelante con entusiasmo y curiosidad,
                            ya que cada paso te acerca más a descubrir tus verdaderas pasiones y talentos.
                            ¡Prepárate para seguir explorando este universo lleno de posibilidades! 
                            <span className="text-[#C8FF00] text-2xl block mt-2">¡El viaje continúa!</span>
                        </p>
                    </div>
                </div>


                <div className="w-full flex justify-center mt-8 sticky bottom-4 space-x-4">
                    <button
                    type="submit"
                    disabled={isCompleted}
                    className={`bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md ${
                        isCompleted ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                    } transition duration-200`}
                    >
                    Guardar Respuestas
                    </button>
                </div>
            </div>
        </div>
        )}

        {error && (
            <div className="mt-6 p-4 text-white bg-red-500 rounded-md">
            {error}
            </div>
        )}
        </form>
    </div>
  );
};

ContextualizationTest.propTypes = {
  loadAnswers: PropTypes.func.isRequired,
  saveAnswers: PropTypes.func.isRequired,
  completeTest: PropTypes.func.isRequired,
};

export default ContextualizationTest;
