import { motion } from "motion/react";

interface ChevronBackProps {
  size?: string | number;
  strokeWidth?: string | number;
  className?: string;
  stroke?: string;
}

export const ChevronBack = ({
  size,
  strokeWidth,
  className,
  stroke,
}: ChevronBackProps) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size || "100%"}
      height={size || "100%"}
      viewBox="0 0 7 12"
      version="1.1"
      xmlSpace="preserve"
      style={{ fillRule: "evenodd", clipRule: "evenodd", strokeMiterlimit: 2 }}
      className={className}
      stroke={stroke || "var(--color-brand-colour-5)"}
      variants={{
        hover: {
          x: -2,
          stroke: "var(--color-default-bg)",
        },
      }}
      transition={{
        x: { type: "spring", stiffness: 500, damping: 20 },
        stroke: { ease: "easeOut", duration: 0.1 },
      }}
    >
      <path
        style={{
          fill: "none",
          strokeWidth: strokeWidth || "1.04px",
        }}
        d="M5.165,9.165c-0,0 -3.449,-3.449 -3.942,-3.942c-0.015,-0.015 -0.024,-0.036 -0.024,-0.058c-0,-0.022 0.009,-0.043 0.024,-0.058c0.493,-0.493 3.942,-3.942 3.942,-3.942"
      />
    </motion.svg>
  );
};
