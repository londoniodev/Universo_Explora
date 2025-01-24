import { useAuthStore } from "../../store/AuthStore.jsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AutoevaluationGraphic = () => {
  const { autoevaluationResults } = useAuthStore();

  if (!autoevaluationResults) return <p>No hay datos para mostrar.</p>;

  const affinity = autoevaluationResults.affinity.map((value) => value / 100 * 3);
  const performance = autoevaluationResults.performance.map((value) => value / 100 * 3);

  const chartData = {
    labels: autoevaluationResults.labels,
    datasets: [
      {
        label: "Desempeño Académico",
        data: performance,
        backgroundColor: "#FFAF00",
      },
      {
        label: "Motivación Académica",
        data: affinity,
        backgroundColor: "#F46920",
      },
    ],
  };

  return (
    <div className="min-h-screen w-full p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
        Resultados del Test de Autoevaluación
      </h1>
      <p className="text-gray-300 text-center mb-10">
        Explora tus resultados de afinidad y desempeño por área.
      </p>
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
                  label: (context) => `${context.raw.toFixed(1)}`,
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                title: { display: true, text: "Materias" },
              },
              y: {
                beginAtZero: true,
                max: 3,
                ticks: {
                  stepSize: 0.5,
                  callback: (value) => value.toFixed(1),
                },
                title: { display: true, text: "Nivel (1 = Bajo, 3 = Alto)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AutoevaluationGraphic;