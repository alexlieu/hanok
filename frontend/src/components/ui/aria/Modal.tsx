import {
  ModalOverlay,
  ModalOverlayProps,
  Modal as RACModal,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";

const overlayStyles = tv({
  base: "fixed top-0 left-0 w-full h-(--visual-viewport-height) isolate z-20 bg-default-bg/10 flex items-center justify-center p-4 text-center backdrop-blur-lg",
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

interface ModalProps extends ModalOverlayProps, ModalVariants {
  className?: string;
}

export function Modal({
  className,
  size,
  isOpen,
  onOpenChange,
  isDismissable,
  ...props
}: ModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className={overlayStyles}
    >
      <RACModal {...props} className={modalStyles({ size, className })} />
    </ModalOverlay>
  );
}
