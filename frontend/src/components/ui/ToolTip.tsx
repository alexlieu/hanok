import { useState, useRef, ReactNode } from "react";
import {
  FloatingPortal,
  FloatingArrow,
  arrow,
  useTransitionStyles,
  useClick,
  Placement,
} from "@floating-ui/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import { BiInfoSquare } from "react-icons/bi";
import { Button } from "./aria/Button";
import { twMerge } from "tailwind-merge";

type ToolTipProps = {
  children: ReactNode;
  toolTipIcon?: (isOpen: boolean) => ReactNode;
  placement?: Placement;
  arrowWidth?: number;
  arrowHeight?: number;
  gap?: number;
  className?: string;
  buttonAriaLabel?: string;
};

const Tooltip: React.FC<ToolTipProps> = ({
  children,
  className,
  toolTipIcon = (isOpen) => (
    <BiInfoSquare
      className={`w-[1lh] h-[1lh] transition-colors`}
      color={
        isOpen ? "var(--color-brand-colour-5)" : "var(--color-brand-colour-4)"
      }
      strokeWidth={0.6}
    />
  ),
  placement = "top",
  arrowWidth = 20,
  arrowHeight = 4,
  gap = 2,
  buttonAriaLabel = "More information",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const arrowRef = useRef(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(arrowHeight + gap),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  const arrowX = middlewareData.arrow?.x ?? 0;
  const arrowY = middlewareData.arrow?.y ?? 0;
  const transformX = arrowX + arrowWidth / 2;
  const transformY = arrowY + arrowHeight;

  const { isMounted, styles } = useTransitionStyles(context, {
    common: ({ side }) => ({
      transformOrigin: {
        top: `${transformX}px calc(100% + ${arrowHeight}px)`,
        bottom: `${transformX}px ${-arrowHeight}px`,
        left: `calc(100% + ${arrowHeight}px) ${transformY}px`,
        right: `${-arrowHeight}px ${transformY}px`,
      }[side],
    }),
    duration: {
      open: 270,
      close: 230,
    },
    initial: ({ side }) => ({
      opacity: 0,
      transform: {
        top: "translateY(3px)",
        bottom: "translateY(-3px)",
        left: "translateX(3px)",
        right: "translateX(-3px)",
      }[side],
    }),
    open: {
      opacity: 1,
      transform: "translateY(0) translateX(0)",
    },
    close: ({ side }) => ({
      opacity: 0,
      transform: {
        top: "translateY(3px)",
        bottom: "translateY(-3px)",
        left: "translateX(3px)",
        right: "translateX(-3px)",
      }[side],
    }),
  });

  const hover = useHover(context, {
    move: false,
    mouseOnly: true,
    delay: { open: 300, close: 450 },
  });
  const click = useClick(context, { ignoreMouse: true });
  const focus = useFocus(context, { visibleOnly: true });
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: "tooltip",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <Button
        type="button"
        variant="icon"
        ref={refs.setReference}
        {...getReferenceProps()}
        className={twMerge(
          className,
          "w-fit h-fit hover:bg-transparent pressed:bg-transparent p-0"
        )}
        aria-label={buttonAriaLabel}
      >
        {toolTipIcon(isOpen)}
      </Button>
      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-1000"
          >
            <div
              style={{ ...styles }}
              className="p-3 rounded-sm text-sm bg-brand-colour-4 text-default-bg max-w-[250px] drop-shadow-md"
            >
              {children}
              <FloatingArrow
                ref={arrowRef}
                context={context}
                width={arrowWidth}
                height={arrowHeight}
                fill={"var(--color-brand-colour-4)"}
                d="M0 20C1.3 20 3.051 19.709 4.246 18.943 5.547 18.009 6.175 17.075 7.492 15.436 8.151 14.563 8.916 14 10 14 11.084 14 11.849 14.563 12.508 15.436 13.825 17.075 14.463 18.009 15.754 18.943 16.949 19.709 18.7 20 20 20H0Z"
              />
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
