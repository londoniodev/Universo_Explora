import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const OpcionRespuestaSchema = new Schema({
    texto: { 
        type: String, 
        required: [true, 'El texto de la opción de respuesta es obligatorio.'], 
        trim: true,
        minlength: [1, 'El texto debe tener al menos 1 carácter.'],
        maxlength: [300, 'El texto no debe exceder los 300 caracteres.']
    },
    puntuacion: { 
        type: Number, 
        required: [true, 'La puntuación es obligatoria.'],
        min: [-4, 'La puntuación mínima es -4.'], 
        max: [4, 'La puntuación máxima es 4.'] 
    }
});

const TipoPreguntaSchema = new Schema({
    polo: { 
        type: Number, 
        required: [true, 'El campo polo es obligatorio.'],
        enum: {
            values: [-1, 0, 1], 
            message: 'El valor de polo debe ser -1, 0 o 1.'
        }
    }
});

const QuestionSchema = new Schema({
    pregunta: { 
        type: String, 
        required: [true, 'La pregunta es obligatoria.'], 
        trim: true, 
        minlength: [5, 'La pregunta debe tener al menos 5 caracteres.'], 
        maxlength: [500, 'La pregunta no debe exceder los 500 caracteres.']
    },
    factor: { 
        type: String, 
        required: [true, 'El factor es obligatorio.'], 
        trim: true, 
        minlength: [1, 'El factor debe tener al menos 1 carácter.'],
        maxlength: [100, 'El factor no debe exceder los 100 caracteres.']
    },
    factor_codigo: {
        type: String,
        trim: true,
        maxlength: [10, 'El código de factor no debe exceder los 10 caracteres.']
    },
    opciones_respuesta: { 
        type: [OpcionRespuestaSchema], 
        required: [true, 'Debe haber al menos una opción de respuesta.'], 
        validate: {
            validator: (val) => val.length > 0,
            message: 'El arreglo de opciones_respuesta no puede estar vacío.'
        }
    },
    tipo_pregunta: { 
        type: TipoPreguntaSchema, 
        required: [true, 'El tipo de pregunta es obligatorio.']
    },
    se_calcula_en_factor: {
        type: Boolean,
        default: true
    },
    categoria: {
        type: String,
        enum: {
            values: ['rasgo', 'control', 'estilo_respuesta', 'atencion'],
            message: 'La categoría debe ser "rasgo", "control", "estilo_respuesta" o "atencion".'
        },
        default: 'rasgo'
    },
    indice_respuesta: {
        type: String,
        enum: {
            values: ['deseabilidad_social', 'infrecuencia', 'atencion', 'aquiescencia', 'ninguno'],
            message: 'El índice de respuesta no es válido.'
        },
        default: 'ninguno'
    },
    consistency_pair_id: {
        type: String,
        trim: true
    },
    attention_expected_response: {
        type: String,
        trim: true
    },
    orden_aplicacion: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índice para ordenar preguntas por orden de aplicación
QuestionSchema.index({ orden_aplicacion: 1 });

// Índice para consultas rápidas de preguntas activas
QuestionSchema.index({ isActive: 1 });

const Question = model('Question', QuestionSchema);

export default Question;