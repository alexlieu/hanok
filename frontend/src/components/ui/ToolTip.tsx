import { useState, useRef } from "react";
import {
  FloatingPortal,
  FloatingArrow,
  arrow,
  useTransitionStyles,
  useClick,
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
import { HiQuestionMarkCircle } from "react-icons/hi";

type ToolTipProps = {
  message: string;
};

const ToolTip: React.FC<ToolTipProps> = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);

  const ARROW_HEIGHT = 7;
  const GAP = 0;

  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(ARROW_HEIGHT + GAP),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: {
      open: 200,
      close: 100,
    },
    initial: { opacity: 0, transform: "scale(0.8)" },
    open: { opacity: 1, transform: "scale(1)" },
    close: { opacity: 0, transform: "scale(0.8)" },
  });

  const hover = useHover(context, { move: false, mouseOnly: true });
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
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps()}
        className="rounded-full focus:ring-3 focus:ring-brand-focus/50 outline-none size-4 my-auto"
      >
        <HiQuestionMarkCircle className="text-stone-500" />
      </button>
      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div
              style={{ ...styles }}
              className="rounded-sm bg-brand-focus py-3 px-4 text-sm text-white shadow-md transition-opacity duration-300 ease-in-out max-w-2xs text-pretty mr-5"
            >
              {message}
              <FloatingArrow
                ref={arrowRef}
                context={context}
                height={ARROW_HEIGHT}
                tipRadius={2}
                className="fill-brand-focus"
              />
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default ToolTip;
