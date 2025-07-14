// src/hooks/useDebouncedValue.ts
import { useState, useEffect } from 'react';

export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook do inputów kontrolowanych bez utraty focusu
export function useControlledInput(initialValue: string, onChangeDebounced?: (value: string) => void) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setValue(initialValue);
    }
  }, [initialValue, isFocused]);

  useEffect(() => {
    if (onChangeDebounced && !isFocused) {
      const timer = setTimeout(() => {
        if (value !== initialValue) {
          onChangeDebounced(value);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [value, isFocused, initialValue, onChangeDebounced]);

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    onFocus: () => setIsFocused(true),
    onBlur: () => {
      setIsFocused(false);
      if (onChangeDebounced && value !== initialValue) {
        onChangeDebounced(value);
      }
    }
  };
}