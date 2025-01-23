import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const AUTHENTICATION_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/auth" : "/api/auth";
const AUTOEVALUATION_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/autoevaluation" : "/api/autoevaluation";
const CONTEXTUALIZATION_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/contextualization" : "/api/contextualization";
const SIXTEENPFQUESTIONS_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/questions" : "/api/questions";
const SIXTEENPFANSWERS_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/answers" : "/api/answers";
const CART_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/cart" : "/api/cart";
const PURCHASE_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/purchase" : "/api/purchase";

axios.defaults.withCredentials = true; 
axios.defaults.baseURL = import.meta.env.MODE === "development" ? "http://localhost:4001" : "/";

let sessionExpiredToastShown = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !sessionExpiredToastShown) {
      sessionExpiredToastShown = true;
    }
    return Promise.reject(error);
  }
);

// const getAuthHeaders = () => {
//   const token = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("token="))
//     ?.split("=")[1];

//   if (!token) {
//     toast.error("Sesión no válida. Inicia sesión nuevamente.");
//     throw new Error("Token no encontrado");
//   }

//   return { Authorization: `Bearer ${token}` };
// };

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  cart: [],
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  questions: [],
  calculatedResults: null,
  autoevaluationResults: null,

  fetchCart: async () => {
    const { isAuthenticated } = get();
    if (!isAuthenticated) {
      return;
    }
    try {
      const response = await axios.get(`${CART_API}`, { withCredentials: true });
      set({ cart: response.data.items || [] });
    } catch (error) {
      set({ cart: [] });
    }
  },

  addToCart: async (testId, quantity) => {
    try {
      const response = await axios.post(
        `${CART_API}`,
        { testId, quantity },
        { withCredentials: true }
      );
      set({ cart: response.data.items });
      toast.success("Producto agregado al carrito.");
    } catch (error) {
      toast.error("Error al agregar el producto al carrito.");
    }
  },

  removeFromCart: async (testId) => {
    try {
      const response = await axios.delete(`${CART_API}/item`, {
        data: { testId },
        withCredentials: true,
      });
      set({ cart: response.data.items });
      toast.success("Producto eliminado del carrito.");
    } catch (error) {
      toast.error("Error al eliminar el producto del carrito.");
    }
  },

  clearCart: async () => {
    try {
      await axios.delete(`${CART_API}`, { withCredentials: true });
      set({ cart: [] });
      toast.success("Carrito vaciado.");
    } catch (error) {
      toast.error("Error al vaciar el carrito.");
    }
  },

  setUser: (newUser) => set({ user: newUser }),

  // ==========================
  //     SIGNUP Y LOGIN
  // ==========================
  signup: async ( name, last_name, birthdate, phone, city, gender, email, password ) => {
    try {
      set({ isLoading: true });
      const formData = { name, last_name, birthdate, phone, city, gender, email, password, };
      const response = await axios.post(`${AUTHENTICATION_API}/signup`, formData);
      set({ user: response.data.user, isAuthenticated: true, isLoading: false, });
      toast.success("Registro exitoso");
    } catch (error) {
      toast.error( error.response?.data?.message || "Error al registrarse" );
      set({ isLoading: false });
    }
  },

  verifyCode: async (code) => {
    try {
      set({ isLoading: true });
      await axios.post(`${AUTHENTICATION_API}/verify-code`, { code });
      set({ isLoading: false });
      toast.success("Código verificado correctamente");
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Error al verificar el código"
      );
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get(`${AUTHENTICATION_API}/check-auth`, { withCredentials: true });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      await get().fetchCart();
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
  
  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${AUTHENTICATION_API}/login`, { email, password }, { withCredentials: true });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success("Inicio de sesión exitoso.");

      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });

      if (error.response?.status === 401) {
        toast.error("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
      } else {
        toast.error("Error al iniciar sesión.");
      }
    }
  },

  fetchUserData: async () => {
    try {
      const response = await axios.get(`${AUTHENTICATION_API}/my-account`, { withCredentials: true });
      set({ user: response.data.user });
    } catch (error) {
      toast.error("Error al cargar datos del usuario.");
    }
  },  

  logout: async () => {
    try {
      await axios.post(`${AUTHENTICATION_API}/logout`);
      set({ user: null, isAuthenticated: false });
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${AUTHENTICATION_API}/forgot-password`, {
        email,
      });
      set({ isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({ isLoading: false });
      toast.error("Error al enviar correo de recuperación");
    }
  },

  recoveryPassword: async (token, password) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${AUTHENTICATION_API}/recovery-password/${token}`,
        { password }
      );
      set({ isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({ isLoading: false });
      toast.error("Error al restablecer contraseña");
    }
  },

  // ==========================
  //       COMPRAR TESTS
  // ==========================
  buyTests: async (purchasedTests) => {
    try {
      const response = await axios.post(
        `${PURCHASE_API}`,
        { purchasedTests, paymentMethod: "manual" },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        set({ user: response.data.user });
        set({ cart: [] });
        toast.success("Compra realizada con éxito.");
        return response;
      }
      throw new Error(response.data.message || "Error desconocido");
    } catch (error) {
      toast.error(error.message || "Error al realizar la compra.");
      return null;
    }
  },  

  // ==========================
  //    ACCESOS A LOS PAQUETES
  // ==========================
  verifyPackageAccess: async (packageId) => {
    try {
      const response = await axios.get(`/api/packages/${packageId}`, { withCredentials: true });
      if (response.data.success) {
        return true;
      } else {
        toast.error("No tienes acceso a este paquete.");
        return false;
      }
    } catch (error) {
      toast.error("Error al verificar el acceso al paquete.");
      return false;
    }
  },

  // ==========================
  //    CUENTA DEL USUARIO
  // ==========================
  getAccountInfo: async () => {
    try {
      const response = await axios.get(`${AUTHENTICATION_API}/my-account`, {
        // headers: getAuthHeaders()
      });
      set({ user: response.data.user });
    } catch (error) {
      toast.error("Error al obtener la información de la cuenta");
    }
  },

  updateAccountInfo: async (formData) => {
    try {
      const response = await axios.put(
        `${AUTHENTICATION_API}/my-account`,
        formData,
        {
          // headers: getAuthHeaders()
        }
      );
      set({ user: response.data.user });
      toast.success("Información de cuenta actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar la cuenta");
    }
  },

// ==========================
//    COMPLETAR TEST
// ==========================

completeTest: async (packageId, testType) => {
  try {
    const endpointMap = {
      autoevaluation: `${AUTOEVALUATION_API}/${packageId}/complete-autoevaluation`,
      contextualization: `${CONTEXTUALIZATION_API}/${packageId}/complete-contextualization`,
      sixteenPF: `${SIXTEENPFANSWERS_API}/${packageId}/complete-sixteenpf`,
    };

    const response = await axios.post(endpointMap[testType], null, { withCredentials: true });

    if (response.data.success) {
      toast.success(`El test de ${testType} se marcó como completado.`);
    } else {
      toast.error(`No se pudo completar el test de ${testType}.`);
    }
  } catch (error) {
    toast.error(`Error al completar el test de ${testType}.`);
  }
},

  // ==========================
  //  AUTOEVALUATION TEST
  // ==========================
  saveAutoevaluationAnswers: async (answers, packageId) => {
    try {
      const userId = get().user._id;
  
      if (!answers || !packageId) {
        toast.error("Faltan datos para guardar las respuestas.");
        return;
      }
  
      const response = await axios.post(
        `${AUTOEVALUATION_API}/${packageId}/save-autoevaluation`,
        { userId, answers }
      );
  
      if (response.status === 200) {
        toast.success("Respuestas guardadas exitosamente.");
      } else {
        toast.error("No se pudieron guardar las respuestas.");
      }
    } catch (error) {
      toast.error("Error al guardar las respuestas.");
    }
  },
  
  getAutoevaluationAnswers: async (packageId) => {
    try {
      const userId = get().user._id;
      const response = await axios.get(
        `${AUTOEVALUATION_API}/${packageId}/load-autoevaluation/${userId}`
      );
  
      if (response.status === 200) {
        return response.data || { answers: {}, isCompleted: false };
      }
    } catch (error) {
      if (error.response?.status === 403) {
        return { answers: {}, isCompleted: true };
      }
      throw error;
    }
  },

  fetchCalculatedAutoevaluationResults: async () => {
    try {
      const response = await axios.get("/api/autoevaluacionresults", { withCredentials: true });
      if (response.status === 200) {
        console.log("Autoevaluation Results API Response:", response.data.graphData);
        set({ autoevaluationResults: response.data.graphData });
      } else {
        toast.error("No se pudieron obtener los resultados de la autoevaluación.");
      }
    } catch (error) {
      console.error("Error al obtener los resultados de la autoevaluación:", error);
      toast.error("Error al obtener los resultados de la autoevaluación.");
    }
  },
  
  
// ==========================
// CONTEXTUALIZATION TEST
// ==========================
saveContextualizationAnswers: async (answers, packageId) => {
  try {
    if (!answers || !packageId) {
      toast.error("Faltan datos para guardar las respuestas.");
      return;
    }
    const response = await axios.post(`${CONTEXTUALIZATION_API}/${packageId}/save-contextualization`, { answers });
    if (response.status === 200) {
      toast.success("Respuestas guardadas exitosamente.");
    } else {
      toast.error("No se pudieron guardar las respuestas.");
    }
  } catch (error) {
    toast.error("Error al guardar las respuestas.");
  }
},

getContextualizationAnswers: async (packageId) => {
  try {
    const response = await axios.get(
      `${CONTEXTUALIZATION_API}/${packageId}/load-contextualization`
    );

    if (response.status === 200) {
      return response.data || { answers: {}, isCompleted: false };
    }
  } catch (error) {
    if (error.response?.status === 403) {
      return { answers: {}, isCompleted: true };
    }
    throw error;
  }
},


/// ==========================
//   16PF TEST
// ==========================

getQuestions: async (packageId) => {
  try {
    const userId = get().user._id;
    const response = await axios.get(`${SIXTEENPFQUESTIONS_API}/${packageId}/${userId}`);
    if (response.status === 200 && response.data.success) {
      set({ questions: response.data.questions });
      return response.data.questions;
    } else {
      toast.error("No se pudieron cargar las preguntas.");
      return [];
    }
  } catch (error) {
    toast.error("Error al obtener las preguntas.");
    return [];
  }
},

saveSixteenPfAnswers: async (answers, packageId, currentQuestionIndex) => {
  try {
    if (!answers || !packageId) {
      toast.error("Faltan datos para guardar las respuestas.");
      return;
    }

    const response = await axios.post(
      `${SIXTEENPFANSWERS_API}/${packageId}/save`,
      { answers, currentQuestionIndex }
    );

    if (response.status === 200) {
      toast.success("Respuestas guardadas correctamente.");
    } else {
      toast.error("No se pudieron guardar las respuestas.");
    }
  } catch (error) {
    toast.error("Error al guardar respuestas.");
  }
},


getSavedAnswers: async (packageId) => {
  try {
    const response = await axios.get(`${SIXTEENPFANSWERS_API}/${packageId}`, { withCredentials: true });

    if (response.data.success) {
      return {
        answers: response.data.answers || {},
        currentQuestionIndex: response.data.currentQuestionIndex || 0,
        isCompleted: response.data.isCompleted || false,
      };
    }
  } catch (error) {
    if (error.response?.status === 403) {
      return { answers: {}, currentQuestionIndex: 0, isCompleted: true };
    }
    throw error;
  }
},

fetchCalculatedResults: async () => {
  try {
    const response = await axios.get("/api/sixteenpfresults", { withCredentials: true });
    if (response.status === 200) {
      set({ calculatedResults: response.data.results });
    } else {
      toast.error("No se pudieron obtener los resultados.");
    }
  } catch (error) {
    toast.error("Error al obtener resultados.");
    console.error("Error al obtener resultados:", error);
  }
},


  // ==========================
  //  MISC
  // ==========================
  updateResultsSent: async () => {
    try {
      const response = await axios.post(
        `/api/users/update-results-sent`,
        null,
        {
          // headers: getAuthHeaders()
        }
      );
      if (response.data.success) {
        set((state) => ({
          user: { ...state.user, resultsSent: true },
        }));
        toast.success("Resultados enviados exitosamente.");
      } else {
        toast.error("No se pudieron enviar los resultados.");
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud.");
    }
  },

// ==========================
// SHORT CONTEXTUALIZATION
// ==========================

saveShortContextualizationAnswers: async (answers, packageId) => {
  try {
    const response = await axios.post(
      `/api/short-contextualization/save-short-contextualization/${packageId}`,
      { answers },
      { withCredentials: true }
    );
    if (response.status === 200) {
      toast.success("Respuestas guardadas correctamente.");
    } else {
      toast.error("Error al guardar respuestas.");
    }
  } catch (error) {
    toast.error("Error al guardar respuestas del test corto.");
  }
},

getShortContextualizationAnswers: async (packageId) => {
  try {
    const response = await axios.get(
      `/api/short-contextualization/load-short-contextualization/${packageId}`,
      { withCredentials: true }
    );
    return response.data || { answers: {}, isCompleted: false };
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error("Este test ya está completado.");
      return { answers: {}, isCompleted: true };
    }
    return { answers: {}, isCompleted: false };
  }
},
  
}));
