import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import toast from "react-hot-toast";

const FirstPackage = () => {
  const { packageId } = useParams();
  const {
    verifyPackageAccess,
    getContextualizationAnswers,
    getAutoevaluationAnswers,
    getSavedAnswers,
    updateResultsSent,
    user,
  } = useAuthStore();
  const navigate = useNavigate();

  const [contextualizationProgress, setContextualizationProgress] = useState(0);
  const [autoevaluationProgress, setAutoevaluationProgress] = useState(0);
  const [sixteenPfProgress, setSixteenPfProgress] = useState(0);
  const [allCompleted, setAllCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const resultsSent = user?.resultsSent || false;

  const contextualizationQuestions = 24;
  const autoevaluationQuestions = 90;
  const sixteenPfQuestions = 162;

  const handleSubmission = async () => {
    try {
      setIsSubmitting(true);
      await updateResultsSent();
      toast.success("Resultados enviados exitosamente.");
    } catch (error) {
      toast.error("Error al enviar los resultados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProgressAndStatus = async () => {
    setLoading(true);
    try {
      let contextualizationCompleted = false;
      let autoevaluationCompleted = false;
      let sixteenPfCompleted = false;
  
      const contextualizationData = await getContextualizationAnswers(packageId);
      if (contextualizationData.isCompleted) {
        setContextualizationProgress(100);
        contextualizationCompleted = true;
      } else {
        const completedQuestions = Object.keys(contextualizationData.answers || {}).length;
        setContextualizationProgress(
          Math.min(100, Math.round((completedQuestions / contextualizationQuestions) * 100))
        );
      }
  
      const autoevaluationData = await getAutoevaluationAnswers(packageId);
      if (autoevaluationData.isCompleted) {
        setAutoevaluationProgress(100);
        autoevaluationCompleted = true;
      } else {
        const completedAnswers = Object.values(autoevaluationData.answers || {}).reduce(
          (total, category) => total + Object.keys(category || {}).length,
          0
        );
        setAutoevaluationProgress(
          Math.min(100, Math.round((completedAnswers / autoevaluationQuestions) * 100))
        );
      }
  
      const sixteenPfData = await getSavedAnswers(packageId);
      if (sixteenPfData.isCompleted) {
        setSixteenPfProgress(100);
        sixteenPfCompleted = true;
      } else {
        const completedQuestions = Object.keys(sixteenPfData.answers || {}).length;
        setSixteenPfProgress(
          Math.min(100, Math.round((completedQuestions / sixteenPfQuestions) * 100))
        );
      }
  
      setAllCompleted(
        contextualizationCompleted && autoevaluationCompleted && sixteenPfCompleted
      );
    } catch (error) {
      console.log("Error al actualizar el progreso:", error);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const hasAccess = await verifyPackageAccess(packageId);
        if (!hasAccess) {
          toast.error("Acceso denegado al paquete.");
          navigate("/api/auth/dashboard/package");
        }
      } catch (error) {
        toast.error("Error verificando acceso al paquete.");
        navigate("/api/auth/dashboard");
      }
    };

    checkAccess();
    updateProgressAndStatus();
  }, [packageId, verifyPackageAccess, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
        <h1 className="text-xl font-semibold text-gray-700">Cargando progreso...</h1>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <h1 className="text-6xl font-bold text-white text-center px-6 mb-6">
          Tus resultados serán analizados por un profesional.
        </h1>
        <p className="text-xl text-white text-center px-4 mb-6">
          Esto tomará un momento, por favor espera.
        </p>
        <div className="animate-pulse flex items-center justify-center mt-10">
          <div className="text-3xl font-semibold text-white">Procesando...</div>
        </div>
      </div>
    );
  }

  if (resultsSent) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Resultados enviados exitosamente
        </h1>
        <p className="text-lg text-gray-700 text-center">
          Ya no puedes realizar cambios. Tus resultados están siendo interpretados por un profesional.
        </p>
        <p className="text-gray-500 text-center mt-4">
          Gracias por tu participación.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-3xl font-semibold text-white mb-6 text-purple-500">
        Autoconocimiento y Orientación Vocacional
      </h1>

      <div className="w-full max-w-md mb-6 px-20">
        {[{ progress: autoevaluationProgress, color: "green", label: "Autoevaluación" },
          { progress: contextualizationProgress, color: "blue", label: "Contextualización" },
          { progress: sixteenPfProgress, color: "purple", label: "Factores de Personalidad 16PF" }].map(({ progress, color, label }, index) => (
          <div key={index} className="mb-6">
            <div className="text-center mb-2">
              <p className="text-white">
                <span className={`font-bold text-2xl text-${color}-500`}>{progress}%</span>{" "}
                Completado del cuestionario de{" "}
                <span className={`font-bold text-2xl text-${color}-500`}>{label}</span>
              </p>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-6">
              <div
                className={`bg-${color}-500 h-6 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-4 w-full max-w-md mt-6">
        <Link
          to={`/api/auth/dashboard/package/${packageId}/autoevaluation`}
          className={`${
            autoevaluationProgress === 100 ? "pointer-events-none opacity-50" : ""
          } bg-green-500 text-white text-center px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition duration-200`}
        >
          Cuestionario de Autoevaluación
        </Link>

        <Link
          to={`/api/auth/dashboard/package/${packageId}/contextualization`}
          className={`${
            contextualizationProgress === 100 ? "pointer-events-none opacity-50" : ""
          } bg-blue-500 text-white text-center px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-200`}
        >
          Cuestionario de Contextualización
        </Link>

        <Link
          to={`/api/auth/dashboard/package/${packageId}/sixteenpf-test`}
          className={`${
            sixteenPfProgress === 100 ? "pointer-events-none opacity-50" : ""
          } bg-purple-500 text-white text-center px-6 py-3 rounded-md shadow-md hover:bg-purple-600 transition duration-200`}
        >
          Cuestionario de Factores de Personalidad 16PF
        </Link>
      </div>
      <Link to={`/api/auth/dashboard`} className="mt-8 text-white bg-blue-500 text-center px-6 py-3 rounded-md shadow-md hover:bg-gray-600 transition duration-200">Regresar a la dashboard</Link>

      {allCompleted && (
        <button
          onClick={handleSubmission}
          className="mt-8 bg-yellow-500 w-full text-white px-6 py-3 rounded-md shadow-md hover:bg-yellow-600 transition duration-200"
        >
          Enviar mis Resultados
        </button>
      )}
    </div>
  );
};

export default FirstPackage;