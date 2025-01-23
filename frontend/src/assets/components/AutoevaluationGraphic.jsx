import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useAuthStore } from "../../store/AuthStore.jsx";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AutoevaluationGraphic = () => {
  const { autoevaluationResults } = useAuthStore();

  console.log("Autoevaluation Results in AutoevaluationGraphic:", autoevaluationResults);

  const chartData = autoevaluationResults
    ? {
        labels: autoevaluationResults.labels,
        datasets: [
          {
            label: "Afinidad",
            data: autoevaluationResults.affinity,
            backgroundColor: "rgba(255, 159, 64, 0.8)", // Naranja oscuro
          },
          {
            label: "Desempeño",
            data: autoevaluationResults.performance,
            backgroundColor: "rgba(54, 162, 235, 0.8)", // Azul claro
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
        Resultados del Test de Autoevaluación
      </h1>
      <p className="text-gray-300 text-center mb-10">
        Explora tus resultados de afinidad y desempeño por área.
      </p>
      {chartData ? (
        <div className="relative flex-grow bg-gray-50 rounded-lg shadow-inner p-6 border border-gray-200">
          <Bar
            key={Math.random()}
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.raw}%`,
                  },
                },
              },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default AutoevaluationGraphic;