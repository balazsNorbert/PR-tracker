import React, { useState } from "react";
import { Link } from "react-router-dom";

const getCurrentWeek = (startDate) => {
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1));
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day.toISOString().slice(0, 10);
  });
  return week;
};

const WeeklyView = ({ workouts, handleDeleteSet }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [currentDay, setCurrentDay] = useState(today);
  const [week, setWeek] = useState(getCurrentWeek(currentDay));

  const handleNavigate = (direction) => {
    const today = new Date(currentDay);
    if(direction === 'prev') today.setDate(today.getDate() - 7);
    if(direction === 'next') today.setDate(today.getDate() + 7);
    const newDate = today.toISOString().slice(0, 10);
    setCurrentDay(newDate);
    setWeek(getCurrentWeek(newDate));
  };

  return (
    <div className="flex flex-col h-full gap-5 mb-20">
      <div className="flex justify-between items-center w-full text-sm md:text-lg lg:text-xl">
        <button onClick={() => handleNavigate('prev')} className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-400 dark:hover:bg-teal-500 transition duration-300 px-4 py-2 rounded-lg">
          Previous Week
        </button>
        <button onClick={() => handleNavigate('next')} className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-400 dark:hover:bg-teal-500 transition duration-300 px-4 py-2 rounded-lg">
          Next Week
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-3">
        {week.map((date, index) => {
          const isToday = date === today;
          const dayNumber = new Date(date).getDate();
          const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <div key={index} className={`aspect-square pt-1 px-3 pb-11 min-h-20 lg:min-h-52 rounded-lg shadow-xl ${isToday ? 'bg-teal-500' : 'bg-white dark:bg-teal-700 text-black dark:text-white'}`}>
              <h3 className="text-xs lg:text-base font-semibold text-center">{dayName}</h3>
              <p className="text-center text-sm lg:text-lg mb-1">{dayNumber}</p>
              <div className="h-full overflow-y-auto overflow-x-auto w-full">
                {workouts.filter((workout) => new Date(workout.date).toISOString().slice(0, 10) === date).map((workout, workoutIndex) => (
                  <ul className="flex gap-3" key={`${date}-${workoutIndex}`}>
                    {workout.exercise.map((exercise, exerciseIndex) => (
                      <li key={exerciseIndex} className="flex gap-1 text-xs md:text-sm 2xl:text-lg">
                        <div className="flex flex-col min-w-max">
                          <p className="font-semibold text-sm md:text-base 2xl:text-xl">
                            {`${exerciseIndex + 1}. `}
                            <Link to={`/exercise/${exercise.name}`}>{exercise.name}</Link>
                          </p>
                          <ul>
                            {exercise.sets.map((set, setIndex) => (
                              <li key={setIndex} className="flex gap-1 items-center">
                                <span className="font-semibold">{`${setIndex + 1}.`}</span>
                                <p className="block min-w-28 md:min-w-32 2xl:min-w-40 ">{set.weight} {set.unit} - {set.reps} reps</p>
                                <button type="button" onClick={() => handleDeleteSet(date, workoutIndex, exerciseIndex, setIndex)} className="text-red-600 hover:text-red-700 transition duration-300">
                                  <span className="material-icons text-[18px] md:text-[24px]">delete</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default WeeklyView;