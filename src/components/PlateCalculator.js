import { useState, useEffect } from 'react';

const KG_plates = [25, 20, 15, 10, 5, 2.5, 1.25];
const LBS_plates = [45, 35, 25, 10, 5, 2.5];

const getColorKg = (w) => {
  if (w >= 25) return "bg-red-600";
  if (w >= 20) return "bg-blue-600";
  if (w >= 15) return "bg-yellow-500";
  if (w >= 10) return "bg-green-600";
  if (w >= 5) return "bg-gray-500";
  if (w >= 2.5) return "bg-black";
  return "bg-gray-300";
};

const getColorLbs = (w) => {
  if (w >= 45) return "bg-red-600";
  if (w >= 35) return "bg-blue-600";
  if (w >= 25) return "bg-yellow-500";
  if (w >= 10) return "bg-green-600";
  if (w >= 5) return "bg-gray-500";
  if (w >= 2.5) return "bg-black";
  return "bg-gray-300";
};

const getSizeKg = (w) => {
  if (w >= 25) return "h-16 w-3 md:w-4";
  if (w >= 20) return "h-14 w-3 md:w-4";
  if (w >= 15) return "h-12 w-2 md:w-3";
  if (w >= 10) return "h-11 w-2 md:w-3";
  if (w >= 5) return "h-10 w-2 md:w-3";
  if (w >= 2.5) return "h-8 w-[6px] md:w-2";
  return "h-5 w-1 md:w-2";
};

const getSizeLbs = (w) => {
  if (w >= 45) return "h-16 w-3 md:w-4";
  if (w >= 35) return "h-14 w-3 md:w-4";
  if (w >= 25) return "h-12 w-2 md:w-3";
  if (w >= 10) return "h-11 w-2 md:w-3";
  if (w >= 5) return "h-10 w-2 md:w-3";
  if (w >= 2.5) return "h-8 w-[6px] md:w-2";
  return "h-5 w-1 md:w-2";
};

const calculatePlates = (target, barWeight, plates) => {
  let weightEachSide = (target - barWeight) / 2;
  const sorted = [...plates].sort((a, b) => b - a);
  const result = [];
  for (let plate of sorted) {
    while (weightEachSide >= plate) {
      result.push(plate);
      weightEachSide -= plate;
    }
  }
  const totalUsed = result.reduce((a, b) => a + b, 0) * 2 + barWeight;
  return { success: totalUsed === target, result, totalUsed };
}

const PlateCalculator = () => {
  const [unit, setUnit] = useState("kg");
  const [targetWeight, setTargetWeight] = useState(100);
  const [barWeight, setBarWeight] = useState(20);
  const [availablePlates, setAvailablePlates] = useState([]);
  const [customPlate, setCustomPlate] = useState("");
  const [plateResult, setPlateResult] = useState([]);
  const [calcStatus, setCalcStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    const plates = unit === "kg" ? KG_plates : LBS_plates;
    const plateObjs = plates.map((p) => ({ weight: p, selected: true }));
    setAvailablePlates(plateObjs);
  }, [unit])

  const togglePlate = (weight) => {
    setAvailablePlates((prev) =>
      prev.map((p) =>
      p.weight === weight ? { ...p, selected: !p.selected } : p
      ));
  };

  const addCustomPlate = () => {
    const val = parseFloat(customPlate);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    if (availablePlates.find((p) => p.weight === val)) return;
    setAvailablePlates([...availablePlates, { weight: val, selected: true }]);
    setCustomPlate("");
  }

  const calculate = () => {
    const selected = availablePlates
      .filter((p) => p.selected)
      .map((p) => p.weight);

    const { success, result, totalUsed } = calculatePlates(
      parseFloat(targetWeight),
      parseFloat(barWeight),
      selected
    );
    setPlateResult(result);
    setCalcStatus({ success, totalUsed });
  };

  const groupedPlates = [...plateResult]
  .sort((a, b) => b - a)
  .reduce((acc, weight) => {
    const existing = acc.find((item) => item.weight === weight);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ weight, count: 1 });
    }
    return acc;
  }, []);

  const getColor = unit === "kg" ? getColorKg : getColorLbs;
  const getSize = unit === "kg" ? getSizeKg : getSizeLbs;

  return (
    <>
      {isVisible ? (
        <div className="relative right-9 md:right-0 flex flex-col gap-4 max-w-xl bg-gray-800 rounded-lg mx-5 p-4">
          <button
              onClick={toggleVisibility}
              className="absolute top-2 right-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-600 transition"
          >
            <span className="relative bottom-1 text-4xl px-3">-</span>
          </button>
          <h2 className="text-xl font-bold">Plate Calculator</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm">Target Weight</label>
                <input
                  type="number"
                  className="text-black w-24 border px-2 py-1 text-sm md:text-base  border-gray-300
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Unit</label>
                <select
                  className="text-black min-w-16 border px-2 py-1 text-sm md:text-base  border-gray-300
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Bar Weight</label>
              <input
                type="number"
                className="text-black w-20 border px-2 py-1 text-sm md:text-base  border-gray-300
                rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
                value={barWeight}
                onChange={(e) => setBarWeight(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Select Not Available Plates</label>
            <div className="flex flex-wrap gap-2">
              {availablePlates.map((p, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    p.selected ? "bg-blue-500 text-white" : "bg-gray-600"
                  }`}
                  onClick={() => togglePlate(p.weight)}
                >
                  {p.weight} {unit}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm">Add plates</label>
              <div className="flex flex-wrap gap-4">
                <input
                  type="number"
                  className="text-black border rounded px-2 py-1 w-20"
                  value={customPlate}
                  onChange={(e) => setCustomPlate(e.target.value)}
                  placeholder="7.5"
                />
                <button
                  onClick={addCustomPlate}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
                <button
                  onClick={calculate}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>
          {plateResult.length > 0 && (
            <div className="relative flex flex-col w-auto gap-2">
              <h3 className="font-semibold">Barbell Setup:</h3>
              <div className="relative right-9 sm:right-0 flex justify-center h-24 scale-75 md:scale-100 bg-gray-100 rounded p-2 max-w-full">
                {[...plateResult].reverse().map((p, i) => (
                    <div
                      key={i}
                      className={`${getColor(p)} ${getSize(p)} mx-[1px] my-auto rounded-sm`}
                      title={`${p} ${unit}`}
                    ></div>
                  ))}
                <div className="w-20 md:w-32 bg-black my-auto h-2"></div>
                {plateResult.map((p, i) => (
                  <div
                    key={i}
                    className={`${getColor(p)} ${getSize(p)} my-auto hover:${p} mx-[1px]  rounded-sm`}
                    title={`${p} ${unit}`}
                  ></div>
                ))}
              </div>
              <p className="text-sm">
                Total: {calcStatus.totalUsed} {unit} {calcStatus.success ? "✅" : "⚠️ Not exact match"}
              </p>
              <p className="text-sm">
                Per side:
                {groupedPlates
                  .map(({ weight, count }) => ` ${weight} ${unit} × ${count}`)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={toggleVisibility}
          className="bg-gray-800 dark:bg-gray-600 text-white rounded-xl p-2 shadow hover:bg-gray-700 transition"
        >
          <span className="material-icons text-3xl">fitness_center</span>
        </button>
      )}
    </>
  );
};

export default PlateCalculator;
