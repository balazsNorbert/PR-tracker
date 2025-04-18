import React, { useState, useEffect, useRef } from 'react';
import sound from '../assets/sound/clock_countdown.wav';
const CountDownTimer = () => {
  const [minutesFirstDigit, setMinutesFirstDigit] = useState(0);
  const [minutesSecondDigit, setMinutesSecondDigit] = useState(0);
  const [secondsFirstDigit, setSecondsFirstDigit] = useState(0);
  const [secondsSecondDigit, setSecondsSecondDigit] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const incrementDigit = (digit, setDigit) => {
    setDigit((prev) => (prev + 1) % 10);
  };

  const decrementDigit = (digit, setDigit) => {
    setDigit((prev) => (prev - 1 + 10) % 10);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  const alarmSound = useRef(new Audio(sound));

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        if(minutesFirstDigit === 0 &&
          minutesSecondDigit === 0 &&
          secondsFirstDigit === 0 &&
          secondsSecondDigit <= 5 &&
          secondsSecondDigit !== 0
        ) {
          alarmSound.current.play();
        }
        if (
          minutesFirstDigit === 0 &&
          minutesSecondDigit === 0 &&
          secondsFirstDigit === 0 &&
          secondsSecondDigit === 0
        ) {
          clearInterval(timer);
          return;
        }
        if (secondsSecondDigit === 0) {
          if (secondsFirstDigit === 0) {
            if (minutesSecondDigit === 0) {
              if (minutesFirstDigit === 0) {
                clearInterval(timer);
              } else {
                setMinutesFirstDigit(prev => prev - 1);
                setMinutesSecondDigit(9);
              }
            } else {
              setMinutesSecondDigit(prev => prev - 1);
            }
            setSecondsFirstDigit(5);
            setSecondsSecondDigit(9);
          } else {
            setSecondsFirstDigit(prev => prev - 1);
            setSecondsSecondDigit(9);
          }
        } else {
          setSecondsSecondDigit(prev => prev - 1);
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isActive, minutesFirstDigit, minutesSecondDigit, secondsFirstDigit, secondsSecondDigit]);

  return (
    <div className="flex flex-col items-end justify-center gap-4  text-4xl">
      <button
       onClick={toggleVisibility}
       className="relative bg-gray-800 text-white rounded-xl shadow-lg hover:bg-gray-600 transition"
      >
        {isVisible ? (
          <span className="relative bottom-1 text-4xl px-3">-</span>
        ) : (
          <span className="material-icons text-3xl p-2">alarm_on</span>
        )}
      </button>
      {isVisible && (
        <>
          <div className="flex items-center font-mono font-bold bg-gray-800 rounded-xl p-2">
            <div className="flex flex-col items-center">
              <button
                onClick={() => incrementDigit(minutesFirstDigit, setMinutesFirstDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_less
                </span>
              </button>
              <p className="pb-3">{String(minutesFirstDigit).padStart(1, '0')}</p>
              <button
                onClick={() => decrementDigit(minutesFirstDigit, setMinutesFirstDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_more
                </span>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => incrementDigit(minutesSecondDigit, setMinutesSecondDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_less
                </span>
              </button>
              <p className="pb-3">{String(minutesSecondDigit).padStart(1, '0')}</p>
              <button
                onClick={() => decrementDigit(minutesSecondDigit, setMinutesSecondDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_more
                </span>
              </button>
            </div>
            <span className="font-normal mb-4">:</span>
            <div className="flex flex-col items-center">
              <button
                onClick={() => incrementDigit(secondsFirstDigit, setSecondsFirstDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_less
                </span>
              </button>
              <p className="pb-3">{String(secondsFirstDigit).padStart(1, '0')}</p>
              <button
                onClick={() => decrementDigit(secondsFirstDigit, setSecondsFirstDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_more
                </span>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => incrementDigit(secondsSecondDigit, setSecondsSecondDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_less
                </span>
              </button>
              <p className="pb-3">{String(secondsSecondDigit).padStart(1, '0')}</p>
              <button
                onClick={() => decrementDigit(secondsSecondDigit, setSecondsSecondDigit)}
                className="text-lg"
              >
                <span className="material-icons hover:text-teal-500">
                  expand_more
                </span>
              </button>
            </div>
          </div>
          <div className="flex mx-auto text-sm md:text-base gap-3">
            <button
              onClick={toggleTimer}
              className="px-4 pb-2 pt-3 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isActive ? (
                <span className="material-icons">
                  pause
                </span>
              ) : (
                <span className="material-icons">
                  play_arrow
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setMinutesFirstDigit(0);
                setMinutesSecondDigit(0);
                setSecondsFirstDigit(0);
                setSecondsSecondDigit(0);
                setIsActive(false);
              }}
              className="px-4 pb-2 pt-3 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-600"
            >
              <span className="material-icons">
                restart_alt
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CountDownTimer;
