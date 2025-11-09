import { motion, Transition } from "motion/react";

const shakeTransition: Transition = {
  duration: 0.6,
  ease: "easeInOut",
};

interface WarningIconProps {
  fill?: string;
  size?: string | number;
  shake?: boolean;
  onAnimationComplete?: () => void;
}

export const WarningIcon = ({
  fill,
  size,
  shake = false,
  onAnimationComplete,
}: WarningIconProps) => {
  return (
    <motion.svg
      animate={shake ? { x: [0, -1, 1, -1, 1, 0] } : { x: 0 }}
      transition={shakeTransition}
      onAnimationComplete={shake ? onAnimationComplete : undefined}
      width={size || "100%"}
      height={size || "100%"}
      viewBox="0 0 1712 1712"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: "1.5",
      }}
    >
      <circle
        cx="855.583"
        cy="855.583"
        r="767"
        className={
          fill ? `stroke-[${fill}] fill-none` : "stroke-black fill-none"
        }
        style={{
          strokeWidth: "177.17px",
        }}
      />
      <motion.g
        className={fill ? `fill-[${fill}]` : "fill-black"}
        animate={shake ? { rotate: [0, -7, 7, -7, 7, 0] } : { rotate: 0 }}
        transition={shakeTransition}
      >
        <path d="M912.513,303.006c16.024,0 31.361,6.512 42.49,18.041c11.129,11.529 17.095,27.086 16.529,43.101c-4.599,130.068 -15.296,432.606 -19.761,558.89c-1.124,31.783 -27.215,56.968 -59.018,56.968l-74.915,-0c-31.824,0 -57.925,-25.218 -59.02,-57.023c-4.349,-126.334 -14.765,-428.87 -19.241,-558.89c-0.551,-16.005 5.422,-31.548 16.55,-43.065c11.128,-11.517 26.456,-18.022 42.471,-18.022l113.917,-0Z" />
        <circle cx="855.583" cy="1212.333" r="135.827" />
      </motion.g>
    </motion.svg>
  );
};
