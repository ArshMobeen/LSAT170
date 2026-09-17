import { createContext, useContext } from "react";
import { useReducedMotion } from "motion/react";
export const MotionPreference = createContext(false);
export function useCalmMotion() {
  const chosen = useContext(MotionPreference);
  const system = useReducedMotion();
  return chosen || system;
}
