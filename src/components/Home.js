/* eslint-disable react/jsx-no-target-blank */
import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
      { src: "/images/workoutExercisesMobile.webp", alt: "Weekly workout planner for tracking exercises", description: "Plan weekly workouts" },
      { src: "/images/workoutMuscleGroupsMobile.webp", alt: "Track weekly workouts by targeted muscle groups", description: "Plan weekly workouts" },
      { src: "/images/addNote.webp", alt: "Add custom workout notes for better tracking", description: "Add workout notes" },
      { src: "/images/exerciseProgress.webp", alt: "Exercise progress tracker with performance history", description: "Track exercise progress" },
      { src: "/images/muscleGroupPrMobile.webp", alt: "View personal records (PRs) by muscle groups over time", description: "See PRs by muscle group in a time range" },
      { src: "/images/pieChartMobile.webp", alt: "Pie chart analysis of muscle group training distribution", description: "Analyze muscle groups with charts" },
      { src: "/images/darkMode.webp", alt: "Enable dark mode for better workout tracking experience", description: "Switch to Dark Mode" },
      { src: "/images/rank.webp", alt: "Weekly workout ranking based on performance", description: "See your weekly rank" },
      { src: "/images/workoutFrequency.webp", alt: "Monitor workout frequency and training consistency", description: "Monitor workout consistency" },
      { src: "/images/trackGoals.webp", alt: "Set and track fitness goals with progress updates", description: "Set & track goals" },
      { src: "/images/feedback.webp", alt: "Share feedback to improve the workout tracker app", description: "Share your feedback" },
    ],
    desktop: [
      { src: "/images/addExercise.webp", alt: "Add a new exercise to your workout log", description: "Log new exercises" },
      { src: "/images/PrNotificationDesktop.webp", alt: "Personal record (PR) notification for workout progress", description: "Get PR alerts" },
      { src: "/images/workoutExercisesDesktop.webp", alt: "Weekly workout planner for tracking exercises", description: "Plan weekly workouts" },
      { src: "/images/workoutMuscleGroupsDesktop.webp", alt: "Track weekly workouts by targeted muscle groups", description: "Target muscle groups weekly" },
      { src: "/images/addNoteDesktop.webp", alt: "Add custom workout notes for better tracking", description: "Add workout notes" },
      { src: "/images/exerciseProgress.webp", alt: "Exercise progress tracker with performance history", description: "Track exercise progress" },
      { src: "/images/muscleGroupPrDesktop.webp", alt: "View personal records (PRs) by muscle groups over time", description: "See PRs by muscle group in a time range" },
      { src: "/images/darkModeDesktop.webp", alt: "Enable dark mode for better workout tracking experience", description: "Switch to Dark Mode" },
      { src: "/images/rankDesktop.webp", alt: "Ranking based on consistency", description: "See your weekly rank" },
      { src: "/images/workoutFrequencyDesktop.webp", alt: "Monitor workout frequency and training consistency", description: "Monitor workout consistency" },
      { src: "/images/trackGoals.webp", alt: "Set and track fitness goals with progress updates", description: "Set & track goals" },
      { src: "/images/feedbackDesktop.webp", alt: "Share feedback to improve the workout tracker app", description: "Share your feedback" },
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

  return (
    <>
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>
      <section className="flex flex-col gap-8 items-center mint-h-screen justify-center px-5 py-14">
        <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center">Welcome to your Ultimate Workout Tracker!</h1>
        <h2 className="text-lg md:text-xl xl:text-2xl font-semibold text-center">Use this Workout Tracker to Stay Motivated and Reach Your Fitness Goals!</h2>
        <div className="bg-white dark:bg-teal-700 text-black dark:text-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto mt-6">
          <h3 className="text-lg lg:text-xl font-bold mb-8 text-center">Why Use a Workout Tracker for Your Workouts?</h3>
          <ul className="flex flex-col gap-4 text-sm md:text-lg text-gray-600 dark:text-white">
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Track Your Progress</span>
              <p>
                Using a <span className="font-bold text-black dark:text-white">workout tracker</span> allows you to log your weights, reps, and exercises to see how far you've come.
                Tracking progress is an essential part of achieving fitness goals.
                It helps you set new targets and understand your strengths and weaknesses.
              </p>
            </li>
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Stay Motivated</span>
              <p>
                Seeing your progress over time keeps you engaged and motivated.
                Consistency is key, and logging your progress keeps you on track to achieve your goals.
              </p>
            </li>
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Optimize Your Training</span>
              <p>
                Analyze your training and make smarter workout decisions.
                By tracking your performance, you can tailor your workouts to your needs, avoid burnout, and prevent injury.
              </p>
            </li>
            <li>
              ✅ <span className="font-bold text-black dark:text-white">Avoid Plateaus</span>
              <p>
                Identify when progress slows down and make adjustments to keep improving.
                A plateau can be frustrating, but recognizing the signs early allows you to adjust your routine.
              </p>
            </li>
            <a href="https://www.fitnessfirst.co.uk/blog/how-and-why-should-i-track-my-workouts"
            target="_blank" rel="noopener"
            className="font-bold text-teal-600 dark:text-white hover:text-teal-800 dark:hover:text-teal-500 underline">
              Read more about why tracking workouts helps fitness progress.
            </a>
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