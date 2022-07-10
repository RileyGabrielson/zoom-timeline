import { useEffect, useReducer } from "react";
import { ObservableValue } from "../hex/observable_value";

const updateReducer = (num: number): number => (num + 1) % 1_000_000;

export const useUpdate = () => {
  const [, update] = useReducer(updateReducer, 0);
  return update as () => void;
};

export function useAsyncValue<T>(observable: ObservableValue<T>) {
  const update = useUpdate();
  useEffect(() => {
    const unsubscribe = observable.onChange(update);
    return () => unsubscribe();
  }, [observable, update]);

  return observable.getValue();
}
