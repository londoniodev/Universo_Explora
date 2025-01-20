import { Check, X } from "lucide-react";
import PropTypes from "prop-types";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "Mínimo 6 caracteres", met: password.length >= 6 },
    { label: "Debe tener mayúsculas", met: /[A-Z]/.test(password) },
    { label: "Debe contener minúsculas", met: /[a-z]/.test(password) },
    { label: "Debe contener un número", met: /\d/.test(password) },
    { label: "Debe contener un carácter especial", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-white text-sm font-semibold mb-2">Criterios de seguridad:</h3>
      <ul className="space-y-1">
        {criteria.map((criterion, index) => (
          <li
            key={index}
            className={`flex items-center text-sm ${
              criterion.met ? "text-green-400" : "text-white"
            }`}
          >
            {criterion.met ? (
              <Check className="mr-2" size={16} />
            ) : (
              <X className="mr-2" size={16} />
            )}
            {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

PasswordCriteria.propTypes = {
  password: PropTypes.string.isRequired,
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();

  const getStrengthLabel = () => {
    switch (strength) {
      case 1:
        return "Débil";
      case 2:
        return "Aceptable";
      case 3:
        return "Buena";
      case 4:
        return "Fuerte";
      default:
        return "Muy débil";
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <p className="text-white text-sm font-semibold">Seguridad de la Contraseña</p>
        <p
          className={`text-sm ${
            strength === 4
              ? "text-green-400"
              : strength >= 2
              ? "text-blue-400"
              : "text-white"
          }`}
        >
          {getStrengthLabel()}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className={`h-2 rounded-full ${
            strength === 1
              ? "bg-white"
              : strength === 2
              ? "bg-yellow-400"
              : strength === 3
              ? "bg-blue-400"
              : "bg-green-400"
          }`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired,
};

export default PasswordStrengthMeter;