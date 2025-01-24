import React, { useState, useEffect } from "react";

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

const WeeklyView = ({ workouts, onDeleteSet }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [currentDay, setCurrentDay] = useState(today);
  const [week, setWeek] = useState(getCurrentWeek(currentDay));
  const [workoutsList, setWorkoutsList] = useState(workouts);

  useEffect(() => {
    setWorkoutsList(workouts);
  }, [workouts]);

  const handleNavigate = (direction) => {
    const today = new Date(currentDay);
    if(direction === 'prev') today.setDate(today.getDate() - 7);
    if(direction === 'next') today.setDate(today.getDate() + 7);
    const newDate = today.toISOString().slice(0, 10);
    setCurrentDay(newDate);
    setWeek(getCurrentWeek(newDate));
  };

  const handleDeleteSet = (date, workoutIndex, setIndex) => {
    onDeleteSet(date, workoutIndex, setIndex);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center w-full text-sm md:text-lg lg:text-xl">
        <button onClick={() => handleNavigate('prev')}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg">
          Previous Week
        </button>
        <button onClick={() => handleNavigate('next')}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg">
          Next Week
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-3">
        {week.map((date, index) => {
          const isToday = date === today;
          const dayNumber = new Date(date).getDate();
          const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <div key={index} className={`aspect-square p-2 min-h-20 lg:min-h-52 rounded-lg shadow-xl ${isToday ? 'bg-teal-400 text-white' : 'bg-gray-200'}`}>
              <h3 className="text-sm lg:text-lg font-semibold text-center">{dayName}</h3>
              <p className="text-center">{dayNumber}</p>
              <ul>
                {workoutsList.filter((workout) => workout.date === date).map((workout, workoutIndex) => (
                  <li className="text-lg" key={`${date}-${workoutIndex}`}>
                    {workout.exercise.name}
                    <ul className="text-sm">
                      {workout.exercise.sets.map((set, setIndex) => (
                        <div key={`${date}-${workoutIndex}-${setIndex}`} className="flex items-center justify-between text-sm">
                          <li>
                            {set.weight} {set.unit} - {set.reps} reps
                          </li>
                          <button type="button" onClick={() => handleDeleteSet(date, workoutIndex, setIndex)} className=" text-teal-800">
                            <span className="material-icons">delete</span>
                          </button>
                        </div>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default WeeklyView;