import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useCallback, useState, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface CheckIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: string | number;
  stroke?: string;
  strokeWidth?: number;
  playAnimation?: boolean | null;
}

const pathVariants: Variants = {
  normal: {
    opacity: 0,
    pathLength: 0,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.13,
      ease: "easeOut",
    },
  },
};

export const CheckIcon = ({
  className,
  size = 28,
  stroke = "currentColor",
  strokeWidth = 2,
  playAnimation = null,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CheckIconProps) => {
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          variants={pathVariants}
          initial="normal"
          animate={shouldAnimate ? "animate" : "normal"}
          d="M4 12 9 17L20 6"
        />
      </svg>
    </div>
  );
};

CheckIcon.displayName = "CheckIcon";
