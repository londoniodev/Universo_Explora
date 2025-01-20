import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore.jsx";
import toast from "react-hot-toast";

const SixteenPfTest = () => {
  const { packageId } = useParams();
  const { getQuestions, getSavedAnswers, saveSixteenPfAnswers, completeTest } = useAuthStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highlightedQuestion, setHighlightedQuestion] = useState(null);
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculateProgress = (answers, totalQuestions) => {
    const answeredCount = Object.keys(answers || {}).length;
    return totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  };

  useEffect(() => {
    if (isCompleted) {
      toast.success("¡Test completado con éxito!");
      navigate(`/api/auth/dashboard/package/${packageId}`);
    }
  }, [isCompleted, navigate, packageId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { answers: savedAnswers, currentQuestionIndex, isCompleted } = await getSavedAnswers(packageId);

        if (isCompleted) {
          toast.error("El test ya está completado.");
          navigate(`/api/auth/dashboard/package/${packageId}`);
          return;
        }

        const questions = await getQuestions(packageId);
        const shuffled = shuffleArray(questions);
        setShuffledQuestions(shuffled);
        setAnswers(savedAnswers || {});
        setCurrentQuestionIndex(currentQuestionIndex || 0);
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error("No puedes acceder a este test. Ya ha sido completado.");
          navigate(`/api/auth/dashboard/package/${packageId}`);
        } else {
          toast.error("Error al cargar los datos del test.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getSavedAnswers, getQuestions, packageId, navigate]);

  const handleOptionChange = (selectedOption) => {
    if (!shuffledQuestions.length) return;

    const currentQuestionId = shuffledQuestions[currentQuestionIndex]?.id;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: selectedOption,
    }));

    setSkippedQuestions((prev) => prev.filter((id) => id !== currentQuestionId));

    if( currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }else{
      toast.success("Has respondido todas las preguntas.");
    }
  };

  const handleSave = async () => {
    try {
      await saveSixteenPfAnswers(answers, packageId, currentQuestionIndex);

      if (Object.keys(answers).length === shuffledQuestions.length) {
        await completeTest(packageId, "sixteenPF");
        setIsCompleted(true);
        toast.success("¡Test completado con éxito!");
        navigate(`/api/auth/dashboard/package/${packageId}`);
      } else {
        toast.success("Respuestas guardadas correctamente.");
      }
    } catch (error) {
      toast.error("Error al guardar las respuestas.");
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentQuestionIndex + 1, shuffledQuestions.length - 1);
    setSkippedQuestions((prev) => {
      if (!prev.includes(shuffledQuestions[currentQuestionIndex]?.id)) {
        return [...prev, shuffledQuestions[currentQuestionIndex]?.id];
      }
      return prev;
    });
    setCurrentQuestionIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = Math.max(currentQuestionIndex - 1, 0);
    setCurrentQuestionIndex(prevIndex);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  const handleGoToQuestion = (id) => {
    const questionIndex = shuffledQuestions.findIndex((q) => q.id === id);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
      scrollToTop();
      setHighlightedQuestion(questionIndex);
      toast.success(`Regresaste a la pregunta ${questionIndex + 1}`, {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => setHighlightedQuestion(null), 3000);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-semibold text-gray-700">Cargando preguntas...</h1>
      </div>
    );
  }

  if (!shuffledQuestions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-semibold text-gray-700">
          No se encontraron preguntas válidas para mostrar.
        </h1>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-400 mb-6 tracking-wide">
          Cuestionario de Factores de Personalidad 16PF
        </h1>
        <p className="text-lg text-gray-300">
          Responde las siguientes preguntas con sinceridad para obtener resultados precisos.
        </p>
      </div>
  
      <div className="relative w-full max-w-3xl mx-auto bg-gray-700 rounded-full h-5 mb-12 shadow-inner">
        <div
          className="absolute top-0 left-0 bg-blue-500 h-full rounded-full transition-width duration-300"
          style={{ width: `${calculateProgress(answers, shuffledQuestions.length)}%` }}
        ></div>
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white">
          {Math.round(calculateProgress(answers, shuffledQuestions.length))}%
        </span>
      </div>
  
      <div className="transition-all duration-500 transform scale-105 max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-8 mb-16 border border-gray-700">
        
        <div className="mb-10">
          <p className="text-right text-lg text-gray-400 font-medium">
            Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}
          </p>
          <h2 className={`text-3xl font-bold text-left leading-relaxed mt-6 ${
              highlightedQuestion === currentQuestionIndex ? "bg-yellow-100 text-black p-2 rounded" : "text-blue-300"
            }`}>
            {currentQuestion?.pregunta}
          </h2>

        </div>

        <div className="space-y-4">
          {currentQuestion?.opciones_respuesta.map((opcion) => (
            <label
              key={opcion.texto}
              className={`flex items-center space-x-4 px-5 py-4 rounded-lg border ${
                answers[currentQuestion?.id] === opcion.texto
                  ? "bg-blue-500 text-white border-blue-700"
                  : "bg-gray-700 text-gray-300 border-gray-600"
              } shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion?.id}`}
                value={opcion.texto}
                checked={answers[currentQuestion?.id] === opcion.texto}
                onChange={() => handleOptionChange(opcion.texto)}
                className="hidden"
              />
              <span>{opcion.texto}</span>
            </label>
          ))}
        </div>
      </div>
  
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-16">
        <button
          onClick={handlePrevious}
          className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          disabled={currentQuestionIndex === 0}
        >
          ← Retroceder
        </button>
  
        <button
          onClick={handleSave}
          disabled={isCompleted}
          className={`bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-8 rounded-lg shadow-md transition duration-200 ${
            isCompleted ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Guardar Respuestas
        </button>
  
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          disabled={currentQuestionIndex === shuffledQuestions.length - 1}
        >
          Avanzar →
        </button>
      </div>
  
      {skippedQuestions.length > 0 && (
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-500 rounded-lg p-6 shadow-md mb-12">
          <h3 className="text-xl font-bold text-red-600 mb-4">Preguntas sin responder:</h3>
          <ul className="list-disc list-inside text-gray-800 space-y-3">
            {skippedQuestions.map((id) => {
              const questionIndex = shuffledQuestions.findIndex((q) => q.id === id) + 1;
              const question = shuffledQuestions.find((q) => q.id === id);
              return (
                <li key={id} className="flex justify-between items-center">
                  <span>
                    {questionIndex}. {question?.pregunta}
                  </span>
                  <button
                    onClick={() => handleGoToQuestion(id)}
                    className="text-blue-500 hover:underline"
                  >
                    Ir a la pregunta
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  )}

export default SixteenPfTest;