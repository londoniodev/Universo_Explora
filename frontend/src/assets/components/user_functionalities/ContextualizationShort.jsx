import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/AuthStore";
import { useParams } from "react-router-dom";
const ContextualizationShort = () => {

  const { packageId } = useParams();
  const { saveShortContextualizationAnswers, getShortContextualizationAnswers } = useAuthStore();

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const questions = [
    "¿Cuál es tu principal objetivo al realizar este test?",
    "Describe brevemente tus intereses laborales.",
    "¿Qué áreas profesionales te llaman más la atención?",
    "¿Tienes experiencia previa en algún campo laboral? Si es así, descríbelo.",
  ];

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getShortContextualizationAnswers(packageId);
      setAnswers(savedAnswers || {});
      setLoading(false);
    };
    loadAnswers();
  }, [getShortContextualizationAnswers, packageId]);

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [currentQuestion]: e.target.value });
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await saveShortContextualizationAnswers(answers, packageId);
      alert("¡Test completado!");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">
          Pregunta {currentQuestion + 1}/{questions.length}
        </h1>
        <p className="mb-4">{questions[currentQuestion]}</p>
        <textarea
          className="w-full border border-gray-300 p-2 rounded-md mb-4"
          value={answers[currentQuestion] || ""}
          onChange={handleAnswerChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleNext}
        >
          {currentQuestion === questions.length - 1 ? "Finalizar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default ContextualizationShort;
