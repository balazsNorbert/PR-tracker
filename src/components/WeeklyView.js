import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Note from './Note';

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

const WeeklyView = ({ workouts, handleDeleteSet, handleSaveNote }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [currentDay, setCurrentDay] = useState(today);
  const [week, setWeek] = useState(getCurrentWeek(currentDay));
  const [showModal, setShowModal] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [showMuscleGroups, setShowMuscleGroups] = useState(false);

  const handleNavigate = (direction) => {
    const today = new Date(currentDay);
    if(direction === 'prev') today.setDate(today.getDate() - 7);
    if(direction === 'next') today.setDate(today.getDate() + 7);
    const newDate = today.toISOString().slice(0, 10);
    setCurrentDay(newDate);
    setWeek(getCurrentWeek(newDate));
  };

  const handleOpenModal = (date, workoutIndex, exerciseIndex, setIndex) => {
    setDeleteData({ date, workoutIndex, exerciseIndex, setIndex });
    setShowModal(setIndex);
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleConfirmDelete = () => {
    if (deleteData) {
      handleDeleteSet(deleteData.date, deleteData.workoutIndex, deleteData.exerciseIndex, deleteData.setIndex);
    }
    setShowModal(null);
  };

  return (
    <div className="flex flex-col h-full gap-5 mb-20">
      <button onClick={() => setShowMuscleGroups(!showMuscleGroups)} className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-400 dark:hover:bg-teal-500 transition duration-300 px-4 py-2 w-fit mx-auto rounded-lg">
        {showMuscleGroups ? "Show exercises" : "Show Muscle Group"}
      </button>
      <div className="flex justify-between items-center w-full text-sm md:text-lg lg:text-xl">
        <button onClick={() => handleNavigate('prev')} className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-400 dark:hover:bg-teal-500 transition duration-300 px-4 py-2 rounded-lg">
          Previous Week
        </button>
        <button onClick={() => handleNavigate('next')} className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-400 dark:hover:bg-teal-500 transition duration-300 px-4 py-2 rounded-lg">
          Next Week
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-full gap-3">
        {week.map((date, index) => {
          const isToday = date === today;
          const dayNumber = new Date(date).getDate();
          const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <div key={date} className={`aspect-video pt-2 px-2 md:px-3 pb-7 lg:pb-10 min-h-20 lg:min-h-52 rounded-lg shadow-xl relative ${isToday ? 'bg-teal-500' : 'bg-white dark:bg-teal-700 text-black dark:text-white'}`}>
              <h3 className="text-xs lg:text-base font-semibold text-center mb-2">{dayNumber} {dayName}</h3>
              <div className="h-full overflow-y-auto overflow-x-auto w-full">
                {workouts.filter((workout) => new Date(workout.date).toISOString().slice(0, 10) === date).map((workout, workoutIndex) => (
                  showMuscleGroups ? (
                    <div key={`${date}-${workoutIndex}`} className="flex flex-col gap-1 md:gap-4">
                      {[...new Set(workout.exercise.map((exercise) => exercise.muscleGroup))].map((muscle, muscleIndex) => (
                        <span key={`${muscle}-${muscleIndex}`} className={`text-center ${isToday ? 'bg-teal-700 dark:bg-teal-700' : 'bg-teal-600 dark:bg-teal-500 text-white'}
                        p-2 rounded-md shadow-md text-sm md:text-xl 2xl:text-2xl font-bold`}>{muscle}</span>
                      ))}
                    </div>
                  ) : (
                  <ul className="flex gap-3" key={`${date}-${workoutIndex}`}>
                    {workout.exercise.map((exercise, exerciseIndex) => (
                      <li key={exercise._id} className={`flex gap-1 text-xs md:text-sm 2xl:text-lg pr-3 border-r-2 ${isToday ? 'border-white' : 'border-black dark:border-white'}`}>
                        <div className="flex flex-col min-w-max">
                          <p className={`font-semibold hover:text-teal-600 dark:hover:text-teal-400 text-xs xs:text-base 2xl:text-xl border-b-2 ${isToday ? 'border-white' : 'border-black dark:border-white'}`}>
                            {`${exerciseIndex + 1}. `}
                            <Link to={`/exercise/${exercise.name}`}>{exercise.name}</Link>
                          </p>
                          <ul>
                            {exercise.sets.map((set, setIndex) => (
                              <li key={set._id} className="flex gap-1 items-center text-xxs xs:text-sm 2xl:text-lg">
                                <span className="font-semibold">{`${setIndex + 1}.`}</span>
                                <p>{set.weight} {set.unit} - {set.reps} reps</p>
                                <button type="button" onClick={() => handleOpenModal(date, workoutIndex, exerciseIndex, setIndex)} className="text-red-600 hover:text-red-700 transition duration-300">
                                  <span className="material-icons text-base md:text-xl xl:text-2xl 2xl:text-3xl">delete</span>
                                </button>
                                <span className="font-bold">{set.record && "PR"}</span>
                                {showModal === setIndex && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-20 flex justify-center items-center z-10">
                                  <div className="flex flex-col gap-2 bg-teal-700 dark:bg-teal-600 p-5 rounded-lg shadow-lg">
                                    <h2 className="font-semibold text-lg text-white">Do you really want to delete this set?</h2>
                                    <div className="bg-teal-800 hard:bg-teal-700 text-white p-2 rounded-md">
                                      <p className="text-base lg:text-xl font-bold">{set.weight} {set.unit} - {set.reps} reps</p>
                                    </div>
                                    <div className="flex justify-between">
                                      <button
                                        onClick={handleCloseModal}
                                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleConfirmDelete}
                                        className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                                      >
                                        Confirm
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                  )
                ))
              }
              </div>
              <Note workoutDate={new Date(date).toISOString()} onNoteSaved={handleSaveNote}
              existingNote={workouts.find(workout => workout.date === new Date(date).toISOString())?.note || ""} />
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default WeeklyView;