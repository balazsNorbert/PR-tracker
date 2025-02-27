import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay, Navigation, Thumbs } from 'swiper/modules';

function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeIndex, setActiveIndex] = useState(0);
  const images = {
    mobile: [
      { src: "/images/addExercise.png", alt: "Add exercise image", description: "Log new exercises" },
      { src: "/images/PrNotification.png", alt: "Pr notification image", description: "Get PR alerts" },
      { src: "/images/workoutExercisesMobile.png", alt: "Weekly workouts image", description: "Plan weekly workouts" },
      { src: "/images/workoutMuscleGroupsMobile.png", alt: "Weekly workouts by muscle groups image", description: "Target muscle groups weekly" },
      { src: "/images/addNote.png", alt: "Add note image", description: "Add workout notes" },
      { src: "/images/exerciseProgress.png", alt: "Progress by exercise", description: "Track exercise progress" },
      { src: "/images/muscleGroupPrMobile.png", alt: "PRs by muscle groups image", description: "See PRs by muscle group in a time range" },
      { src: "/images/pieChartMobile.png", alt: "Piechart by muscle groups", description: "Analyze muscle groups with charts" },
      { src: "/images/darkMode.png", alt: "Dark Mode button", description: "Switch to Dark Mode" },
      { src: "/images/rank.png", alt: "Rank", description: "See your weekly rank" },
      { src: "/images/workoutFrequency.png", alt: "Workout frequency", description: "Monitor workout consistency" },
      { src: "/images/trackGoals.png", alt: "Track Goals", description: "Set & track goals" },
      { src: "/images/feedback.png", alt: "Feedback", description: "Share your feedback" },
    ],
    desktop: [
      { src: "/images/addExercise.png", alt: "Add exercise image", description: "Log new exercises" },
      { src: "/images/PrNotification.png", alt: "Pr notification image", description: "Get PR alerts" },
      { src: "/images/workoutExercisesDesktop.png", alt: "Weekly workouts image", description: "Plan weekly workouts" },
      { src: "/images/workoutMuscleGroupsDesktop.png", alt: "Weekly workouts by muscle groups image", description: "Target muscle groups weekly" },
      { src: "/images/addNote.png", alt: "Add note image", description: "Add workout notes" },
      { src: "/images/exerciseProgress.png", alt: "Progress by exercise", description: "Track exercise progress" },
      { src: "/images/muscleGroupPrDesktop.png", alt: "PRs by muscle groups image", description: "See PRs by muscle group in a time range" },
      { src: "/images/darkMode.png", alt: "Dark Mode button", description: "Switch to Dark Mode" },
      { src: "/images/rank.png", alt: "Rank", description: "See your weekly rank" },
      { src: "/images/workoutFrequency.png", alt: "Workout frequency", description: "Monitor workout consistency" },
      { src: "/images/trackGoals.png", alt: "Track Goals", description: "Set & track goals" },
      { src: "/images/feedback.png", alt: "Feedback", description: "Share your feedback" },
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
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center mx-5 md:mx-10 mb-20">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center mt-10">Welcome to your Workout Tracker!</h1>
      <p className="text-lg md:text-xl xl:text-2xl font-semibold text-center">Track your progress and stay motivated to reach your fitness goals</p>
      <div className="bg-white dark:bg-teal-700 text-black dark:text-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto mt-6">
        <h3 className="text-xl lg:text-2xl font-bold mb-8 text-center">Why Track Your Workouts?</h3>
        <ul className="flex flex-col gap-4 text-base md:text-lg">
          <li>✅ <strong>Track Your Progress</strong> - Monitor your weights, reps, and exercises to see how far you've come.</li>
          <li>✅ <strong>Stay Motivated</strong> - Seeing your progress over time keeps you engaged and motivated.</li>
          <li>✅ <strong>Optimize Your Training</strong> - Analyze your data and make smarter workout decisions.</li>
          <li>✅ <strong>Avoid Plateaus</strong> - Identify when progress slows down and make adjustments to keep improving.</li>
        </ul>
      </div>
      <button className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-500 dark:hover:bg-teal-500 font-semibold text-xl xl:text-2xl
      py-3 px-6 rounded-lg transition duration-300 mb-20">
        <Link to="/logbook" className="flex gap-2 items-center">
          Go To LogBook
          <span className="material-icons">
            arrow_forward
          </span>
        </Link>
      </button>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-center">Explore our features</h2>
        <span class="material-icons text-3xl md:text-4xl">
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
                  <img src={image.src} alt={image.alt} className="rounded-xl border-2 w-full object-contain aspect-square" />
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
                <img src={image.src} alt={image.alt} className={`rounded-lg border-2 w-full object-contain aspect-square  ${activeIndex === index ? "border-teal-400 scale-105 shadow-lg" : "border-gray-300 opacity-75"}`}/>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Home;