import type { Transition, Variants } from "motion/react";
import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";

interface ExpandIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isHovered?: boolean;
  isFocusVisible?: boolean;
}

const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

const PEEK_TRANSITION: Transition = {
  type: "tween",
  duration: 0.5,
  ease: "easeInOut",
};

const getVariants = (xDir: number, yDir: number): Variants => ({
  closed: { translateX: "0px", translateY: "0px" },
  open: { translateX: `${xDir}px`, translateY: `${yDir}px` },
  peek: {
    translateX: ["0px", `${xDir}px`, "0px"],
    translateY: ["0px", `${yDir}px`, "0px"],
    transition: PEEK_TRANSITION,
  },
});

const ExpandIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  isHovered,
  isFocusVisible,
  ...props
}: ExpandIconProps) => {
  const [isInternalHover, setIsInternalHover] = useState(false);
  const controls = useAnimation();

  const activeHover = isHovered !== undefined ? isHovered : isInternalHover;

  useEffect(() => {
    if (activeHover) {
      controls.start("open");
      return;
    }

    if (isFocusVisible) {
      controls.start("peek");
    } else {
      controls.start("closed");
    }

    if (!activeHover && !isFocusVisible) {
      controls.start("closed");
    }
  }, [activeHover, isFocusVisible, controls]);

  useEffect(() => {
    if (activeHover) {
      controls.start("open");
    } else {
      controls.start("closed");
    }
  });

  useEffect(() => {
    if (isFocusVisible && !activeHover) {
      controls.start("peek");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusVisible, controls]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isHovered === undefined) setIsInternalHover(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isHovered === undefined) setIsInternalHover(false);
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
          transition={SPRING_TRANSITION}
          variants={getVariants(2, 2)}
          animate={controls}
          initial={false}
        />
        <motion.path
          d="M3 16.2V21m0 0h4.8M3 21l6-6"
          transition={SPRING_TRANSITION}
          variants={getVariants(-2, 2)}
          animate={controls}
          initial={false}
        />
        <motion.path
          d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
          transition={SPRING_TRANSITION}
          variants={getVariants(2, -2)}
          animate={controls}
          initial={false}
        />
        <motion.path
          d="M3 7.8V3m0 0h4.8M3 3l6 6"
          transition={SPRING_TRANSITION}
          variants={getVariants(-2, -2)}
          animate={controls}
          initial={false}
        />
      </svg>
    </div>
  );
};

export { ExpandIcon };
