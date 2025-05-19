/* eslint-disable react/jsx-no-target-blank */
import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay, Navigation, Thumbs } from 'swiper/modules';
import Pricing from './Pricing';

function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeIndex, setActiveIndex] = useState(0);
  const images = {
    mobile: [
      { src: "/images/addExercise.webp", alt: "Add a new exercise to your workout log", description: "Log new exercises" },
      { src: "/images/PrNotification.webp", alt: "Personal record (PR) notification for workout progress", description: "Get PR alerts" },
      { src: "/images/plateCalculator.webp", alt: "Plate calculator showing selected weight plates on a barbell", description: "Calculate your barbell setup easily" },
      { src: "/images/stopper.webp", alt: "Workout stopwatch tracking rest time", description: "Track your rest and workout time" },
      { src: "/images/1RM.webp", alt: "1 rep max calculator", description: "Calculate your 1 rep max" },
      { src: "/images/workoutExercisesMobile.webp", alt: "Weekly workout planner for tracking exercises", description: "Plan weekly workouts" },
      { src: "/images/workoutMuscleGroupsMobile.webp", alt: "Track weekly workouts by targeted muscle groups", description: "Plan weekly workouts" },
      { src: "/images/addNote.webp", alt: "Add custom workout notes for better tracking", description: "Add workout notes" },
      { src: "/images/exerciseProgress.webp", alt: "Exercise progress tracker with performance history", description: "Track exercise progress" },
      { src: "/images/muscleGroupPrMobile.webp", alt: "View personal records (PRs) by muscle groups over time", description: "See PRs by muscle group in a time range" },
      { src: "/images/pieChartMobile.webp", alt: "Pie chart analysis of muscle group training distribution", description: "Analyze muscle groups with charts" },
      { src: "/images/nutritionTrackerFormMobile.webp", alt: "Nutrition tracker form for tracking macros and goals", description: "Track nutrition to help monitor macros." },
      { src: "/images/nutritionTrackerChartMobile.webp", alt: "Pie chart showing nutrition distribution and macro tracking", description: "Nutrition chart displaying macro distribution" },
      { src: "/images/darkMode.webp", alt: "Enable dark mode for better workout tracking experience", description: "Switch to Dark Mode" },
      { src: "/images/rank.webp", alt: "Weekly workout ranking based on performance", description: "See your weekly rank" },
      { src: "/images/workoutFrequency.webp", alt: "Monitor workout frequency and training consistency", description: "Monitor workout consistency" },
      { src: "/images/bodyWeightTracker.webp", alt: "Monitor body weight on a diagramm", description: "Track body weight" },
      { src: "/images/trackGoals.webp", alt: "Set and track fitness goals with progress updates", description: "Set & track goals" },
      { src: "/images/feedback.webp", alt: "Share feedback to improve the workout tracker app", description: "Share your feedback" },
    ],
    desktop: [
      { src: "/images/addExercise.webp", alt: "Add a new exercise to your workout log", description: "Log new exercises" },
      { src: "/images/PrNotificationDesktop.webp", alt: "Personal record (PR) notification for workout progress", description: "Get PR alerts" },
      { src: "/images/plateCalculator.webp", alt: "Plate calculator showing selected weight plates on a barbell", description: "Calculate your barbell setup easily" },
      { src: "/images/stopper.webp", alt: "Workout stopwatch tracking rest time", description: "Track your rest and workout time" },
      { src: "/images/1RM.webp", alt: "1 rep max calculator", description: "Calculate your 1 rep max" },
      { src: "/images/workoutExercisesDesktop.webp", alt: "Weekly workout planner for tracking exercises", description: "Plan weekly workouts" },
      { src: "/images/workoutMuscleGroupsDesktop.webp", alt: "Track weekly workouts by targeted muscle groups", description: "Target muscle groups weekly" },
      { src: "/images/addNoteDesktop.webp", alt: "Add custom workout notes for better tracking", description: "Add workout notes" },
      { src: "/images/exerciseProgressDesktop.webp", alt: "Exercise progress tracker with performance history", description: "Track exercise progress" },
      { src: "/images/muscleGroupPrDesktop.webp", alt: "View personal records (PRs) by muscle groups over time", description: "See PRs by muscle group in a time range" },
      { src: "/images/nutritionTrackerDesktop.webp", alt: "Nutrition tracker for tracking macros and goals", description: "Track nutrition to help monitor macros for a balanced diet." },
      { src: "/images/darkMode.webp", alt: "Enable dark mode for better workout tracking experience", description: "Switch to Dark Mode" },
      { src: "/images/rankDesktop.webp", alt: "Ranking based on consistency", description: "See your weekly rank" },
      { src: "/images/workoutFrequency.webp", alt: "Monitor workout frequency and training consistency", description: "Monitor workout consistency" },
      { src: "/images/bodyWeightTracker.webp", alt: "Monitor body weight on a diagramm", description: "Track body weight" },
      { src: "/images/trackGoals.webp", alt: "Set and track fitness goals with progress updates", description: "Set & track goals" },
      { src: "/images/feedback.webp", alt: "Share feedback to improve the workout tracker app", description: "Share your feedback" },
    ]
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const selectedImages = isMobile ? images.mobile : images.desktop;
  const [expandedParagraph, setExpandedParagraph] = useState(null);

  const toggleExpand = (index) => {
    setExpandedParagraph(expandedParagraph === index ? null : index);
  };

  return (
    <>
      <head>
        <meta name="robots" content="index, follow" />
        <title>Workout Tracker | Track your progress and reach your goals!</title>
        <meta name="description" content="Track your workouts, monitor your nutrition, set goals, and stay motivated with our easy-to-use trackers. Start for FREE today and reach your fitness goals!" />
        <link rel="canonical" href="https://workoutracker.com" />
      </head>
      <section className="flex flex-col gap-8 items-center mint-h-screen justify-center px-5 py-14">
        <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center">Welcome to your Ultimate Workout Tracker!</h1>
        <div className="bg-white dark:bg-teal-700 text-black dark:text-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto mt-6">
          <h2 className="text-lg lg:text-xl font-bold mb-8 text-center">Why Use a Workout Tracker for Your Workouts?</h2>
          <ul className="flex flex-col gap-4 text-sm md:text-lg text-gray-600 dark:text-white">
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Track Your Workout Progress</span>
              <p className={`${expandedParagraph === 1 ? '' : 'line-clamp-3'}`}>
                Using a workout tracker allows you to log your weights, reps, and exercises to see how far you've come.
                It's an essential part of achieving your <strong className="text-teal-800 dark:text-white">fitness goals </strong>
                and staying on track. While tracking your <Link to="/logbook" className="font-bold text-teal-800 hover:text-black dark:hover:text-teal-500 dark:text-white">workout performance</Link> is key,
                incorporating nutrition tracking can further help you optimize your results.
              </p>
              <button
                onClick={() => toggleExpand(1)}
                className="text-teal-800 hover:text-black dark:hover:text-teal-500 dark:text-white"
              >
                {expandedParagraph === 1 ? 'Show Less' : 'Show More'}
              </button>
            </li>
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Stay Motivated Throughout Your Fitness Journey</span>
              <p className={`${expandedParagraph === 2 ? '' : 'line-clamp-3'}`}>
                Consistent tracking of your workouts keeps you motivated and engaged. Monitoring your
                <strong className="text-teal-800 dark:text-white"> workout progress</strong> ensures you're always moving toward
                your goals. If you're interested in tracking your nutrition alongside your workouts, our
                <Link to="/nutrition-tracker" className="font-bold text-teal-800 hover:text-black dark:hover:text-teal-500 dark:text-white"> nutrition tracker </Link>
                can help you refine your diet and further boost your progress.
              </p>
              <button
                onClick={() => toggleExpand(2)}
                className="text-teal-800 hover:text-black dark:hover:text-teal-500 dark:text-white"
              >
                {expandedParagraph === 2 ? 'Show Less' : 'Show More'}
              </button>
            </li>
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Optimize Your Strength Training</span>
              <p className={`${expandedParagraph === 3 ? '' : 'line-clamp-3'}`}>
                By tracking your workout sessions, you can analyze your performance and tailor your routines to maximize strength gains.
                In addition, our nutrition tracker can provide insights into your diet, ensuring you're fueling your body properly for
                <strong className="text-teal-800 dark:text-white"> maximum performance</strong>.
              </p>
              <button
                onClick={() => toggleExpand(3)}
                className="text-teal-800 hover:text-black dark:hover:text-teal-500 dark:text-white"
              >
                {expandedParagraph === 3 ? 'Show Less' : 'Show More'}
              </button>
            </li>
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Break Through Fitness Plateaus</span>
              <p className={`${expandedParagraph === 4 ? '' : 'line-clamp-3'}`}>
                Tracking your progress helps you identify when you hit a plateau. Whether it's your workout performance or your nutrition,
                understanding both sides helps you make the necessary adjustments. Combining a workout tracker with a nutrition tracker
                can be the key to overcoming obstacles and continuing to progress.
              </p>
              <button
                onClick={() => toggleExpand(4)}
                className="text-teal-800 hover:text-black dark:hover:text-teal-500 dark:text-white"
              >
                {expandedParagraph === 4 ? 'Show Less' : 'Show More'}
              </button>
            </li>
            <li>
              <a href="https://www.fitnessfirst.co.uk/blog/how-and-why-should-i-track-my-workouts"
              target="_blank" rel="noopener"
              className="font-bold text-teal-800 dark:text-white hover:text-black dark:hover:text-teal-500 underline">
                Read more about why tracking workouts helps fitness progress.
              </a>
            </li>
          </ul>
        </div>
        <button className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-500 dark:hover:bg-teal-500 font-semibold text-lg xl:text-2xl
        py-3 px-6 rounded-lg transition duration-300">
          <Link to="/logbook" className="flex gap-2 items-center">
            Go To LogBook
            <span className="material-icons">
              arrow_forward
            </span>
          </Link>
        </button>
      </section>
      <section className="flex flex-col gap-8 items-center mint-h-screen justify-center bg-gradient-to-tr from-gray-700 to-gray-900 py-14">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Explore our features</h2>
          <span className="material-icons text-3xl md:text-4xl">
            keyboard_double_arrow_down
          </span>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <h3 className="text-xl lg:text-2xl font-semibold text-center">{selectedImages[activeIndex].description}</h3>
          <div className="flex w-full max-w-2xl mx-auto">
            <button className="button-prev">
              <span className="material-icons text-2xl md:text-4xl">
                navigate_before
              </span>
            </button>
              <Swiper
                modules={[Pagination, Autoplay, Navigation, Thumbs]}
                navigation={{ nextEl: ".button-next", prevEl: ".button-prev" }}
                thumbs={{ swiper: thumbsSwiper }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="rounded-xl shadow-lg"
              >
                {selectedImages.map((image, index) => (
                  <SwiperSlide key={index} className="flex justify-center w-full">
                    <img src={image.src} loading="lazy" alt={image.alt} className="rounded-xl border-2 w-full object-contain aspect-square" />
                  </SwiperSlide>
                ))}
              </Swiper>
            <button className="button-next">
              <span className="material-icons text-2xl md:text-4xl">
                navigate_next
              </span>
            </button>
          </div>
          <div className="flex w-5/6 max-w-2xl mx-auto">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              className="thumbs-swiper"
            >
              {selectedImages.map((image, index) => (
                <SwiperSlide key={index} className="flex justify-center w-1/4 md:w-1/5 h-1/4 md:h-1/5 py-2 px-1 overflow-hidden">
                  <img src={image.src} loading="lazy" alt={image.alt} className={`rounded-lg border-2 w-full object-contain aspect-square  ${activeIndex === index ? "border-teal-400 scale-105 shadow-lg" : "border-gray-300 opacity-75"}`}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section className="px-5">
        <Pricing />
      </section>
    </>
  );
}

export default Home;