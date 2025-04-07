import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const WorkoutCalendar = ({ workoutDays, streakAchievedWeeks }) => {
  const [date, setDate] = useState(new Date());

  const tileClassName = ({ date, view }) => {
    const workoutDate = workoutDays.find(d => new Date(d).toDateString() === date.toDateString());
    let streakWeek = null;

    if (Array.isArray(streakAchievedWeeks)) {
      streakWeek = streakAchievedWeeks.find(week =>
        new Date(week.startDate).toDateString() <= date.toDateString() &&
        new Date(week.endDate).toDateString() >= date.toDateString()
      );
    }
    if(workoutDate && streakWeek) {
      return 'workout-day streak-week';
    }
    if(workoutDate) {
      return 'workout-day';
    }
    return '';
  }

  return (
    <div>
      <Calendar onChange={setDate} value={date} tileClassName={tileClassName} />
    </div>
  );
}

export default WorkoutCalendar;