import React from 'react';
import { Link } from 'react-router-dom';

const HowMuchProteinYouNeed = () => {
  return (
    <>
      <head>
        <meta name="robots" content="index, follow" />
        <title>How Much Protein Does Your Body Really Need?</title>
        <meta name="description" content="Learn how much protein you need a day to build muscle, lose fat, or stay healthy. Find the right daily intake based on your fitness goals and lifestyle." />
        <link rel="canonical" href="https://workoutracker.com/tips/how-much-protein-you-need" />
      </head>
      <div className="min-h-screen mx-5">
        <div className="flex flex-col items-center gap-10 w-full my-10 mx-auto p-5 md:px-10 bg-white rounded-xl shadow-lg max-w-2xl lg:max-w-3xl">
          <h1 className="text-xl md:text-2xl xl:text-3xl font-bold text-teal-700 text-center">
            How Much Protein Do You Need Per Day?
          </h1>
          <div className="flex flex-col gap-4 text-gray-700 max-w-none">
            <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">Why Protein Matters</h2>
            <p>
              Getting enough protein is essential for building and maintaining muscle, boosting recovery, and staying healthy overall. Protein supports tissue repair, hormone production, and your immune system. Unlike carbs or fat, your body can't store extra protein, so your daily intake really counts.
            </p>
            <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">How Much Protein Do You Really Need?</h2>
            <p>
              Your ideal daily protein intake depends on your weight, goals, and activity level. Use the general guidelines below as a starting point:
            </p>
            <ul className="list-disc list-inside">
              <li><span className="font-semibold">Sedentary adults:</span> ~0.8g per kg of body weight</li>
              <li><span className="font-semibold">Active lifestyle:</span> 1.2-2.0g/kg</li>
              <li><span className="font-semibold">Building muscle:</span> 1.6-2.2g/kg (~0.7-1g per lb)</li>
              <li><span className="font-semibold">Fat loss (while training):</span> 2.0-2.4g/kg to maintain muscle</li>
              <li><span className="font-semibold">Athletes:</span> 2.0-2.5g/kg depending on sport intensity</li>
            </ul>
            <h3 className="text-base md:text-lg xl:text-xl text-teal-600">Quick Example</h3>
            <p>
              If you weigh 80kg (176 lbs) and your goal is muscle growth:
              <br />
              <span className="font-semibold">80kg x 2g = 160g protein daily</span>.
              Divide that into 4 meals: 40g per meal.
            </p>
            <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">Simple Protein Sources</h2>
            <p>
              Focus on whole foods first. Here are some great options:
            </p>
            <ul className="list-disc list-inside">
              <li>Lean meats: chicken, turkey, beef</li>
              <li>Fish & seafood: salmon, tuna, shrimp</li>
              <li>Eggs and dairy: eggs, Greek yogurt, cottage cheese</li>
              <li>Protein powders: whey, casein, plant-based</li>
              <li>Plant-based: lentils, beans, tofu, tempeh, quinoa, chickpeas</li>
            </ul>
            <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">When Should You Eat Protein?</h2>
            <p>
              Aim to spread protein evenly throughout the day — around 20-40g every 3-4 hours. This supports muscle repair and prevents long gaps that can lead to muscle breakdown.
            </p>
            <p>
              Not sure what to eat? Check out our tips on <Link to="/tips/what-to-eat-before-workout" className="font-bold text-teal-800 hover:underline"> what to eat before a workout</Link> and
              <Link to="/tips/what-to-eat-after-workout" className="font-bold text-teal-800 hover:underline"> what to eat after a workout</Link> to fuel your training and recovery.
            </p>
            <p>
              Include protein in breakfast, lunch, dinner, and snacks. A high-protein meal after training is especially effective.
            </p>
            <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">Protein and Hydration</h2>
            <p>
              Higher protein intakes slightly increase your body's water needs. Stay hydrated to support digestion, kidney health, and muscle function. A good rule of thumb: drink at least 2-3 liters of water daily.
            </p>
            <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">Protein Myths — Busted</h2>
            <ul className="list-disc list-inside">
              <li><span className="font-semibold">Myth:</span> “You can't absorb more than 30g at once.” → False! You absorb it all — larger amounts just digest more slowly.</li>
              <li><span className="font-semibold">Myth:</span> “High protein damages your kidneys.” → False! There's no evidence of harm in healthy people.</li>
              <li><span className="font-semibold">Myth:</span> “Protein is only for bodybuilders.” → Nope! Everyone benefits — for better recovery, strength, and staying lean.</li>
            </ul>
            <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">Key Takeaway</h2>
            <p>
              Dial in your daily protein based on your goal — more if you're lifting heavy or cutting fat, less if you're just staying active. Track your intake for a few days to see where you stand, then adjust. And remember: real food first, supplements second.
            </p>
            <p>
              Consistency beats perfection — keep your diet balanced, stay hydrated, and enjoy the results.
            </p>
          </div>
          <div className="flex justify-between items-center w-full text-sm md:text-base">
            <Link to="/tips/how-to-warm-up-before-workout" className="text-teal-500 hover:underline">
              ← Previous Tip
            </Link>
            <Link to="/tips/what-to-eat-before-workout" className="text-teal-500 hover:underline">
              Next Tip →
            </Link>
          </div>
          <div className="relative bottom-2 flex flex-col items-center justify-center text-center text-sm md:text-base gap-2">
            <p className="text-gray-700 font-medium">
              Want to optimize your nutrition and training?
            </p>
            <Link to="/" className="bg-teal-600 text-white font-semibold px-4 py-1 rounded-full hover:bg-teal-700 transition-colors text-center">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowMuchProteinYouNeed;
