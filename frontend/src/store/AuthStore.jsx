import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AUTHENTICATION_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/auth" : "/api/auth";
const AUTOEVALUATION_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/autoevaluation" : "/api/autoevaluation";
const CONTEXTUALIZATION_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/contextualization" : "/api/contextualization";
const SIXTEENPFQUESTIONS_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/questions" : "/api/questions";
const SIXTEENPFANSWERS_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/answers" : "/api/answers";
const CART_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/cart" : "/api/cart";
const PURCHASE_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/purchase" : "/api/purchase";
const PSYCHOLOGIST_API = import.meta.env.VITE_PSYCHOLOGIST_API || "/api/psychologist";
const SOCKET_SERVER = import.meta.env.MODE === "development" ? "http://localhost:4001" : import.meta.env.VITE_SOCKET_SERVER || "/";
const PSYCHOLOGIST_CART_API = import.meta.env.MODE === "development" ? "http://localhost:4001/api/psychologist-access/cart" : "/api/psychologist-access/cart";
export const socket = io(SOCKET_SERVER, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});

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

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  cart: [],
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  pendingRequests: [],
  psychologistAccesses: [],
  accessBalance: 0,
  purchasedAccesses: [],

  questions: [],
  calculatedResults: null,
  autoevaluationResults: null,
  activityResults: null,

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
      toast.dismiss();
      const response = await axios.post(
        `${CART_API}`,
        { testId, quantity },
        { withCredentials: true }
      );
      set({ cart: response.data.items });
      toast.success("Producto agregado al carrito.");
    } catch (error) {
      toast.dismiss();
      toast.error("Error al agregar el producto al carrito.");
    }
  },

  removeFromCart: async (testId) => {
    try {
      toast.dismiss();
      const response = await axios.delete(`${CART_API}/item`, {
        data: { testId },
        withCredentials: true,
      });
      set({ cart: response.data.items });
      toast.success("Producto eliminado del carrito.");
    } catch (error) {
      toast.dismiss();
      toast.error("Error al eliminar el producto del carrito.");
    }
  },

  clearCart: async () => {
    try {
      toast.dismiss();
      await axios.delete(`${CART_API}`, { withCredentials: true });
      set({ cart: [] });
      toast.success("Carrito vaciado.");
    } catch (error) {
      toast.dismiss();
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
      toast.dismiss();
      toast.success("Registro exitoso");
    } catch (error) {
      toast.dismiss();
      toast.error( error.response?.data?.message || "Error al registrarse" );
      set({ isLoading: false });
    }
  },

  verifyCode: async (code) => {
    try {
      set({ isLoading: true });
      await axios.post(`${AUTHENTICATION_API}/verify-code`, { code });
      set({ isLoading: false });
      toast.dismiss();
      toast.success("Código verificado correctamente");
    } catch (error) {
      set({ isLoading: false });
      toast.dismiss();
      toast.error( error.response?.data?.message || "Error al verificar el código");
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get(`${AUTHENTICATION_API}/check-auth`,{ withCredentials: true });
      if (!response.data.user) throw new Error("Usuario no autenticado");
  
      let user = response.data.user;
  
      if (user.role === "psychologist" && user.profilePicture) {
        user.profilePicture = `${import.meta.env.VITE_BACKEND_URL}/uploads/psychologists/${user.profilePicture.split('/').pop()}`;
      }
  
      set((state) => ({
        ...state,
        user,
        isAuthenticated: true,
        isCheckingAuth: false,
      }));
  
      if (user.role === "psychologist" || user.role === "fallback_psychologist") {
        socket.emit("join-psychologist-room", user._id);
      }

      if (user.role === "psychologist") {
        await get().fetchCartPsychologistAccess();
      } else {
        await get().fetchCart();
      }

    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
  
  
  
  login: async (email, password) => {
    try {
      set({ isLoading: true });
  
      const response = await axios.post(`${AUTHENTICATION_API}/login`, { email, password }, { withCredentials: true });
  
      if (!response || response.status >= 400) {
        return null;
      }
  
      let user = response.data?.user;
  
      if (!user) {
        toast.error("Error en la respuesta del servidor.");
        set({ isLoading: false });
        return null;
      }
  
      if (user.role === "psychologist" && !user.isApproved) {
        toast("Tu cuenta está pendiente de aprobación. Recibirás un correo cuando sea validada.", {
          icon: "⏳",
          duration: 7000,
        });
  
        setTimeout(() => {
          set({ isLoading: false, user: null, isAuthenticated: false });
          navigate("/api/auth/login");
        }, 7000);
  
        return null;
      }
  
      if (user.role === "psychologist" && user.profilePicture) {
        user.profilePicture = `${import.meta.env.VITE_BACKEND_URL}/uploads/psychologists/${user.profilePicture.split('/').pop()}`;
      }
  
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success("Inicio de sesión exitoso.");
  
      try {
        await get().fetchCart();
      } catch (cartError) {
        console.warn("No se pudo cargar el carrito:", cartError.message);
      }
  
      return user;
      
    } catch (error) {
      toast.dismiss();
      set({ isLoading: false });
  
      if (!error.response) {
        toast.error("Error inesperado: No se recibió respuesta del servidor.");
        return null;
      }
  
      const status = error.response.status;
  
      if (status === 400) {
        toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else if (status === 403) {
        toast.error("Tu cuenta está pendiente de aprobación. Espera validación del administrador.");
      } else {
        toast.error("Error al iniciar sesión.");
      }
  
      return null;
    }
  },
  

  // ==========================
  //     SIGNUP FOR PSYCHOLOGISTS
  // ==========================

  registerPsychologist: async (formData) => {
    try {
      set({ isLoading: true });
  
      const response = await axios.post(`${PSYCHOLOGIST_API}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      set({ isLoading: false });
  
      toast.success("Registro exitoso. Espera la aprobación del administrador.");
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Error al registrarse.");
      return null;
    }
  },
  

  fetchUserData: async () => {
    try {
      const response = await axios.get(`${AUTHENTICATION_API}/my-account`, { withCredentials: true });
  
      if (response.data.success) {
  
        set((state) => ({
          user: {
            ...response.data.user,
            purchasedTests: response.data.user.purchasedTests || [],
            psychologistAssigned: response.data.user.psychologistAssigned || null,
          },
        }));
  
      }
    } catch (error) {
      toast.error("Error al cargar datos del usuario.");
      console.warn("⚠️ Error en fetchUserData:", error);
    }
  },
  
  
  logout: async () => {
    try {
      await axios.post(`${AUTHENTICATION_API}/logout`);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
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
      toast.dismiss();
      toast.success(response.data.message);
    } catch (error) {
      toast.dismiss();
      set({ isLoading: false });
      toast.error("Error al restablecer contraseña");
    }
  },

// ==========================
//       COMPRAR TESTS
// ==========================
buyTests: async (purchasedTests) => {
  try {
    toast.dismiss();

    const response = await axios.post(
      `${PURCHASE_API}`,
      { purchasedTests, paymentMethod: "manual" },
      { withCredentials: true }
    );

    if (response.data.success) {
      set((state) => ({
        user: { ...state.user, purchasedTests: response.data.user.purchasedTests }
      }));

      toast.success("Compra realizada con éxito.");

      const userId = get()?.user?._id;
      if (!userId) {
        console.warn("⚠️ No se pudo asignar un psicólogo: `userId` es undefined.");
        return null;
      }
      
      await axios.post(
        `${PSYCHOLOGIST_API}/requests/assign-auto`,
        { userId },
        { withCredentials: true }
      );

      socket.emit("new-request", { userId });

      return response;
    }

    throw new Error(response.data.message || "Error desconocido");

  } catch (error) {
    toast.error(error.response?.data?.message || "Error al realizar la compra.");
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
      toast.dismiss();
      toast.success("Información de cuenta actualizada correctamente");
    } catch (error) {
      toast.dismiss();
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
      toast.dismiss();
      toast.success(`El test de ${testType} se marcó como completado.`);
    } else {
      toast.dismiss();
      toast.error(`No se pudo completar el test de ${testType}.`);
    }
  } catch (error) {
    toast.dismiss();
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
        console.error("No se pudieron guardar las respuestas.");
      }
    } catch (error) {
      console.error("Error al guardar las respuestas.");
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
        set({ autoevaluationResults: response.data.graphData });
      } else {
        console.error("No se pudieron obtener los resultados de la autoevaluación.");
      }
    } catch (error) {
      console.error("Error al obtener los resultados de la autoevaluación.");
    }
  },

  fetchActivityData: async () => {
    try {
      const response = await axios.get("/api/autoevaluacionresults", { withCredentials: true });
      if (response.status === 200) {
        const { activities, activityPerformance } = response.data;

        if (!activities || !activityPerformance) {
          console.log("No se encontraron datos de actividades en las respuestas.");
          return;
        }
  
        set({
          activityResults: {
            activities: Object.fromEntries(
              Object.entries(activities).map(([key, value]) => [key, (value / 100) * 3])
            ),
            activityPerformance: Object.fromEntries(
              Object.entries(activityPerformance).map(([key, value]) => [key, (value / 100) * 3])
            ),
          },
        });
        
      } else {
        toast.error("No se pudieron obtener los datos de actividades.");
      }
    } catch (error) {
      toast.error("Error al obtener los datos de actividades.");
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

getCompletedContextualizationAnswers: async () => {
  try {
    const response = await axios.get(`${CONTEXTUALIZATION_API}/completed-answers`);

    if (response.status === 200) {
      return response.data.answers || {};
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error al obtener respuestas.");
    return {};
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
      console.error("No se pudieron cargar las preguntas.");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener las preguntas.");
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
      console.error("No se pudieron obtener los resultados.");
    }
  } catch (error) {
    console.error("Error al obtener los resultados.");
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

 // ==========================
  //  ADMIN: Gestionar Usuarios
  // ==========================
  fetchAllUsers: async () => {
    try {
      const response = await axios.get("/api/admin/users", { withCredentials: true });
      return response.data.users;
    } catch (error) {
      return [];
    }
  },

  deleteUser: async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`, { withCredentials: true });
      return true;
    } catch (error) {
      return false;
    }
  },

  updateUserRole: async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { newRole }, { withCredentials: true });
      return true;
    } catch (error) {
      return false;
    }
  },

// ==========================
//      UPDATE INFO PARA PSICÓLOGOS
// ==========================

fetchPsychologistAccountInfo: async () => {
  try {
    const response = await axios.get(`${AUTHENTICATION_API}/psychologist/my-account`, {
      withCredentials: true,
    });


    if (response.data.success) {
      const psychologist = {
        ...response.data.psychologist,
        profilePicture: response.data.psychologist.profilePicture?.startsWith("http")
          ? response.data.psychologist.profilePicture
          : `https://res.cloudinary.com/dkandom0b/image/upload/${response.data.psychologist.profilePicture}`,
      };

      set((state) => ({
        ...state,
        user: { ...psychologist },
      }));


      return psychologist;
    } else {
      toast.error("Error al obtener la información del psicólogo.");
      return null;
    }
  } catch (error) {
    toast.error("Error al obtener los datos del psicólogo.");
    return null;
  }
},


updatePsychologistAccountInfo: async (formData) => {
  try {
    const response = await axios.put(`${AUTHENTICATION_API}/psychologist/my-account`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    if (response.data.success) {
      set({ user: response.data.psychologist });

      toast.success("Perfil actualizado correctamente.");
      return response.data.psychologist;
    } else {
      toast.error("Error al actualizar la información.");
      return null;
    }
  } catch (error) {
    toast.error("Error al actualizar el perfil.");
    return null;
  }
},

// ==========================
//     GESTIÓN DE SOLICITUDES PARA PSICÓLOGOS
// ==========================
fetchPendingRequests: async () => {
  try {
    const { user } = get();

    if (!user || !user.role || (user.role !== "psychologist" && user.role !== "fallback_psychologist")) {
      console.warn("Usuario sin permisos intentó obtener solicitudes pendientes.");
      return;
    }

    const response = await axios.get(`${PSYCHOLOGIST_API}/pending-requests`, { withCredentials: true });

    if (response.data.success && Array.isArray(response.data.requests)) {

      const uniqueRequests = Array.from(new Map(response.data.requests.map(req => [req.userId._id, req])).values());

      set((state) => ({
        pendingRequests: uniqueRequests,
        pendingRequestCount: uniqueRequests.length,
      }));
    } else {
      console.warn("No se encontraron solicitudes pendientes.");
    }
  } catch (error) {
    console.error("Error al obtener solicitudes pendientes:", error.message);
  }
},

  // ==========================
  //     RESPONDER SOLICITUDES DE PSICOLOGOS PARA USUARIOS
  // ==========================

  respondToRequest: async (requestId, action) => {
    try {
      if (!requestId || !["accept", "reject"].includes(action)) {
        toast.error("Acción no válida.");
        return;
      }
  
      const response = await axios.post(`${PSYCHOLOGIST_API}/requests/respond`, { requestId, action });
  
      if (response.data.success) {
        socket.emit("request-handled", { requestId, action });
  
        toast.success(`Solicitud ${action === "accept" ? "aceptada" : "rechazada"} correctamente.`);
  
        await get().fetchPendingRequests();
      } else {
        toast.error(response.data.message || "Error al procesar la solicitud.");
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud.");
    }
  },

  // ==========================
  //     OBTENER USUARIOS ASIGNADOS
  // ==========================
  fetchAssignedUsers: async () => {
    try {
      const response = await axios.get(`${PSYCHOLOGIST_API}/dashboard`, { withCredentials: true });

      if (response.data.success) {
        set(() => ({ assignedUsers: response.data.assignedUsers }));
      } else {
        console.warn("No se encontraron usuarios asignados.");
      }
    } catch (error) {
      console.error("Error al obtener usuarios asignados:", error.message);
    }
  },

  
// ==========================
//     EVENTOS DE SOCKET.IO
// ==========================

listenToSocketEvents: () => {
  socket.on("new-request", async () => {
    toast.success("📩 Nueva solicitud de paciente recibida.");
    await get().fetchPendingRequests();
  });

  socket.on("request-removed", async ({ userId }) => {
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((req) => req.userId !== userId),
    }));
    toast.success("📩 Una solicitud fue eliminada.");
  });

  socket.on("assigned-user", async ({ psychologistId, userId, message }) => {
    if (get().user?._id === psychologistId) {
      toast.success(`📢 ${message}`);

      if (typeof get().fetchAssignedUsers === "function") {
        await get().fetchAssignedUsers();
      } else {
        console.warn("fetchAssignedUsers no está definido en AuthStore.");
      }
    }
  });

  socket.on("update-assigned-users", async () => {
    if (typeof get().fetchAssignedUsers === "function") {
      await get().fetchAssignedUsers();
    } else {
      console.warn("fetchAssignedUsers no está definido en AuthStore.");
    }
  });
},

 // ==========================
  // GESTIÓN DE ACCESOS PARA PSICÓLOGOS
  // ==========================

  fetchPsychologistPurchases: async () => {
    try {
      const response = await axios.get("/api/test-access/psychologist-purchases", { withCredentials: true });
  
      if (response.data.success) {
  
        set((state) => ({
          purchasedAccesses: response.data.purchases.map((purchase) => ({
            ...purchase,
            packageName: purchase.packageName || "Desconocido",
          })),
        }));
      }
    } catch (error) {
      console.warn("⚠️ Error al obtener las compras de accesos:", error);
    }
  },
  

  revokePsychologistAccess: async (token) => {
    try {
      const response = await axios.post(
        `/api/test-access/revoke`,
        { token },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        toast.success("Token revocado con éxito.");
  
        // 🔥 Actualizar la lista de accesos después de revocar
        await get().fetchActiveAccesses();
  
        return true;
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (error) {
      toast.error("Error al revocar acceso.");
      return false;
    }
  },
  

  // ==========================
  // GESTIÓN DE ACCESOS PARA USUARIOS GENERADOS POR EL PSICÓLOGO
  // ==========================


  fetchActiveAccesses: async () => {
    try {
      const response = await axios.get(`/api/test-access/psychologist-accesses`, { withCredentials: true });
      if (response.data.success) {
        set({ psychologistAccesses: response.data.accesses });
      }
    } catch (error) {
      console.warn("Error al obtener accesos activos:", error);
    }
  },
  
  handleGenerateAccessFromBalance: async (selectedPackageId) => {
    const { accessBalance } = get();
    if (accessBalance <= 0) {
      toast.error("No tienes accesos disponibles.");
      return;
    }

    try {
      const response = await axios.post(`/api/test-access/generate-psychologist-access`, {
        packageId: selectedPackageId,
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success("Acceso generado correctamente.");
        set({ accessBalance: response.data.accessBalance });
        get().fetchActiveAccesses();
      }
    } catch (error) {
      toast.error("Error al generar acceso.");
    }
  },

  fetchPsychologistAccessBalance: async () => {
    try {
      const response = await axios.get("/api/psychologist-access/access-balance", { withCredentials: true });
  
      if (response.data.success) {
        set({ accessBalance: response.data.accessBalance });
  
      } else {
        console.warn("No se pudo obtener el balance de accesos.");
      }
    } catch (error) {
      console.error("Error al obtener el saldo de accesos:", error);
    }
  },  


  handleValidateAccess: async (token) => {
    if (!token) {
      toast.error("Ingresa un token para validar.");
      return;
    }

    try {
      const response = await axios.post(`/api/test-access/validate`, { token }, { withCredentials: true });
      if (response.data.success) {
        toast.success("Token válido.");
      }
    } catch (error) {
      toast.error("Token inválido o expirado.");
    }
  },
// ==========================
// COMPRA DE ACCESOS PARA PSICÓLOGOS
// ==========================

  buyPsychologistAccesses: async (purchasedAccesses) => {
    try {
      const response = await axios.post("/api/psychologist-access/purchase", 
        { purchasedAccesses },
        { withCredentials: true }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error en la compra:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Error en la compra" };
    }
  },

  // ==========================
  // CARRITO DE COMPRAS PARA USUARIOS
  // ==========================

  handlePurchaseAccesses: async (selectedPackageId, accessQuantity) => {
    if (!selectedPackageId || accessQuantity <= 0) {
      toast.error("Debes seleccionar un paquete y una cantidad válida.");
      return;
    }

    try {
      const response = await axios.post(`/api/test-access/purchase`, {
        packageId: selectedPackageId,
        quantity: accessQuantity,
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success(`Has agregado ${accessQuantity} accesos.`);
        set({ accessBalance: response.data.accessBalance });
        get().fetchPsychologistPurchases();
      }
    } catch (error) {
      toast.error("Error al comprar accesos.");
    }
  },

  addToCartPsychologistAccess: async (packageId, title, price, quantity) => {
    try {
      const response = await axios.post(PSYCHOLOGIST_CART_API, {
        packageId,
        title,
        price,
        quantity
      }, { withCredentials: true });
  
      if (response.data.items) {
        set({ cart: response.data.items });
      } else {
        console.warn("La API no devolvió 'items'. Asegurar que el backend retorna los datos correctos.");
      }
  
    } catch (error) {
      toast.error("Error al agregar el paquete al carrito.");
    }
  },
  
  removeFromCartPsychologistAccess: async (packageId) => {
    try {
  
      const response = await axios.delete(`${PSYCHOLOGIST_CART_API}/${packageId}`, { withCredentials: true });
  
      if (response.data.success) {
        toast.success("Paquete eliminado del carrito.");
        
        set((state) => ({
          cart: state.cart.filter(item => item.packageId !== packageId),
        }));
  
      } else {
        toast.error("No se pudo eliminar el paquete.");
      }
    } catch (error) {
      toast.error("Error al eliminar el paquete.");
    }
  },

  clearCartPsychologistAccess: async () => {
    try {
      const response = await axios.delete(PSYCHOLOGIST_CART_API, { withCredentials: true });
  
      if (response?.data?.success) {
        set({ cart: [] });
      } else {
        console.warn("No se pudo limpiar el carrito:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error al limpiar el carrito:", error);
    }
  },
  
  
  
// ==========================
// MOSTRAR ACCESOS PARA PSICOLOGOS
// ==========================

  fetchCartPsychologistAccess: async () => {
    set({ loadingCart: true });
  
    try {
      const response = await axios.get(PSYCHOLOGIST_CART_API, { withCredentials: true });
  
      if (response.data.items && Array.isArray(response.data.items)) {
        
        set({ cart: response.data.items, loadingCart: false });
  
      } else {
        set({ cart: [], loadingCart: false });
      }
    } catch (error) {
      set({ cart: [], loadingCart: false });
    }
  },

  // ==========================
  // VALIDAR ACCESO AL PAQUETE PARA USUARIOS
  // ==========================
  
  validateUserAccessToken: async (token) => {
    try {
      const response = await axios.post("/api/test-access/validate-access-token", { token }, { withCredentials: true });
  
      if (response.data.success) {
        toast.success("Token válido. Redirigiendo...");
  
        set((state) => ({
          user: {
            ...state.user,
            psychologistAssigned: response.data.psychologistId,
            purchasedTests: [
              ...state.user.purchasedTests,
              { id: response.data.packageId, title: response.data.packageName },
            ],
          },
        }));
  
        return response.data;
      } else {
        toast.error("Token inválido.");
        return null;
      }
    } catch (error) {
      toast.error("Token inválido o expirado.");
      return null;
    }
  },


  // ==========================
  // VALIDAR ACCESO AL PAQUETE PARA USUARIOS CUANDO EL PSICOLOGO LES COMPARTE EL ACCESO
  // ==========================
  
  verifyUserPackageAccess: async (packageId) => {
    try {
      const user = useAuthStore.getState().user;
  
      if (!user || !user.purchasedTests) {
        toast.error("No tienes acceso a este paquete.");
        return false;
      }
  
      if (!user.purchasedTests.some(test => test.id === packageId)) {
        toast.error("No tienes acceso a este paquete.");
        return false;
      }
  
      const response = await axios.get(`/api/packages/${packageId}`, { withCredentials: true });
  
      if (response.data.success) {
        return true;
      } else {
        toast.error("No tienes acceso a este paquete.");
        return false;
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Acceso denegado.");
      } else {
        toast.error("Error al verificar el acceso al paquete.");
      }
      return false;
    }
  },  
  
  verifyPsychologistPackageAccess: async (packageId) => {
    try {
      const response = await axios.get(`/api/packages/${packageId}`, { withCredentials: true });
  
      if (response.data.success) {
        const user = useAuthStore.getState().user;
  
        if (
          user.role === "psychologist" &&
          (!user.purchasedAccesses || !user.purchasedAccesses.some(access => access.packageId === packageId))
        ) {
          toast.error("No tienes acceso a este paquete.");
          return false;
        }
  
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

}));
useAuthStore.getState().listenToSocketEvents();