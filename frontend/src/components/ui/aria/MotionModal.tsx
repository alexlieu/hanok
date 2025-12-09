import { animate, AnimatePresence, motion } from "motion/react";
import {
  Modal as RACModal,
  ModalOverlay,
  ModalOverlayProps,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";

const overlayStyles = tv({
  base: "fixed top-0 left-0 w-full h-(--visual-viewport-height) isolate z-20 bg-default-bg/10 flex items-center justify-center p-4 text-center",
});

const modalStyles = tv({
  base: "w-full max-h-full bg-white forced-colors:bg-[Canvas] text-left align-middle text-slate-700 shadow-2xl bg-clip-padding border border-black/10",
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

const AnimatedModal = motion.create(RACModal);
const AnimatedModalOverlay = motion.create(ModalOverlay);

const root = document.body.firstElementChild as HTMLElement;

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
  useEffect(() => {
    if (!root) return;
    if (isOpen) {
      animate(
        root,
        { scale: 0.95, overflow: "hidden" },
        { type: "spring", stiffness: 400, damping: 30 }
      );
    } else {
      animate(
        root,
        { scale: 1 },
        { type: "spring", stiffness: 400, damping: 30 }
      );
    }
  }, [isOpen]);
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <AnimatedModalOverlay
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={isDismissable}
          className={overlayStyles}
          initial={{ backdropFilter: "blur(8px)" }}
          animate={{ backdropFilter: "blur(8px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
        >
          <AnimatedModal
            {...props}
            className={twMerge(modalStyles({ size }), className)}
          />
        </AnimatedModalOverlay>
      )}
    </AnimatePresence>
  );
};

export { MotionModal };
