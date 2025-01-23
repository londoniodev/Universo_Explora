import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import LoadingSpinner from "../../pages/LoadingSpinner.jsx";

const AutoevaluationTest = ({ loadAnswers, saveAnswers, completeTest }) => {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    affinity: {},
    performance: {},
    activities: {},
    activityPerformance: {},
    experiences: {},
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const totalQuestions = 90;

  const areas = [
    "Lenguas e Idiomas", "Matemáticas", "Física", "Química", "Biología",
    "Historia", "Geografía", "Derecho", "Filosofía", "Artes (Música, dibujo, escultura, escritura)",
    "Sistemas e Informática", "Economía", "Emprendimiento empresarial",
    "Marketing y publicidad", "Ventas", "Agricultura", "Mecánica", "Deportes", "Literaria / comunicativa",
  ];

  const activities = [
    "Pintar o dibujar", "Tocar un instrumento", "Cantar o bailar", "Diseñar y construir objetos",
    "Diseñar ropa y accesorios", "Compartir, salir o hablar con amigos o amigas", "Escribir",
    "Leer", "Arreglar cosas que se dañan", "Actividades en el computador", "Hacer un deporte",
    "Investigar cosas por tu propia cuenta", "Escuchar música", "Ir al campo, pescar, montar a caballo",
    "Pasar tiempo con animales y cuidarlos", "Jugar juegos electrónicos", "Ir a cine y/o teatro",
    "Vender diferentes artículos (Productos o servicios)", "Viajar a distintos lugares", "Aprender otros idiomas",
    "Cocinar", "Mantenerme actualizado en noticias (periódicos, noticieros, revistas)",
  ];

  const checkCompletion = () => {
    const answeredQuestions = Object.values(answers).reduce((total, category) => {
      return total + Object.keys(category || {}).length;
    }, 0);
    return answeredQuestions === totalQuestions;
  };

  useEffect(() => {
    const verifyCompletionStatus = async () => {
      try {
        setIsLoading(true);
        const savedAnswers = await loadAnswers(packageId);
  
        if (savedAnswers.isCompleted) {
          setIsCompleted(true);
          toast.error("El test ya está completado.");
          navigate(`/api/auth/dashboard/package/${packageId}`);
        } else {
          setAnswers(savedAnswers.answers || {});
          setIsCompleted(false);
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
  
  

  const handleTableChange = (category, key, value) => {
    const numericalValue =
      value === "Nada de interés" || value === "Cierta Dificultad" ? 1
        : value === "Mediano interés" || value === "Mediano Desempeño"
        ? 2
        : value === "Alto interés" || value === "Alto Desempeño"
        ? 3
        : null;

    setAnswers((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: numericalValue,
      },
    }));
  };  

  const handleInputChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      experiences: {
        ...prev.experiences,
        [question]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await saveAnswers(answers, packageId);
      toast.success("¡Respuestas guardadas con éxito!");

      if (checkCompletion()) {
        await completeTest(packageId, "autoevaluation");
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
    <div className="w-full min-h-screen -mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 shadow-xl rounded-lg mt-8">
        {isLoading && <LoadingSpinner />}
        {!isLoading && (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold text-indigo-500 border-b-2 border-indigo-500">Autoevaluación Personal</h1>
              <p className="text-lg text-white mt-2">Evalúa tus intereses, afinidades y desempeños.</p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {[
                {
                  title: "Áreas y Afinidad",
                  description: "Selecciona tu nivel de afinidad con las siguientes áreas:",
                  items: areas,
                  category: "affinity",
                  options: ["Nada de interés", "Mediano interés", "Alto interés"],
                },
                {
                  title: "Áreas y Desempeño",
                  description: "Selecciona tu nivel de desempeño en las siguientes áreas:",
                  items: areas,
                  category: "performance",
                  options: ["Cierta Dificultad", "Mediano Desempeño", "Alto Desempeño"],
                },
                {
                  title: "Actividades e Intereses",
                  description: "Selecciona tu nivel de interés en las siguientes actividades:",
                  items: activities,
                  category: "activities",
                  options: ["Nada de interés", "Mediano interés", "Alto interés"],
                },
                {
                  title: "Actividades y Desempeño",
                  description: "Selecciona tu nivel de desempeño en las siguientes actividades:",
                  items: activities,
                  category: "activityPerformance",
                  options: ["Cierta Dificultad", "Mediano Desempeño", "Alto Desempeño"],
                },
              ].map((section, idx) => (
                <div key={idx} className="bg-gray-700 shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">{section.title}</h2>
                  <p className="text-white mb-4">{section.description}</p>
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                      <thead className="bg-indigo-700 text-white">
                        <tr>
                          <th className="px-4 py-2">Elemento</th>
                          {section.options.map((option, optIdx) => (
                            <th key={optIdx} className="px-4 py-2">{option}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item, itemIdx) => (
                          <tr key={itemIdx} className={itemIdx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="px-4 py-2 font-medium text-gray-700">{item}</td>
                            {section.options.map((option, optIdx) => (
                              <td key={optIdx} className="px-4 py-2 text-center">
                                <input
                                  type="radio"
                                  name={`${section.category}-${item}`}
                                  value={option}
                                  checked={
                                    answers[section.category]?.[item] ===
                                    (option === "Nada de interés" || option === "Cierta Dificultad"
                                      ? 1
                                      : option === "Mediano interés" || option === "Mediano Desempeño"
                                      ? 2
                                      : option === "Alto interés" || option === "Alto Desempeño"
                                      ? 3
                                      : null)
                                  }
                                  onChange={() => handleTableChange(section.category, item, option)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Preguntas Abiertas</h2>
                <p className="text-gray-600 mb-4">Responde a las siguientes preguntas de manera reflexiva:</p>
                <div className="space-y-6">
                  {[
                    "¿Qué tipos y cuales son las experiencias que deseas vivir?",
                    "¿Cuándo tenías entre 3 y 5 años en quién te querías convertir?",
                    "¿Cuándo tenías entre 5 y 7 años qué te imaginabas haciendo o creando?",
                    "¿Cuándo tenías entre los 7 y 10 años cuál era la aspiración que tenías?",
                    "¿Cómo era tu vida en la etapa de la adolescencia y qué aspirabas?",
                    "¿Qué pensaste cuando tuviste que elegir un camino en tu vida? ¿Cómo lo elegiste y qué deseabas?",
                    "¿Cuál es tu mayor sueño?",
                    "¿Cuál es la aspiración más grande que tienes ahora?",
                  ].map((question, qIdx) => (
                    <div key={qIdx}>
                      <label className="block text-gray-700 font-medium mb-2">{question}</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows="3"
                        value={answers.experiences?.[question] || ""}
                        onChange={(e) => handleInputChange(question, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-4">
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
          </>
        )}
        {error && (
          <div className="mt-6 p-4 text-white bg-red-500 rounded-md text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

AutoevaluationTest.propTypes = {
  loadAnswers: PropTypes.func.isRequired,
  saveAnswers: PropTypes.func.isRequired,
  completeTest: PropTypes.func.isRequired,

};

export default AutoevaluationTest;