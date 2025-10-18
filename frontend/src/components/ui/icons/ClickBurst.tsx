import { motion, Variants } from "motion/react";
import { HTMLAttributes } from "react";

interface ClickBurstIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: string | number;
  stroke?: string;
  strokeWidth?: number;
  playAnimation?: boolean;
}

const startPath = "M16 10 16 6";
const endPath = "M16 8 16 4";

const pathVariants: Variants = {
  hidden: {
    opacity: 0,
    d: startPath,
  },
  visible: {
    opacity: [1, 1, 0],
    d: endPath,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const rotations = [0, 60, 120, 180, 240, 300];

export const ClickBurstIcon = ({
  size = 28,
  stroke = "currentColor",
  playAnimation = false,
  strokeWidth = 2,
}: ClickBurstIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {rotations.map((angle) => (
        <motion.path
          key={angle}
          d={startPath}
          variants={pathVariants}
          initial="hidden"
          animate={playAnimation ? "visible" : "hidden"}
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
    </svg>
  );
};
