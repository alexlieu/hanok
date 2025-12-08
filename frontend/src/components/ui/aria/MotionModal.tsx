import { AnimatePresence, easeOut, motion } from "motion/react";
import {
  Modal as RACModal,
  ModalOverlay,
  ModalOverlayProps,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";

const overlayStyles = tv({
  base: "fixed top-0 left-0 w-full h-(--visual-viewport-height) isolate z-20 bg-default-bg/10 flex items-center justify-center p-4 text-center backdrop-blur-lg",
});

const modalStyles = tv({
  base: "w-full max-h-full bg-white dark:bg-zinc-800/70 dark:backdrop-blur-2xl dark:backdrop-saturate-200 forced-colors:bg-[Canvas] text-left align-middle text-slate-700 dark:text-zinc-300 shadow-2xl bg-clip-padding border border-black/10 dark:border-white/10",
  variants: {
    size: {
      xs: "max-w-xs",
      md: "max-w-md",
      lg: "max-w-lg",
      full: "max-w-none w-auto",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ModalVariants = VariantProps<typeof modalStyles>;

const AnimatedModal = motion(RACModal);
const AnimatedModalOverlay = motion(ModalOverlay);

// Motion and react-aria-components have namespace collisions on specific event prop names.
type ConflictingProps =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "style";

interface MotionModalProps
  extends Omit<ModalOverlayProps, ConflictingProps>,
    ModalVariants {
  className?: string;
  onExitComplete?: () => void;
}

const MotionModal = ({
  className,
  size,
  isOpen,
  onOpenChange,
  isDismissable,
  onExitComplete,
  ...props
}: MotionModalProps) => {
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <AnimatedModalOverlay
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={isDismissable}
          className={overlayStyles}
        >
          <AnimatedModal
            {...props}
            className={modalStyles({ size, className })}
            initial={{ filter: "blur(2px)", y: 10 }}
            animate={{ filter: "blur(0px)", y: 0 }}
            exit={{ filter: "blur(2px)", y: 10 }}
            transition={{ ease: easeOut, duration: 0.1 }}
          />
        </AnimatedModalOverlay>
      )}
    </AnimatePresence>
  );
};

export { MotionModal };
