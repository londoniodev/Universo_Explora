import Question from "../models/Sixtenpfquestion.model.js";

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().select(
      "pregunta factor opciones_respuesta tipo_pregunta.polo"
    );

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron preguntas en la base de datos.",
      });
    }

    const formattedQuestions = questions.map((question) => ({
      id: question._id,
      pregunta: question.pregunta || "Pregunta no disponible",
      factor: question.factor || "Factor no disponible",
      opciones_respuesta: (question.opciones_respuesta || []).map((opcion) => ({
        texto: opcion.texto || "Opción no disponible",
        puntuacion: opcion.puntuacion || 0,
      })),
      polo: question.tipo_pregunta?.polo || 0,
    }));

    res.status(200).json({
      success: true,
      questions: formattedQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las preguntas.",
    });
  }
};
