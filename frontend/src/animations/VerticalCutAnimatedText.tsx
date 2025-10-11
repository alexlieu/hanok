import { motion, Variants } from "motion/react";

type AnimationProps = {
  text: string;
  splitType?: "letter" | "word";
  className?: string;
  staggerFrom?: "first" | "last" | "middle" | "random" | number;
  playAnimation?: boolean;
};

const kerningMap: { [key: string]: string } = {
  Y: "-0.15em",
  T: "-0.08em",
  V: "-0.08em",
  W: "-0.08em",
  A: "-0.08em",
};

const containerVariants: Variants = {
  hidden: {},
  visible: (i: number = 1) => ({
    transition: {
      staggerChildren: i / 2,
    },
  }),
};

const itemVariants: Variants = {
  hidden: {
    y: "-100%",
  },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 230,
      damping: 25,
      duration: 0.3,
    },
  },
};

export const VerticalCutAnimatedText = ({
  text,
  splitType = "letter",
  className,
  playAnimation = true,
}: AnimationProps) => {
  const splitText = splitType === "word" ? text.split(/(\s+)/) : text.split("");
  const staggerSpeed = splitType === "word" ? 0.1 : 0.03;

  return (
    <div className={`relative ${className}`}>
      <span
        className={`absolute top-0 ${
          splitType === "word" ? "left-0" : "left-0.5"
        } text-transparent`}
      >
        {text}
      </span>
      <motion.div
        aria-hidden={true}
        role="heading"
        variants={containerVariants}
        custom={staggerSpeed}
        initial={playAnimation ? "hidden" : false}
        animate="visible"
        className={`select-none`}
      >
        {splitText.map((item, index) => {
          const marginRight = kerningMap[item];
          return (
            <div
              key={`${item}-${index}`}
              className="overflow-hidden inline-block"
              style={{ marginRight }}
            >
              <motion.span className="inline-block" variants={itemVariants}>
                {item === " " ? "\u00A0" : item}
              </motion.span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
