import React, { useEffect, useState } from 'react';

const Timer = ({isRunning, startTime}) => {

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, '0');
    const milliseconds = Math.floor((time % 1000) / 10)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval;
    if(isRunning) {
      interval = setInterval(() => { 
        setTime(Date.now() - startTime)
      }, 100)
    } else {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [startTime, setTime, isRunning])

  return ( 
    <div>
      <span>{formatTime(time)}</span>
    </div>
  )
}
  
export default Timer;
