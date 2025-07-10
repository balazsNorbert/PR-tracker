import React from 'react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 'how-to-avoid-workout-plateaus',
    title: 'How to Avoid Workout Plateaus and Keep Progressing',
    excerpt: 'Discover proven techniques to break through plateaus and continually improve your fitness.',
  },
  {
    id: 'why-track-your-nutrition',
    title: 'Why Track Your Nutrition? The Key to Better Results',
    excerpt: 'Learn why monitoring your nutrition is essential and how it can transform your fitness journey.',
  },
  {
    id: 'why-track-your-workouts',
    title: 'Why Track Your Workouts? Maximize Your Training Efficiency',
    excerpt: 'Understand the benefits of tracking your workouts and how it helps you reach your fitness goals faster.',
  },
  {
    id: 'how-to-stay-consistent-working-out',
    title: 'How to Stay Consistent with Working Out',
    excerpt: 'Struggling to stay motivated? Learn practical strategies to build consistency and make fitness a lasting habit.',
  },
  {
    id: 'how-to-warm-up-before-workout',
    title: 'How to Warm Up Before Your Workout for Better Performance',
    excerpt: 'Learn effective warm-up routines to prepare your body, prevent injuries, and boost workout results.',
  },
  {
    id: 'how-much-protein-you-need',
    title: 'How Much Protein Do You Need Per Day? A Complete Guide',
    excerpt: 'Learn how much protein you need each day based on your goals, body type, and activity level. Find the ideal amount for building muscle, losing fat, and staying healthy.',
  },
  {
    id: 'what-to-eat-before-workout',
    title: 'What to Eat Before a Workout to Boost Energy and Performance',
    excerpt: 'Discover what to eat before your workout to fuel your body, boost endurance, and improve performance. Learn the best foods and timing strategies for effective training.'
  },
  {
    id: 'what-to-eat-after-workout',
    title: 'What to Eat After a Workout to Boost Recovery and Muscle Growth',
    excerpt: 'Discover the best foods to eat after your workout to speed up recovery, promote muscle growth, and replenish energy. Learn how proper nutrition post-exercise makes a difference.'
  },
  {
    id: 'why-you-are-not-building-muscle',
    title: "Why You're Not Building Muscle — 6 Mistakes to Fix Now",
    excerpt: 'Struggling to gain muscle? Learn the six common mistakes that may be holding you back and how to fix them to finally see the results you want.'
  },
  {
    id: 'how-long-should-your-workouts-be',
    title: 'How Long Should Your Workouts Be for Best Results?',
    excerpt: 'Find out the ideal workout duration based on your fitness goals. Learn how to optimize your time for muscle gain, fat loss, or overall health.'
  },
  {
    id: 'how-many-days-a-week-should-you-workout',
    title: 'How Many Days a Week Should You Work Out for Best Results?',
    excerpt: 'Learn how many days a week you should work out based on your fitness level and goals. Discover optimal training frequencies for muscle growth, fat loss, and general health.'
  },
  {
    id: 'should-you-workout-every-day',
    title: 'Should You Work Out Every Day? Pros, Cons & Expert Tips',
    excerpt: 'Is working out every day a good idea? Discover the benefits and downsides of daily training, and how to do it safely without risking injury or burnout.',
  },
  {
    id: 'how-long-should-you-rest-between-sets',
    title: 'How Long Should You Rest Between Sets for Optimal Results?',
    excerpt: 'Discover the ideal rest periods between sets to maximize muscle growth, strength, and endurance. Learn how rest time affects your workout performance.'
  },
  {
    id: 'should-you-do-cardio-before-or-after-weights',
    title: 'Should You Do Cardio Before or After Weights? Expert Advice',
    excerpt: 'Learn whether you should do cardio before or after weight training for fat loss, muscle gain, and optimal performance. Discover expert tips and timing strategies.',
  },
  {
    id: 'what-is-progressive-overload',
    title: 'What Is Progressive Overload and Why Is It Important?',
    excerpt: 'Learn what progressive overload means in strength training, why it’s essential for building muscle and improving performance, and how to apply it safely.'
  },
  {
    id: 'best-time-to-workout',
    title: 'Best Time to Workout for Maximum Results',
    excerpt: 'Find out when is the best time to work out for better performance, faster recovery, and maximum muscle growth based on science and your lifestyle.'
  },
  {
    id: 'should-you-train-to-failure-every-set',
    title: 'Should You Train to Failure Every Set?',
    excerpt: 'Discover when training to failure is effective, its benefits and drawbacks, and how often you should push sets to failure for optimal muscle growth and recovery.'
  },
  {
    id: 'can-you-lose-fat-and-gain-muscle',
    title: 'Can You Lose Fat and Build Muscle at the Same Time?',
    excerpt: 'Find out if it’s really possible to lose fat and gain muscle at once. Learn how body recomposition works, plus tips for training, diet, and recovery.'
  }
];

const Tips = () =>{
  return (
    <>
      <head>
        <meta name="robots" content="index, follow" />
        <title>Fitness & Nutrition Tips to Boost Your Workout</title>
        <meta name="description" content="Explore our best workout and nutrition tips to overcome plateaus, stay motivated, and reach your fitness goals faster with proven strategies and expert advice." />
        <link rel="canonical" href="https://workoutracker.com/tips" />
      </head>
      <div className="min-h-screen mx-5">
        <div className="flex flex-col items-center gap-10 my-10 mx-auto p-5 md:px-10 bg-white rounded-lg shadow-lg max-w-2xl lg:max-w-3xl">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-teal-700 text-center">Fitness & Nutrition Tips</h1>
          <div className="flex flex-col gap-6 w-full">
            {blogPosts.map(({ id, title, excerpt }) => (
              <div
                key={id}
                className="flex flex-col gap-2 border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md bg-gray-100 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <h2 className="text-base md:text-lg xl:text-xl font-semibold text-teal-600">{title}</h2>
                <p className="text-sm md:text-base xl:text-lg text-gray-700 mb-1">{excerpt}</p>
                <Link
                  to={`/tips/${id}`}
                  className="text-teal-500 hover:underline font-medium w-fit"
                >
                  ➤ Read more
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Tips;