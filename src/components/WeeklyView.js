import React, { useState, useEffect } from "react";

const getCurrentWeek = () => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day.toISOString().slice(0, 10);
  });
  return week;
};

const WeeklyView = ({ workouts }) => {
  const [week, setWeek] = useState(getCurrentWeek());
  const [currentDay, setCurrentDay] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setWeek(getCurrentWeek());
  }, []);

  const handleNavigate = (direction) => {
    const today = new Date();
    if(direction === 'prev') today.setDate(today.getDate() - 7);
    if(direction === 'next') today.setDate(today.getDate() + 7);
    setCurrentDay(today.toISOString().slice(0, 10));
    setWeek(getCurrentWeek());
  };

  return (
    <div>
      <div className="flex justify-between items-center w-full h-min-[300px]">
        <button onClick={() => handleNavigate('prev')}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Previous Week
        </button>
        <button onClick={() => handleNavigate('next')}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Next Week
        </button>
      </div>
      <div className="grid grid-cols-7 w-full gap-5">
        {week.map((date, index) => {
          const isToday = date === currentDay;
          const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <div key={index} className={`p-3 rounded-lg ${isToday ? 'bg-blue-500 text-white' : ''}`}>
              <h3 className="text-lg font-semibold text-center">{dayName}</h3>
              <ul>
                {workouts.filter((workout) => workout.date === date).map((workout, workoutIndex) => (
                  <li key="workoutIndex">
                    {workout.exercise.name}
                    <ul className="text-sm">
                      {workout.exercise.sets.map((set, setIndex) => (
                        <li key={setIndex}>
                          {set.reps} reps with {set.weight} {set.unit}
                        </li>
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