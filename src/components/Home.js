import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay, Navigation, Thumbs } from 'swiper/modules';

function Home() {
  const images = [
    { src: "/images/HomePage.png", alt: "Home Page" },
    { src: "/images/HomePage.png", alt: "Home Page" },
    { src: "/images/HomePage.png", alt: "Home Page" },
    { src: "/images/HomePage.png", alt: "Home Page" },
    { src: "/images/HomePage.png", alt: "Home Page" },
    { src: "/images/HomePage.png", alt: "Home Page" }
  ];

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
      <h2 className="text-2xl lg:text-3xl font-bold text-center">Explore our features</h2>
      <div className="flex flex-col gap-2 w-full max-w-2xl">
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
              loop={true}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="rounded-xl shadow-lg"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="flex justify-center w-full">
                  <img src={image.src} alt={image.alt} className="rounded-xl border-2 w-full" />
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
            {images.map((image, index) => (
              <SwiperSlide key={index} className="flex justify-center max-w-20 max-h-20">
                <img src={image.src} alt={image.alt} className="rounded-lg border-2 w-full" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Home;