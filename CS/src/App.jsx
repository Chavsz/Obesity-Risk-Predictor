import { useMemo, useState } from "react";
import { predictObesity } from "./api/api";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // Format the result to replace underscores with spaces
      const formattedResult = result
        .replace(/_/g, ' ')
        .replace(/Level I/g, 'Level I')
        .replace(/Level II/g, 'Level II')
        .replace(/Type I/g, 'Type I')
        .replace(/Type II/g, 'Type II')
        .replace(/Type III/g, 'Type III');
      setPrediction(formattedResult);
    } catch (err) {
      alert("Prediction failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const allFields = useMemo(
    () => [
      { name: "gender", label: "Gender", type: "select", options: ["Female", "Male"] },
      { name: "age", label: "Age", type: "number", min: 0, step: 1 },
      { name: "height", label: "Height (m)", type: "number", min: 0, step: 0.01 },
      { name: "weight", label: "Weight (kg)", type: "number", min: 0, step: 0.1 },
      { name: "family_history", label: "Family History", type: "select", options: ["yes", "no"] },
      { name: "favc", label: "High Caloric Food", type: "select", options: ["yes", "no"] },
      { name: "caec", label: "Snacking", type: "select", options: ["no", "Sometimes", "Frequently", "Always"] },
      { name: "calc", label: "Alcohol", type: "select", options: ["no", "Sometimes", "Frequently", "Always"] },
      { name: "smoke", label: "Smoke", type: "select", options: ["no", "yes"] },
      { name: "mtrans", label: "Transport", type: "select", options: ["Public_Transportation", "Walking", "Automobile", "Bike", "Motorbike"] },
      { name: "fcvc", label: "Vegetables", type: "number", min: 1, max: 3, step: 0.1 },
      { name: "ncp", label: "Meals/Day", type: "number", min: 1, max: 4, step: 0.1 },
      { name: "ch2o", label: "Water", type: "number", min: 0, max: 3, step: 0.1 },
      { name: "scc", label: "Calorie Monitor", type: "select", options: ["no", "yes"] },
      { name: "faf", label: "Activity", type: "number", min: 0, max: 3, step: 0.1 },
      { name: "tue", label: "Screen Time", type: "number", min: 0, max: 2, step: 0.1 },
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
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option.replace(/_/g, ' ')}
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
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    );
  };

  const getColorClasses = (result) => {
    if (!result) return null;
    if (result.includes('Normal')) {
      return {
        glow: 'bg-emerald-400/20',
        icon: 'text-emerald-500',
        gradient: 'from-emerald-400 to-emerald-600',
        shadow: 'shadow-emerald-500/40',
        text: 'text-emerald-600',
        bg: 'from-emerald-50/50',
        bullet: 'text-emerald-600'
      };
    }
    if (result.includes('Overweight')) {
      return {
        glow: 'bg-amber-400/20',
        icon: 'text-amber-500',
        gradient: 'from-amber-400 to-amber-600',
        shadow: 'shadow-amber-500/40',
        text: 'text-amber-600',
        bg: 'from-amber-50/50',
        bullet: 'text-amber-600'
      };
    }
    return {
      glow: 'bg-red-400/20',
      icon: 'text-red-500',
      gradient: 'from-red-400 to-red-600',
      shadow: 'shadow-red-500/40',
      text: 'text-red-600',
      bg: 'from-red-50/50',
      bullet: 'text-red-600'
    };
  };

  const colorClasses = getColorClasses(prediction);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100" style={{ fontFamily: "'Gabarito', sans-serif" }}>
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-blob rounded-full bg-blue-400/20 mix-blend-multiply blur-3xl filter"></div>
        <div className="animation-delay-2000 absolute -right-20 top-0 h-96 w-96 animate-blob rounded-full bg-indigo-400/20 mix-blend-multiply blur-3xl filter"></div>
        <div className="animation-delay-4000 absolute -bottom-20 left-1/3 h-96 w-96 animate-blob rounded-full bg-blue-300/20 mix-blend-multiply blur-3xl filter"></div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700;800;900&display=swap');
          
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          .animate-blob {
            animation: blob 20s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          ::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #2563eb;
          }
        `}
      </style>

      <div className="relative flex min-h-screen">
        {/* Left sidebar - Input controls */}
        <div className="w-80 border-r border-slate-200/60 bg-white/60 backdrop-blur-md">
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Header */}
            <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-transparent p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-500/30">
                AI
              </div>
              <h1 className="text-xl font-bold text-slate-900">Obesity Risk</h1>
              <p className="mt-1 text-xs text-slate-600">Configure parameters</p>
            </div>

            {/* Scrollable inputs */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {allFields.map((field) => (
                  <label key={field.name} className="block text-xs font-medium text-slate-700">
                    {field.label}
                    {renderField(field)}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="border-t border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-transparent p-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:from-blue-300 disabled:to-blue-400 disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Risk"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Large result display */}
        <div className="flex flex-1 items-center justify-center p-12">
          {prediction ? (
            <div className="relative w-full max-w-3xl">
              {/* Glow effect behind result */}
              <div className={`absolute inset-0 -m-12 animate-pulse-glow rounded-full ${colorClasses.glow} blur-3xl`}></div>
              
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 shadow-2xl backdrop-blur-sm">
                {/* Result header */}
                <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-transparent px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Classification Result</p>
                      <p className="mt-1 text-xs text-slate-400">Based on 16 health parameters</p>
                    </div>
                    <svg className={`h-8 w-8 ${colorClasses.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                {/* Large result display */}
                <div className="px-8 py-16 text-center">
                  <div className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${colorClasses.gradient} shadow-xl ${colorClasses.shadow}`}>
                    <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <h2 className={`mb-4 text-6xl tracking-tight ${colorClasses.text}`} style={{ fontWeight: 900 }}>
                    {prediction}
                  </h2>
                  
                  <p className="mx-auto max-w-md text-sm text-slate-600">
                    {prediction.includes('Normal') && "Your health metrics indicate a healthy weight range. Maintain your current lifestyle habits."}
                    {prediction.includes('Overweight') && "Your metrics suggest elevated weight levels. Consider lifestyle modifications for better health."}
                    {prediction.includes('Obesity') && "Your results indicate significant health concerns. Professional consultation is recommended."}
                  </p>

                  {/* Stats bar */}
                  <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{inputs.age}</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Age</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{(inputs.weight / (inputs.height * inputs.height)).toFixed(1)}</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">BMI</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{inputs.weight}kg</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Weight</p>
                    </div>
                  </div>
                </div>

                {/* Bottom tips */}
                <div className={`border-t border-slate-200/60 bg-gradient-to-br ${colorClasses.bg} to-transparent px-8 py-6`}>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">💡 Recommendations</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className={`mt-0.5 ${colorClasses.bullet}`}>•</span>
                      <span>Consult healthcare professionals for personalized advice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`mt-0.5 ${colorClasses.bullet}`}>•</span>
                      <span>Regular physical activity and balanced nutrition are key</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`mt-0.5 ${colorClasses.bullet}`}>•</span>
                      <span>Monitor your metrics regularly for best results</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                <svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="mb-3 text-4xl font-bold text-slate-900">Ready to Analyze</h2>
              <p className="mx-auto max-w-md text-lg text-slate-600">
                Configure your health parameters on the left panel and click "Analyze Risk" to see your obesity risk assessment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;