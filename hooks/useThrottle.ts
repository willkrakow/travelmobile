import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastExecuted = React.useRef<Dayjs>(dayjs());

  React.useEffect(() => {
    if (dayjs().isAfter(lastExecuted.current.add(interval, 'milliseconds'))) {
        lastExecuted.current = dayjs();
        setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = dayjs();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}


export default useThrottle;