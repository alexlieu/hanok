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
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Button } from "./aria/Button";
import { twMerge } from "tailwind-merge";

type ToolTipProps = {
  children: ReactNode;
  toolTipIcon?: ReactNode;
  placement?: Placement;
  arrowWidth?: number;
  arrowHeight?: number;
  gap?: number;
  className?: string;
};

const Tooltip: React.FC<ToolTipProps> = ({
  children,
  className,
  toolTipIcon = (
    <IoMdInformationCircleOutline className="w-[1lh] h-[1lh] text-brand-colour-2" />
  ),
  placement = "top",
  arrowWidth = 10,
  arrowHeight = 7,
  gap = 0,
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
    delay: { close: 230 },
  });
  const click = useClick(context, { ignoreMouse: true });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: "label",
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
        {...getReferenceProps}
        className={twMerge(
          className,
          "w-fit h-fit hover:bg-transparent pressed:bg-transparent p-0"
        )}
      >
        {toolTipIcon}
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
              className="p-3 text-sm transition-opacity bg-brand-colour-5 max-w-[250px]"
            >
              {children}
              <FloatingArrow
                ref={arrowRef}
                context={context}
                width={arrowWidth}
                height={arrowHeight}
                tipRadius={2}
                className="fill-brand-colour-5"
              />
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
