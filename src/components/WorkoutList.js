import React from 'react';

const WorkoutList = ({ workouts }) => {
  return (
    <div>
      <h2>Workouts</h2>
      {workouts.length === 0 ? (<p>No workouts found.</p>) :
      (
      <ul>
        {workouts.map((day, index) => (
          <div key={index} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{day.date}</h2>
           {day.exercises.map((exercise, idx) => (
             <div key={idx} className="mb-4">
               <h3 className="font-semibold">{exercise.name}</h3>
               <ul className="list-disc ml-4">
                 {exercise.sets.map((set, i) => (
                   <li key={i}>
                     {set.reps} ismétlés, {set.weight} kg
                   </li>
                 ))}
               </ul>
             </div>
           ))}
          </div>
        ))}
      </ul>)}
    </div>
  )
}

export default WorkoutList;