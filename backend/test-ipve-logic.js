import mongoose from "mongoose";
import { Answer } from "./models/Sixteenpfanswers.model.js";
import { getCalculatedSixteenpfResults } from "./controllers/Sxiteenpfanswers.controller.js";
import fs from "fs";
import path from "path";

// Cargar las preguntas desde el JSON
const questions = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "sixteenpfquestions.json"), "utf-8"));

// Mock de la función Answer.find para simular datos de base de datos sin conectarse realmente
let mockAnswersData = [];
Answer.find = () => {
  return {
    populate: () => Promise.resolve(mockAnswersData)
  };
};

const runTest = async (testName, mockDataBuilder) => {
  console.log(`\n=== Ejecutando Test: ${testName} ===`);
  mockAnswersData = mockDataBuilder();

  const req = { userId: "user-test-123" };
  let responseData = null;
  
  const res = {
    status: (code) => {
      return {
        json: (data) => {
          responseData = { code, ...data };
        }
      };
    },
    json: (data) => {
      responseData = { code: 200, ...data };
    }
  };

  await getCalculatedSixteenpfResults(req, res);
  return responseData;
};

const main = async () => {
  try {
    // ----------------------------------------------------
    // TEST 1: Caso Neutro (Todas las opciones en neutral/cero)
    // ----------------------------------------------------
    const resNeutro = await runTest("Caso Neutro", () => {
      return questions.map((q, idx) => {
        const polo = q.tipo_pregunta.polo;
        return {
          question: q,
          selectedOption: "Ni de acuerdo ni en desacuerdo",
          score: 0,
          polo: polo,
          calculatedResult: 0
        };
      });
    });

    console.log("Resultado del Caso Neutro:");
    console.log(`Código de respuesta: ${resNeutro.code}`);
    let successNeutro = true;
    resNeutro.results.forEach(f => {
      console.log(`  Factor: ${f.factor} -> promedio: ${f.average}, pct: ${f.percentage}%, bipolar: ${f.bipolarGraphValue}`);
      if (f.percentage !== 50 || f.bipolarGraphValue !== 0) {
        successNeutro = false;
      }
    });
    console.log(`TEST Neutro: ${successNeutro ? "APROBADO (Todos los factores en 50% y bipolar 0)" : "FALLADO"}`);

    // ----------------------------------------------------
    // TEST 2: Caso Polo Bajo (Todas las respuestas se alinean al polo bajo, calculatedResult = -4)
    // ----------------------------------------------------
    const resPoloBajo = await runTest("Caso Polo Bajo", () => {
      return questions.map((q, idx) => {
        const polo = q.tipo_pregunta.polo;
        // Si polo es 1, queremos score = -4 para obtener calculatedResult = -4
        // Si polo es -1, queremos score = 4 para obtener calculatedResult = -4
        // Si polo es 0, calculatedResult = 0
        const score = polo === 1 ? -4 : (polo === -1 ? 4 : 0);
        const calculatedResult = score * polo;
        return {
          question: q,
          selectedOption: score === 4 ? "Totalmente de acuerdo" : "Totalmente en desacuerdo",
          score: score,
          polo: polo,
          calculatedResult: calculatedResult
        };
      });
    });

    console.log("Resultado del Caso Polo Bajo:");
    let successPoloBajo = true;
    resPoloBajo.results.forEach(f => {
      console.log(`  Factor: ${f.factor} -> promedio: ${f.average}, pct: ${f.percentage}%, bipolar: ${f.bipolarGraphValue}`);
      if (f.percentage !== 0 || f.bipolarGraphValue !== -12) {
        successPoloBajo = false;
      }
    });
    console.log(`TEST Polo Bajo: ${successPoloBajo ? "APROBADO (Todos los factores en 0% y bipolar -12)" : "FALLADO"}`);

    // ----------------------------------------------------
    // TEST 3: Caso Polo Alto (Todas las respuestas se alinean al polo alto, calculatedResult = 4)
    // ----------------------------------------------------
    const resPoloAlto = await runTest("Caso Polo Alto", () => {
      return questions.map((q, idx) => {
        const polo = q.tipo_pregunta.polo;
        // Si polo es 1, queremos score = 4 para obtener calculatedResult = 4
        // Si polo es -1, queremos score = -4 para obtener calculatedResult = 4
        // Si polo es 0, calculatedResult = 0
        const score = polo === 1 ? 4 : (polo === -1 ? -4 : 0);
        const calculatedResult = score * polo;
        return {
          question: q,
          selectedOption: score === 4 ? "Totalmente de acuerdo" : "Totalmente en desacuerdo",
          score: score,
          polo: polo,
          calculatedResult: calculatedResult
        };
      });
    });

    console.log("Resultado del Caso Polo Alto:");
    let successPoloAlto = true;
    resPoloAlto.results.forEach(f => {
      console.log(`  Factor: ${f.factor} -> promedio: ${f.average}, pct: ${f.percentage}%, bipolar: ${f.bipolarGraphValue}`);
      if (f.percentage !== 100 || f.bipolarGraphValue !== 12) {
        successPoloAlto = false;
      }
    });
    console.log(`TEST Polo Alto: ${successPoloAlto ? "APROBADO (Todos los factores en 100% y bipolar 12)" : "FALLADO"}`);

    // ----------------------------------------------------
    // TEST 4: Caso de Calidad de Respuesta (Calidad Extrema - Semáforo Rojo)
    // ----------------------------------------------------
    const resCalidadRoja = await runTest("Caso Calidad Roja", () => {
      return questions.map((q, idx) => {
        let score = 0;
        let selectedOption = "Ni de acuerdo ni en desacuerdo";
        
        // 1. Forzar deseabilidad social alta (todas >= 2, rate = 1.0 -> rojo)
        if (q.indice_respuesta === "deseabilidad_social") {
          score = 4;
          selectedOption = "Totalmente de acuerdo";
        }
        // 2. Forzar infrecuencia alta (todas >= 2, rate = 1.0 -> rojo)
        else if (q.indice_respuesta === "infrecuencia") {
          score = 4;
          selectedOption = "Totalmente de acuerdo";
        }
        // 3. Forzar fallas de atención (todas distintas, fails = 2 -> rojo)
        else if (q.indice_respuesta === "atencion") {
          score = -4;
          selectedOption = "Totalmente en desacuerdo"; // Esperado es "De acuerdo" o "En desacuerdo"
        }
        // 4. Forzar inconsistencias en los consistency_pair_id
        // Si hay un par, el primero dará calculatedResult = 4, el segundo -4 (diff = 8 >= 6) -> rojo
        else if (q.consistency_pair_id) {
          const isEven = idx % 2 === 0;
          score = isEven ? 4 : -4;
          selectedOption = isEven ? "Totalmente de acuerdo" : "Totalmente en desacuerdo";
        }
        // 5. Patrón mecánico (más de 12 seguidas de la misma respuesta)
        else {
          score = 4;
          selectedOption = "Totalmente de acuerdo";
        }

        return {
          question: q,
          selectedOption,
          score,
          polo: q.tipo_pregunta.polo,
          calculatedResult: score * q.tipo_pregunta.polo
        };
      });
    });

    console.log("Resultado del Caso Calidad Roja:");
    console.log("responseQuality:", JSON.stringify(resCalidadRoja.responseQuality, null, 2));
    
    const globalQuality = resCalidadRoja.responseQuality.global;
    console.log(`  Banderas Totales: ${globalQuality.flags}, Nivel: ${globalQuality.level}`);
    if (globalQuality.level === "rojo") {
      console.log("TEST Calidad de Respuesta: APROBADO (Se obtuvo nivel rojo ante respuestas inconsistentes e inválidas)");
    } else {
      console.log("TEST Calidad de Respuesta: FALLADO");
    }

  } catch (err) {
    console.error("Error ejecutando los tests:", err);
  }
};

main();
