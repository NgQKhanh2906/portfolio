import React, { useState, useEffect, useRef } from "react";

type UseOptimisticFn = <T, A>(
  passthrough: T,
  updateFn: (currentState: T, optimisticValue: A) => T
) => [T, (action: A) => void];

/**
 * useOptimistic Hook
 * Cung cấp cơ chế quản lý trạng thái lạc quan (Optimistic UI) tương thích React 18 & React 19.
 * Khi passthrough (dữ liệu từ server) thay đổi, trạng thái được tự động đồng bộ lại.
 */
export function useOptimistic<T, A>(
  passthrough: T,
  updateFn: (currentState: T, optimisticValue: A) => T
): [T, (action: A) => void] {
  const reactWithOptimistic = React as unknown as {
    useOptimistic?: UseOptimisticFn;
  };

  if (typeof reactWithOptimistic.useOptimistic === "function") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return reactWithOptimistic.useOptimistic(passthrough, updateFn);
  }

  // Fallback an toàn cho React 18:
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [optimisticState, setOptimisticState] = useState<T>(passthrough);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const passthroughRef = useRef<T>(passthrough);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    passthroughRef.current = passthrough;
    setOptimisticState(passthrough);
  }, [passthrough]);

  const setOptimistic = (action: A) => {
    setOptimisticState((current) => updateFn(current, action));
  };

  return [optimisticState, setOptimistic];
}
