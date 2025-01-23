import Navbar from "../components/NavBar.jsx";
import AutoevaluationGraphic from "../components/AutoevaluationGraphic.jsx";
import Sixteenpfgraphic from "../components/Sixteenpfgraphic.jsx";
import { useAuthStore } from "../../store/AuthStore.jsx";
import { useEffect } from "react";
import NoData from "../../assets/images/nodata.png";

const GraphicResults = () => {
  const { fetchCalculatedResults, fetchCalculatedAutoevaluationResults, calculatedResults, autoevaluationResults } = useAuthStore();
  
  useEffect(() => {
    fetchCalculatedResults();
    fetchCalculatedAutoevaluationResults();
  }, [fetchCalculatedResults, fetchCalculatedAutoevaluationResults]);

  useEffect(() => {
    console.log("Autoevaluation Results:", autoevaluationResults);
  }, [autoevaluationResults]);

  const hasSixteenPFData = calculatedResults && calculatedResults.length > 0;
  const hasAutoevaluationData = autoevaluationResults && autoevaluationResults.labels && autoevaluationResults.labels.length > 0;

  const hasAnyData = hasSixteenPFData || hasAutoevaluationData;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      <h1 className="text-3xl font-bold text-indigo-500 pt-[5%] mb-6 text-center">
        Resultados del Test 16PF
      </h1>
      <p className="text-gray-300 text-center mb-10">
        Explora tus resultados en la gráfica y consulta los factores a continuación.
      </p>
      <div className="w-full mx-auto rounded-lg p-8">
        {hasAnyData ? (
          <>
            {hasSixteenPFData && <Sixteenpfgraphic />}
            {hasAutoevaluationData && <AutoevaluationGraphic />}
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