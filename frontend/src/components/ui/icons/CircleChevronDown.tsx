import type { Transition } from "motion/react";
import { motion } from "motion/react";
import type { HTMLAttributes } from "react";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

interface CircleChevronDownIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: string | number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  playAnimation?: boolean | null;
}

const defaultTransition: Transition = {
  times: [0, 0.2, 0.4, 1],
  duration: 0.5,
};

export const CircleChevronDownIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  fill,
  stroke,
  strokeWidth = 2,
  playAnimation = null,
  ...props
}: CircleChevronDownIconProps) => {
  const [isAnimationConditionMet, setIsAnimationConditionMet] = useState(false);
  const isControlled = playAnimation !== null;

  const shouldAnimate = isControlled ? playAnimation : isAnimationConditionMet;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsAnimationConditionMet(true);
      onMouseEnter?.(e);
    },
    [onMouseEnter]
  );
  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsAnimationConditionMet(false);
      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );
  return (
    <div
      className={twMerge(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        stroke={stroke || "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          normal: { fill: fill || "none" },
          animate: { fill: "var(--color-brand-colour-4)" },
        }}
        initial="normal"
        transition={{ duration: 0.1 }}
        animate={shouldAnimate ? "animate" : "normal"}
      >
        <circle cx="12" cy="12" r="10" />
        <motion.path
          variants={{
            normal: { y: 0, stroke: stroke || "currentColor" },
            animate: {
              y: [0, 2, 0],
              stroke: "var(--color-default-bg)",
            },
          }}
          transition={defaultTransition}
          animate={shouldAnimate ? "animate" : "normal"}
          d="m16 10-4 4-4-4"
        />
      </motion.svg>
    </div>
  );
};

CircleChevronDownIcon.displayName = "CircleChevronDownIcon";
