import { useState, useRef } from "react";
import {
  useFloating,
  useHover,
  useRole,
  useInteractions,
  useClientPoint,
  useTransitionStyles,
  Placement,
  offset,
  FloatingArrow,
  arrow,
  autoUpdate,
} from "@floating-ui/react";

type MouseFollowingTooltipProps = {
  content: string | React.ReactNode;
  children: React.ReactNode;
  tooltipClass?: string;
  showArrow?: boolean;
  arrowFill?: string;
  hideCursor?: boolean;
  placement?: Placement;
  arrowHeight?: number;
  arrowWidth?: number;
};

const MouseFollowingTooltip: React.FC<MouseFollowingTooltipProps> = ({
  content,
  children,
  tooltipClass = `bg-[#F38181] text-white text-sm px-3 py-2 rounded-md`,
  showArrow = false,
  arrowFill = "#F38181",
  hideCursor = true,
  placement = "bottom",
  arrowHeight = 6,
  arrowWidth = 12,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(arrowHeight),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
  });

  const arrowX = middlewareData.arrow?.x ?? 0;
  const arrowY = middlewareData.arrow?.y ?? 0;
  const transformX = arrowX + arrowWidth / 2;
  const transformY = arrowY + arrowHeight;

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 120,
    initial: { opacity: 0, transform: "scale(0.8)" },
    open: { opacity: 1, transform: "scale(1)" },
    close: { opacity: 0, transform: "scale(0.8)" },
    common: ({ side }) => ({
      transformOrigin: {
        top: `${transformX}px calc(100% + ${arrowHeight}px)`,
        bottom: `${transformX}px ${-arrowHeight}px`,
        left: `calc(100% + ${arrowHeight}px) ${transformY}px`,
        right: `${-arrowHeight}px ${transformY}px`,
      }[side],
    }),
  });

  const clientPoint = useClientPoint(context, {
    axis: "both",
    enabled: isOpen,
  });

  const hover = useHover(context);

  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    clientPoint,
    role,
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`${hideCursor ? "cursor-none" : ""} h-full w-full`}
      >
        {children}
      </div>
      {isMounted && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="pointer-events-none"
        >
          <div
            style={styles}
            className={`${tooltipClass} origin-[center_top] will-change-transform`}
          >
            {showArrow && (
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill={arrowFill}
                width={arrowWidth}
                height={arrowHeight}
                tipRadius={2}
              />
            )}
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default MouseFollowingTooltip;
