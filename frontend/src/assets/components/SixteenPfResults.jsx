import { useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore.jsx";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const SixteenPfResults = () => {
  const { fetchCalculatedResults, calculatedResults } = useAuthStore();

  useEffect(() => {
    fetchCalculatedResults(); 
  }, []);

  const chartData = calculatedResults
    ? {
        labels: calculatedResults.map((result) => result.factor),
        datasets: [
          {
            label: "Resultados",
            data: calculatedResults.map((result) => result.average * 100),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            fill: false,
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6">
      <div className="w-full mx-auto shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Resultados del Test 16PF
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Explora tus resultados en la gráfica y consulta los factores a continuación.
        </p>

        <div className="flex gap-8 items-start">
          {calculatedResults ? (
            <div className="overflow-x-auto flex-shrink-0 w-1/4">
              <table className="table-auto w-full border-collapse rounded-lg shadow-md">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-2 py-1 text-sm">PF</th>
                    <th className="px-2 py-1 text-sm">Factor</th>
                    <th className="px-2 py-1 text-sm">%</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedResults.map((result, index) => (
                    <tr
                      key={result.factor}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}
                    >
                      <td className="border px-2 py-1 text-center font-semibold text-gray-700 text-sm">
                        {index + 1}
                      </td>
                      <td className="border px-2 py-1 text-left font-medium text-gray-700 text-sm truncate">
                        {result.factor}
                      </td>
                      <td className="border px-2 py-1 text-center font-semibold text-indigo-600 text-sm">
                        {result.average * 100}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">Cargando resultados...</p>
          )}

          {/* Gráfica de líneas con etiquetas */}
          <div className="relative flex-grow bg-gray-100 rounded-lg shadow-inner p-6">
            {/* Etiquetas izquierda */}
            <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between text-right pr-4 text-sm font-semibold text-gray-700">
              {[
                "DISTANTE",
                "PRÁCTICO",
                "CAMBIANTE",
                "SUMISO",
                "CONTROLADO",
                "INCONFORMISTA",
                "TEMEROSO",
                "IMPASIBLE",
                "CONFIADO",
                "PRAGMÁTICO",
                "ABIERTO",
                "DESPREOCUPADO",
                "TRADICIONAL",
                "GREGARIO",
                "DESCUIDADO",
                "RELAJADO",
              ].map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>

            {/* Gráfica */}
            <div className="mx-16">
              {chartData ? (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    indexAxis: "y", // Cambia orientación
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.raw}%`,
                        },
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: (value) => `${value}%` },
                      },
                      y: {
                        ticks: { display: false },
                        grid: { display: false },
                      },
                    },
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-gray-400 text-center">Cargando gráfica...</p>
              )}
            </div>

            {/* Etiquetas derecha */}
            <div className="absolute right-0 top-4 bottom-4 flex flex-col justify-between text-left pl-4 text-sm font-semibold text-gray-700">
              {[
                "CERCANO",
                "ABSTRACTO",
                "CALMADO",
                "DOMINANTE",
                "ESPONTÁNEO",
                "CUMPLIDOR",
                "DESINHIBIDO",
                "SENSIBLE",
                "ESCÉPTICO",
                "IMAGINATIVO",
                "RESERVADO",
                "APRENSIVO",
                "EXPLORADOR",
                "INDEPENDIENTE",
                "ORGANIZADO",
                "NERVIOSO",
              ].map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Botón para regresar */}
        <div className="mt-10 flex justify-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
            onClick={() => window.history.back()}
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SixteenPfResults;
