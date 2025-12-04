import type { Transition } from "motion/react";
import type { HTMLAttributes } from "react";
import { useState } from "react";
import { motion } from "motion/react";

export interface ExpandIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ExpandIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  playAnimation?: boolean;
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

const ExpandIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  playAnimation,
  ...props
}: ExpandIconProps) => {
  const [isInternalHover, setIsInternalHover] = useState(false);
  const isControlled = playAnimation !== undefined;
  const shouldAnimate = isControlled ? playAnimation : isInternalHover;

  const currentVariant = shouldAnimate ? "open" : "closed";

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled) setIsInternalHover(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled) setIsInternalHover(false);
    onMouseLeave?.(e);
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"
          transition={defaultTransition}
          variants={{
            closed: { translateX: "0%", translateY: "0%" },
            open: { translateX: "2px", translateY: "2px" },
          }}
          animate={currentVariant}
          initial={false}
        />
        <motion.path
          d="M3 16.2V21m0 0h4.8M3 21l6-6"
          transition={defaultTransition}
          variants={{
            closed: { translateX: "0%", translateY: "0%" },
            open: { translateX: "-2px", translateY: "2px" },
          }}
          animate={currentVariant}
          initial={false}
        />
        <motion.path
          d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
          transition={defaultTransition}
          variants={{
            closed: { translateX: "0%", translateY: "0%" },
            open: { translateX: "2px", translateY: "-2px" },
          }}
          animate={currentVariant}
          initial={false}
        />
        <motion.path
          d="M3 7.8V3m0 0h4.8M3 3l6 6"
          transition={defaultTransition}
          variants={{
            closed: { translateX: "0%", translateY: "0%" },
            open: { translateX: "-2px", translateY: "-2px" },
          }}
          animate={currentVariant}
          initial={false}
        />
      </svg>
    </div>
  );
};

export { ExpandIcon };
