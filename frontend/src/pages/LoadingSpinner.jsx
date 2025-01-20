import "../assets/css/spinner.css";

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <svg viewBox="25 25 50 50" className="spinner-svg">
        <circle cx="50" cy="50" r="20" className="loader"></circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
