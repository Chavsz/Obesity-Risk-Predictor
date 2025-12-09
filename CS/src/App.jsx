import { useMemo, useState } from "react";
import { predictObesity } from "./api/api";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for form inputs (initialize with sensible defaults)
  const [inputs, setInputs] = useState({
    gender: "Female",
    age: 25,
    height: 1.7,
    weight: 70,
    family_history: "yes",
    favc: "yes",
    fcvc: 2,
    ncp: 3,
    caec: "Sometimes",
    smoke: "no",
    ch2o: 2,
    scc: "no",
    faf: 1,
    tue: 1,
    calc: "Sometimes",
    mtrans: "Public_Transportation",
  });

  const numericFields = new Set([
    "age",
    "height",
    "weight",
    "fcvc",
    "ncp",
    "ch2o",
    "faf",
    "tue",
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = numericFields.has(name) ? parseFloat(value) || 0 : value;
    setInputs((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await predictObesity(inputs);
      setPrediction(result);
    } catch (err) {
      alert("Prediction failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const cards = useMemo(
    () => [
      {
        title: "Basics",
        fields: [
          { name: "gender", label: "Gender", type: "select", options: ["Female", "Male"] },
          { name: "age", label: "Age", type: "number", min: 0, step: 1 },
          { name: "height", label: "Height (m)", type: "number", min: 0, step: 0.01 },
          { name: "weight", label: "Weight (kg)", type: "number", min: 0, step: 0.1 },
        ],
      },
      {
        title: "Habits",
        fields: [
          { name: "family_history", label: "Family History of Overweight", type: "select", options: ["yes", "no"] },
          { name: "favc", label: "Frequent High Caloric Food", type: "select", options: ["yes", "no"] },
          { name: "caec", label: "Snacking", type: "select", options: ["no", "Sometimes", "Frequently", "Always"] },
          { name: "calc", label: "Alcohol Consumption", type: "select", options: ["no", "Sometimes", "Frequently", "Always"] },
          { name: "smoke", label: "Do you smoke?", type: "select", options: ["no", "yes"] },
          {
            name: "mtrans",
            label: "Transportation Mode",
            type: "select",
            options: ["Public_Transportation", "Walking", "Automobile", "Bike", "Motorbike"],
          },
        ],
      },
      {
        title: "Nutrition",
        fields: [
          { name: "fcvc", label: "Vegetable Intake (1-3)", type: "number", min: 1, max: 3, step: 0.1 },
          { name: "ncp", label: "Main Meals per Day", type: "number", min: 1, max: 4, step: 0.1 },
          { name: "ch2o", label: "Water Intake", type: "number", min: 0, max: 3,step: 0.1 },
          { name: "scc", label: "Calories Monitoring", type: "select", options: ["no", "yes"] },
        ],
      },
      {
        title: "Activity",
        fields: [
          { name: "faf", label: "Physical Activity (1-3)", type: "number", min: 0, max: 3,step: 0.1 },
          { name: "tue", label: "Screen Time (1-2)", type: "number", min: 0,max: 2,step: 0.1 },
        ],
      },
    ],
    []
  );

  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <select
          name={field.name}
          value={inputs[field.name]}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="number"
        name={field.name}
        min={field.min}
        max={field.max}
        step={field.step}
        value={inputs[field.name]}
        onChange={handleChange}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl font-semibold text-blue-600 shadow-sm">
            AI
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Obesity Risk Predictor</h1>
          <p className="text-sm text-slate-600">
            Enter lifestyle and health details to get an instant obesity risk prediction powered by the ML model.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="grid gap-4">
              {cards.map((card) => (
                <div key={card.title} className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
                    <div className="ml-3 h-px flex-1 bg-gradient-to-r from-blue-100 via-slate-100 to-transparent" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {card.fields.map((field) => (
                      <label key={field.name} className="block text-sm font-medium text-slate-700">
                        {field.label}
                        {renderField(field)}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ready to predict?</p>
                  <p className="text-xs text-slate-600">Your data is sent securely to the model.</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {loading ? "Predicting..." : "Get Result"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Prediction</h3>
              <p className="mt-2 text-sm text-slate-600">
                We use your inputs to call the hosted Hugging Face Space and return the predicted obesity risk category.
              </p>
              {prediction ? (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-emerald-800">
                  <p className="text-sm font-semibold">Result: {prediction}</p>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-slate-600">
                  <p className="text-sm">Submit the form to see your result.</p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Tips for accuracy</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>Use your most recent measurements.</li>
                <li>Approximate decimals for height and water intake.</li>
                <li>Adjust values to explore different lifestyle scenarios.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;