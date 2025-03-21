import React, { forwardRef } from "react";
import { TransitionProps } from "@mui/material/transitions";

interface SlideProps extends TransitionProps {
  direction: "left" | "right" | "up" | "down"; // Direction for slide animation
}

// Custom Slide Transition Component
const Slide = forwardRef<HTMLDivElement, SlideProps>(function Slide(props, ref) {
  const { in: open, children, direction, timeout = 300, ...rest } = props;

  // Calculate enter and exit timeouts
  const enterTimeout = typeof timeout === "number" ? timeout : timeout.enter || 300;
  const exitTimeout = typeof timeout === "number" ? timeout : timeout.exit || 300;

  // Determine transform value based on direction and state
  const getTranslateValue = (dir: string, isEntering: boolean) => {
    switch (dir) {
      case "left":
        return isEntering ? "translateX(0)" : "translateX(100%)";
      case "right":
        return isEntering ? "translateX(0)" : "translateX(-100%)";
      case "up":
        return isEntering ? "translateY(0)" : "translateY(100%)";
      case "down":
        return isEntering ? "translateY(0)" : "translateY(-100%)";
      default:
        return "translateX(0)";
    }
  };

  const styles = {
    transform: open ? getTranslateValue(direction, true) : getTranslateValue(direction, false),
    transition: `transform ${open ? enterTimeout : exitTimeout}ms ease-in-out`,
  };

  return (
    <div ref={ref} style={styles} {...rest}>
      {children}
    </div>
  );
});

export default Slide;
