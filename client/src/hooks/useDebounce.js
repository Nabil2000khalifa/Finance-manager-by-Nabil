// Custom hook for debounced values - prevents excessive re-renders during typing
import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for form input with debouncing
export const useDebouncedFormInput = (initialValue = "", delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return { value, setValue, debouncedValue };
};
