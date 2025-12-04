import { useEffect, useState, type HTMLAttributes } from "react";
import {
  motion,
  useAnimation,
  type Transition,
  type Variants,
} from "motion/react";

interface ShrinkIconProps extends HTMLAttributes<HTMLDivElement> {
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
  open: { x: "0px", y: "0px" },
  closed: { x: `${xDir}px`, y: `${yDir}px` },
  peek: {
    x: ["0px", `${xDir}px`, "0px"],
    y: ["0px", `${yDir}px`, "0px"],
    transition: PEEK_TRANSITION,
  },
});

const ShrinkIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  isHovered,
  isFocusVisible,
  ...props
}: ShrinkIconProps) => {
  const [isInternalHover, setIsInternalHover] = useState(false);
  const controls = useAnimation();

  const activeHover = isHovered !== undefined ? isHovered : isInternalHover;

  // This can be thought of as the "action manager" that runs whenever anything changes.
  // It follows a strict hierarchy that prioritises hover interactions over focus interactions.
  useEffect(() => {
    if (activeHover) {
      controls.start("closed");
      return;
    }

    if (isFocusVisible) {
      controls.start("peek");
    } else {
      controls.start("open");
    }

    if (!activeHover && !isFocusVisible) {
      controls.start("open");
    }
  }, [activeHover, isFocusVisible, controls]);

  // When 'isFocusVisible' stays true, but 'activeHover' changes false -> true -> false,
  // we need to ensure we don't re-trigger 'peek'.
  // The useEffect above might re-trigger peek on unhover.
  // We can fix this by splitting the effects.
  useEffect(() => {
    // Handle Hover Changes
    if (activeHover) {
      controls.start("closed");
    } else {
      controls.start("open");
    }
  }, [activeHover, controls]);

  useEffect(() => {
    // Handle Focus Event ONLY when not hovered.
    // Only fires when 'isFocusVisible' changes, NOT when the hover state changes.
    if (isFocusVisible && !activeHover) {
      controls.start("peek");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusVisible, controls]); // Removing activeHover from dependency here prevents re-fire on unhover

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
        {/* Top Left (Moves Down/Right) */}
        <motion.path
          d="M9 4.2V9m0 0H4.2M9 9 3 3"
          transition={SPRING_TRANSITION}
          variants={getVariants(1, 1)}
          animate={controls}
          initial="open"
        />
        {/* Top Right (Moves Down/Left) */}
        <motion.path
          d="M15 4.2V9m0 0h4.8M15 9l6-6"
          transition={SPRING_TRANSITION}
          variants={getVariants(-1, 1)}
          animate={controls}
          initial="open"
        />
        {/* Bottom Left (Moves Up/Right) */}
        <motion.path
          d="M9 19.8V15m0 0H4.2M9 15l-6 6"
          transition={SPRING_TRANSITION}
          variants={getVariants(1, -1)}
          animate={controls}
          initial="open"
        />
        {/* Bottom Right (Moves Up/Left) */}
        <motion.path
          d="m15 15 6 6m-6-6v4.8m0-4.8h4.8"
          transition={SPRING_TRANSITION}
          variants={getVariants(-1, -1)}
          animate={controls}
          initial="open"
        />
      </svg>
    </div>
  );
};

export { ShrinkIcon };
