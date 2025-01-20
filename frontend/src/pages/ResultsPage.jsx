import PropTypes from "prop-types";
import ResultsChartD3 from "../assets/components/ResultsChartD3.jsx";

const ResultsPage = ({ calculatedResults }) => {
    const mockResults = calculatedResults || {
        Razonamiento: 13,
        Estabilidad_Emocional: -15,
        Dominancia: 10,
        Sociabilidad: 0,
        Normatividad: -15,
    };

    return (
        <div>
            <h1>Resultados</h1>
            <ResultsChartD3 results={mockResults} />
        </div>
    );
};

ResultsPage.propTypes = {
    calculatedResults: PropTypes.object,
};

export default ResultsPage;
