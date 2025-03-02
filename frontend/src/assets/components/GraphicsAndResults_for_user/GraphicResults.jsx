import Navbar from "../NavBar.jsx";
import AutoevaluationGraphic from "../GraphicsAndResults_for_user/ActivityEvaluationGraphic.jsx";
import Sixteenpfgraphic from "../GraphicsAndResults_for_user/Sixteenpfgraphic.jsx";
import ActivityEvaluationGraphic from "../GraphicsAndResults_for_user/ActivityEvaluationGraphic.jsx";
import { useAuthStore } from "../../../store/AuthStore.jsx";
import { useEffect, useRef, useState } from "react";
import NoData from "../../../assets/images/nodata.png";
import Explora from "../../../assets/images/explora.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { FaFileDownload, FaSpinner, FaCheckCircle, FaStar } from "react-icons/fa";

const questionMapping = {
  nivelEducativoPadre: "Nivel educativo del padre:",
  nivelEducativoMadre: "Nivel educativo de la madre:",
  numeroIntegrantesFamilia: "Número de integrantes de la familia:",
  razonOrientacionVocacional: "¿Por qué decidieron tomar un proceso de orientación vocacional?",
  empresariosFamilia: "¿Hay empresarios, independientes, comerciantes o emprendedores en la familia? (Si hay, mencione quién de sus familiares)",
  expectativaPadres: "¿Qué expectativa crees que tienen sobre tu futuro tus padres?",
  planPostGraduacion: "¿Qué has pensado hacer una vez te gradúes?",
  autoconocimientoVocacional: "¿Has hecho un proceso de autoconocimiento o exploración vocacional?",
  mayorSueno: "¿Cuál es tu mayor sueño?",
  cumplirSuenosMetas: "¿Qué estarías dispuest@ a hacer para cumplir tus sueños/metas?",
  mayorObstaculo: "¿Cuál crees que es tu mayor obstáculo para cumplir tus sueños/metas?",
  mayorTemor: "¿Cuál es tu mayor temor?",
  exito: "¿Qué es el éxito para ti?",
  actividadFavorita: "¿Qué me gusta hacer?",
  habilidades: "¿Para qué soy buen@? (Cuales son las actividades que se te dan más fácilmente y sobresales)",
  quienDiceHabilidades: "¿Quién dice que soy bueno para eso? (Menciona quién o quienes lo dicen)",
  queHagoMejorQueOtros: "¿Qué hago mejor que otros?",
  aplicacionesProductivas: "¿Qué aplicaciones productivas tiene o para qué sirve lo que yo sé hacer mejor que otros?",
  queNoMeGustaHacer: "¿Qué no me gusta hacer?",
  noSoyBueno: "¿Para qué NO soy buen@?",
  quienDiceNoSoyBueno: "¿Quién dice que no soy bueno para eso?",
  temasQuieroAprender: "¿Sobre qué tema(s) quiero aprender en mi vida?",
  comoMeVeoEn10Anios: "¿Cómo me veo en 10 años? (Describe siendo quién, haciendo qué, teniendo qué)",
  metaEstadoIdeal: "¿Cuál sería una meta o un estado ideal que quisieras alcanzar con este programa?",
};

const GraphicResults = () => {
  const {
    fetchCalculatedResults,
    fetchCalculatedAutoevaluationResults,
    fetchActivityData,
    getCompletedContextualizationAnswers,
    calculatedResults,
    autoevaluationResults,
    activityResults,
    user,
  } = useAuthStore();

  const autoevaluationRef = useRef();
  const sixteenPFRef = useRef();
  const activityRef = useRef();

  const [answers, setAnswers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (fetchCalculatedResults) fetchCalculatedResults();
    if (fetchCalculatedAutoevaluationResults) fetchCalculatedAutoevaluationResults();
    if (fetchActivityData) fetchActivityData();
  }, [fetchCalculatedResults, fetchCalculatedAutoevaluationResults, fetchActivityData]);


  useEffect(() => {
    const fetchAnswers = async () => {
      const userAnswers = await getCompletedContextualizationAnswers();
      setAnswers(userAnswers);
    };
    fetchAnswers();
  }, []);

  const hasSixteenPFData = calculatedResults && calculatedResults.length > 0;
  const hasAutoevaluationData =
    autoevaluationResults &&
    autoevaluationResults.labels &&
    autoevaluationResults.labels.length > 0;

  const hasActivityData =
    activityResults &&
    activityResults.activities &&
    Object.keys(activityResults.activities).length > 0 &&
    activityResults.activityPerformance &&
    Object.keys(activityResults.activityPerformance).length > 0;

  const hasAnyData = hasSixteenPFData || hasAutoevaluationData || hasActivityData;

  const generatePDF = async () => {
    setIsLoading(true);
    setIsSuccess(false);

    const doc = new jsPDF("p", "mm", "a4");

    const img = new Image();
    img.src = Explora;

    img.onload = async () => {
      doc.addImage(img, "PNG", 10, 10, 40, 20);
      doc.setFontSize(18);
      doc.text("Resultados del Test", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text(
        "Este reporte contiene información detallada de tus resultados.",
        105,
        30,
        { align: "center" }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const userName = user?.name || "Usuario";
      doc.text(`Hola ${userName}, aquí podrás visualizar tus resultados detallados.`, 105, 45, { align: "center" });

      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const motivationText = `
        Recuerda que estos resultados no definen tu camino, sino que te ayudan a comprenderte mejor 
        y a tomar decisiones con más claridad. El crecimiento es un viaje constante, y cada paso cuenta. ★`;
      doc.text(doc.splitTextToSize(motivationText, 180), 15, 55, { align: "center" });
  
      doc.setDrawColor(200);
      doc.line(15, 65, 195, 65);

      if (answers && Object.keys(answers).length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text("Respuestas del Test de Contextualización", 105, 10, { align: "center" });

        let startY = 20;
        const pageHeight = 280;

        Object.entries(answers).forEach(([key, answer], index) => {
          const questionText = questionMapping[key] || key;
          const formattedQuestion = doc.splitTextToSize(`${index + 1}. ${questionText}`, 180);
          const formattedAnswer = doc.splitTextToSize(`Respuesta: ${answer}`, 180);
          
          if (startY + formattedQuestion.length * 7 + formattedAnswer.length * 7 > pageHeight) {
            doc.addPage();
            startY = 20;
          }

          doc.setFontSize(10);
          doc.text(formattedQuestion, 10, startY);
          startY += formattedQuestion.length * 7;

          doc.setFontSize(10);
          doc.text(formattedAnswer, 10, startY);
          startY += formattedAnswer.length * 7 + 5;
        });
      }
      
      if (autoevaluationRef.current) {
        const autoevaluationCanvas = autoevaluationRef.current.querySelector("canvas");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const autoevaluationImage = autoevaluationCanvas.toDataURL("image/png");
        const canvasWidth = 190;
        const aspectRatio = autoevaluationCanvas.height / autoevaluationCanvas.width;

        doc.addPage();
        doc.text("Resultados del Test de Autoevaluación", 105, 10, { align: "center" });
        doc.addImage(
          autoevaluationImage,
          "PNG",
          10,
          20,
          canvasWidth,
          canvasWidth * aspectRatio
        );
      }

      if (sixteenPFRef.current) {
        const canvas = await html2canvas(sixteenPFRef.current, { scale: 2 });
        const sixteenPFImage = canvas.toDataURL("image/png");

        doc.addPage();
        doc.text("Resultados del Test 16PF", 105, 10, { align: "center" });
        doc.addImage(sixteenPFImage, "PNG", 10, 20, 190, 140);
      }

      if (activityRef.current) {
        const activityCanvas = activityRef.current.querySelector("canvas");
        const activityImage = activityCanvas.toDataURL("image/png");

        const canvasWidth = 190;
        const aspectRatio = activityCanvas.height / activityCanvas.width;

        doc.addPage();
        doc.text("Resultados del Aprovechamiento del Tiempo Libre", 105, 10, { align: "center" });
        doc.addImage(
          activityImage,
          "PNG",
          10,
          20,
          canvasWidth,
          canvasWidth * aspectRatio
        );
      }

      doc.addPage();
      doc.text("Conclusiones", 105, 10, { align: "center" });
      doc.setFontSize(10);
      doc.text(
        "Aquí puedes incluir texto personalizado con conclusiones, recomendaciones y análisis relevantes.",
        10,
        20
      );

      doc.save("mis_resultados_universoexplora.pdf");
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 7000);
    };

    img.onerror = () => {
      alert("Error al cargar el logo.");
      setIsLoading(false);
    };
  };
  
  return (
    <div id="container" className="min-h-screen w-full">
      <Navbar />

      <div className="w-full mx-auto rounded-lg p-8">
        {hasAnyData ? (
          <>
            <h1 className="text-[3rem] font-bold text-indigo-500 pt-[10%] mb-6 text-center relative after:content-[''] after:w-24 after:h-1 after:bg-indigo-500 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 animate-fadeIn">
              Resultados del Test
            </h1>
            <p className="text-gray-300 text-center mb-6 text-lg max-w-3xl mx-auto px-6">
              Hola <span className="text-indigo-400 text-[1.3rem] font-semibold">{user?.name || "Usuario"}</span>, aquí podrás visualizar tus resultados detallados de las pruebas realizadas. 
              Explora las gráficas y consulta los factores clave para entender mejor tu desempeño.
            </p>
            <p className="text-center mb-[4%] text-lg max-w-3xl mx-auto px-6 leading-relaxed 
              bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 text-transparent bg-clip-text">
              Tus resultados reflejan dónde estás ahora, pero no definen quién eres ni hasta dónde puedes llegar.
              <span className="font-semibold">La vida está llena de cambios, aprendizajes y oportunidades.</span>, 
              Sigue avanzando y explorando tu camino. <FaStar className="inline-block text-yellow-400 text-xl ml-1 -mt-[1%]" />
            </p>
            {hasSixteenPFData && (
              <div id="sixteenPFGraphicContainer" ref={sixteenPFRef}>
                <Sixteenpfgraphic />
              </div>
            )}
            {hasAutoevaluationData && (
              <div ref={autoevaluationRef}>
                <AutoevaluationGraphic />
              </div>
            )}
            {hasActivityData && (
              <div ref={activityRef}>
                <ActivityEvaluationGraphic />
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button
                onClick={generatePDF}
                className={`px-6 py-3 text-lg font-semibold text-white rounded-md flex items-center gap-3 transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : isSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : isSuccess ? (
                  <FaCheckCircle />
                ) : (
                  <FaFileDownload  />
                )}
                {isLoading
                  ? "Generando PDF"
                  : isSuccess
                  ? "¡PDF Listo!"
                  : "Descargar PDF"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-gray-600 text-3xl font-semibold pt-[25%]">
              Aún no hay datos para graficar.
            </p>
            <img
              src={NoData}
              alt="NoData"
              className="h-[100%] w-[50%] mb-4 pointer-events-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphicResults;