import { useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore.jsx";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import NoData from "../../assets/images/nodata.png";
import Navbar from "./NavBar.jsx";
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const SixteenPfResults = () => {
  const { fetchCalculatedResults, calculatedResults } = useAuthStore();
  const hasData = calculatedResults && calculatedResults.length > 0;

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
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar/>
      <div className="w-full mx-auto rounded-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-500 pt-[5%] mb-6 text-center">
          Resultados del Test 16PF
        </h1>
        <p className="text-gray-300 text-center mb-10">
          Explora tus resultados en la gráfica y consulta los factores a continuación.
        </p>
        {hasData ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="overflow-x-auto flex-shrink-0 w-[29%]">
            <table className="table-auto w-full border-collapse rounded-lg shadow-md">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-3 py-2 text-sm font-bold">PF</th>
                  <th className="px-3 py-2 text-sm font-bold">Factor</th>
                  <th className="px-3 py-2 text-sm font-bold">%</th>
                </tr>
              </thead>
              <tbody>
                {calculatedResults.map((result, index) => (
                  <tr
                    key={result.factor}
                    className={
                      index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                    }
                  >
                    <td className="border px-3 py-2 text-center font-semibold text-blue-700 text-sm">
                      {index + 1}
                    </td>
                    <td className="border px-3 py-2 text-left font-medium text-blue-700 text-sm truncate">
                      {result.factor}
                    </td>
                    <td className="border px-3 py-2 text-center font-semibold text-blue-600 text-sm">
                      {result.average * 100}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      
          <div className="relative flex-grow bg-gray-50 rounded-lg shadow-inner p-6 border border-gray-200">
            {[
              "7.5%", "12.8%", "18.1%", "23.5%", "29%", "34%", "39.2%", "44.4%",
              "50%", "55%", "60.5%", "65.5%", "70.9%", "76.1%", "81.5%",
            ].map((topPosition, index) => (
              <div
                key={index}
                className="absolute left-[13.3%] w-[74.4%] h-[1px] bg-[#d3d3d3]"
                style={{
                  top: topPosition,
                }}
              ></div>
            ))}

            <div className="absolute left-7 top-6 bottom-11 flex flex-col justify-between text-right pr-4 text-[10px] font-medium text-gray-600">
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
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  indexAxis: "y",
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
            </div>

            <div className="absolute right-7 top-6 bottom-11 flex flex-col justify-between text-left pl-4 text-[10px] font-medium text-gray-600">
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
        ) : (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-gray-600 text-3xl font-semibold pt-[10%]">
              Aún no hay datos para graficar.
            </p>
            <img src={NoData} alt="NoData" className="h-[100%] w-[50%] mb-4 pointer-events-none"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default SixteenPfResults;