import { memo, useMemo, useCallback } from "react";

// Higher-order component for memoization with custom comparison
export const withMemo = (Component, propsAreEqual) => {
  return memo(Component, propsAreEqual);
};

// Utility to create memoized list items
export const createMemoizedListItem = (Component) => {
  return memo(Component, (prevProps, nextProps) => {
    // Compare relevant props only - ignore callback references
    return (
      prevProps.id === nextProps.id &&
      prevProps.data === nextProps.data &&
      prevProps.isLoading === nextProps.isLoading
    );
  });
};

// Custom hook for memoized calculated values
export const useMemoCalc = (value, deps) => {
  return useMemo(() => value, deps);
};

// Custom hook for stable callbacks
export const useStableCallback = (callback, deps = []) => {
  return useCallback(callback, deps);
};
