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
        min: [1, 'La puntuación mínima es 1.'], 
        max: [5, 'La puntuación máxima es 5.'] 
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
        minlength: [2, 'El factor debe tener al menos 2 caracteres.'],
        maxlength: [100, 'El factor no debe exceder los 100 caracteres.']
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
    }
}, {
    timestamps: true
});

const Question = model('Question', QuestionSchema);

export default Question;