import { Client } from "@gradio/client";

// Replace with your actual Space name (username/space-name)
const SPACE_ID = import.meta.env.VITE_SPACE_ID; 

export const predictObesity = async (formData) => {
  try {
    // Connect to the Hugging Face Space
    const app = await Client.connect(SPACE_ID);

    // The order of these values MUST match the order in your Python 'predict_obesity' function exactly.
    // We assume 'formData' is an object with keys matching your conceptual inputs.
    const result = await app.predict("/predict_obesity", [ 
      formData.gender,          // "Female" or "Male"
      parseFloat(formData.age), // Number
      parseFloat(formData.height),
      parseFloat(formData.weight),
      formData.family_history,  // "yes" or "no"
      formData.favc,            // "yes" or "no"
      parseFloat(formData.fcvc),
      parseFloat(formData.ncp),
      formData.caec,            // "no", "Sometimes", "Frequently", "Always"
      formData.smoke,           // "yes" or "no"
      parseFloat(formData.ch2o),
      formData.scc,             // "yes" or "no"
      parseFloat(formData.faf),
      parseFloat(formData.tue),
      formData.calc,            // "no", "Sometimes", "Frequently", "Always"
      formData.mtrans           // "Public_Transportation", "Walking", etc.
    ]);

    return result.data[0]; // The prediction string
  } catch (error) {
    console.error("Error predicting obesity:", error);
    throw error;
  }
};