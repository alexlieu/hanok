import { motion, Variants } from "motion/react";

interface SelectIndicatorIconProps {
  isSelected: boolean;
  isDisabled?: boolean;
  className?: string;
}

const innerCircleVariants: Variants = {
  hidden: {
    scale: 0.7,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
  },
};

export const SelectIndicatorIcon = ({
  isSelected,
  isDisabled = false,
  className,
}: SelectIndicatorIconProps) => {
  return (
    <motion.svg className={className} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="var(--color-brand-colour-5)"
        strokeWidth="2"
      />
      <motion.circle
        cx="12"
        cy="12"
        r="7"
        fill={
          isDisabled
            ? "var(--color-unavailable)"
            : "var(--color-brand-colour-2)"
        }
        strokeWidth="2"
        variants={innerCircleVariants}
        initial="hidden"
        animate={isSelected ? "visible" : "hidden"}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />
    </motion.svg>
  );
};
