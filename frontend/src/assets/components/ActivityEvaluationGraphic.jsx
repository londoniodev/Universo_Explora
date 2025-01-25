import { useAuthStore } from "../../store/AuthStore.jsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useRef } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ActivityEvaluationGraphic = ({ setActivityImage }) => {
  const chartRef = useRef(null);
  const { activityResults } = useAuthStore();

  if (
    !activityResults ||
    !Object.keys(activityResults.activities || {}).length ||
    !Object.keys(activityResults.activityPerformance || {}).length
  ) {
    return <p className="text-gray-500 text-center">No hay datos para actividades.</p>;
  }

  const activityLabels = Object.keys(activityResults.activities);
  const affinityData = Object.values(activityResults.activities).map((value) =>
    value > 3 ? 3 : value < 0 ? 0 : value
  );
  const performanceData = Object.values(activityResults.activityPerformance).map((value) =>
    value > 3 ? 3 : value < 0 ? 0 : value
  );

  const chartData = {
    labels: activityLabels,
    datasets: [
      {
        label: "Interés",
        data: affinityData,
        backgroundColor: "#00A6FF",
      },
      {
        label: "Desempeño",
        data: performanceData,
        backgroundColor: "#0056B3",
      },
    ],
  };

  const exportChartImage = () => {
    if (chartRef.current) {
      const imageURL = chartRef.current.toBase64Image();
      setActivityImage(imageURL);
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">
        Aprovechamiento del Tiempo Libre
      </h1>
      <p className="text-gray-300 text-center mb-10">
        Evaluación de actividades en términos de afinidad y desempeño.
      </p>
      <div className="relative flex-grow bg-gray-50 rounded-lg shadow-inner p-6 border border-gray-200">
        <Bar
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            indexAxis: "y",
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.raw.toFixed(1)}`,
                },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                max: 3,
                ticks: {
                  stepSize: 0.5,
                  callback: (value) => value.toFixed(1),
                },
                title: { display: true, text: "Nivel (0.0 = Bajo, 3.0 = Alto)" },
              },
              y: {
                ticks: { autoSkip: false },
                title: { display: true, text: "Actividad" },
              },
            },
          }}
        />
        <button
          onClick={exportChartImage}
          className="hidden"
          aria-hidden="true"
        >
          Exportar Imagen
        </button>
      </div>
    </div>
  );
};

export default ActivityEvaluationGraphic;