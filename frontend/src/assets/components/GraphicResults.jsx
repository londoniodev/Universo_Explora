import Navbar from "../components/NavBar.jsx";
import AutoevaluationGraphic from "../components/AutoevaluationGraphic.jsx";
import Sixteenpfgraphic from "../components/Sixteenpfgraphic.jsx";
import ActivityEvaluationGraphic from "../components/ActivityEvaluationGraphic.jsx";
import { useAuthStore } from "../../store/AuthStore.jsx";
import { useEffect, useRef, useState } from "react";
import NoData from "../../assets/images/nodata.png";
import Explora from "../../assets/images/explora.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { FaFileDownload , FaSpinner, FaCheckCircle } from "react-icons/fa"; // Íconos

const GraphicResults = () => {
  const {
    fetchCalculatedResults,
    fetchCalculatedAutoevaluationResults,
    fetchActivityData,
    calculatedResults,
    autoevaluationResults,
    activityResults,
  } = useAuthStore();

  const autoevaluationRef = useRef();
  const sixteenPFRef = useRef();
  const activityRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Mostrar éxito después de descargar

  useEffect(() => {
    if (fetchCalculatedResults) fetchCalculatedResults();
    if (fetchCalculatedAutoevaluationResults) fetchCalculatedAutoevaluationResults();
    if (fetchActivityData) fetchActivityData();
  }, [fetchCalculatedResults, fetchCalculatedAutoevaluationResults, fetchActivityData]);

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
      // Agregar logo y título
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

      // Renderizar gráfica de autoevaluación con retraso
      if (autoevaluationRef.current) {
        const autoevaluationCanvas = autoevaluationRef.current.querySelector("canvas");

        // Retrasar la captura para permitir que la gráfica termine de cargar
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

      // Renderizar gráfica del 16PF
      if (sixteenPFRef.current) {
        const canvas = await html2canvas(sixteenPFRef.current, { scale: 2 });
        const sixteenPFImage = canvas.toDataURL("image/png");

        doc.addPage();
        doc.text("Resultados del Test 16PF", 105, 10, { align: "center" });
        doc.addImage(sixteenPFImage, "PNG", 10, 20, 190, 140);
      }

      // Renderizar gráfica de actividades
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

      // Agregar texto adicional
      doc.addPage();
      doc.text("Conclusiones", 105, 10, { align: "center" });
      doc.setFontSize(10);
      doc.text(
        "Aquí puedes incluir texto personalizado con conclusiones, recomendaciones y análisis relevantes.",
        10,
        20
      );

      doc.save("resultados-test.pdf");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      <h1 className="text-3xl font-bold text-indigo-500 pt-[5%] mb-6 text-center">
        Resultados del Test
      </h1>
      <p className="text-gray-300 text-center mb-10">
        Explora tus resultados en la gráfica y consulta los factores a continuación.
      </p>
      <div className="w-full mx-auto rounded-lg p-8">
        {hasAnyData ? (
          <>
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
            <p className="text-gray-600 text-3xl font-semibold pt-[10%]">
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