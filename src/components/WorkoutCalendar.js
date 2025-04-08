import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const WorkoutCalendar = ({ workoutDays, streakAchievedWeeks }) => {
  const [date, setDate] = useState(new Date());

  const tileClassName = ({ date, view }) => {
    const workoutDate = workoutDays.find(d => new Date(d).toDateString() === date.toDateString());
    const streakWeek =Array.isArray(streakAchievedWeeks) && streakAchievedWeeks.some(week => {
      const current = date.setHours(0, 0, 0, 0);
      const start = new Date(week.startDate).setHours(0, 0, 0, 0);
      const end = new Date(week.endDate).setHours(0, 0, 0, 0);
      return current >= start && current <= end;
    });

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