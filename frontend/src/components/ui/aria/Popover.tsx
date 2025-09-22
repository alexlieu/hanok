import {
  OverlayArrow,
  Popover as AriaPopover,
  PopoverProps as AriaPopoverProps,
  composeRenderProps,
  PopoverContext,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
  showArrow?: boolean;
  children: React.ReactNode;
}

const styles = tv({
  base: "bg-default-bg bg-clip-padding border-2 border-brand-colour-5 shadow-md max-h-[80vh] overflow-hidden duration-150 ease-out transition-transform",
  variants: {
    isEntering: {
      true: [
        "animate-in",
        "fade-in",
        "placement-bottom:slide-in-from-top-2",
        "placement-top:slide-in-from-bottom-2",
        "placement-left:slide-in-from-right-2",
        "placement-right:slide-in-from-left-2",
      ],
    },
    isExiting: {
      true: [
        "animate-out",
        "fade-out",
        "placement-bottom:slide-out-to-top-2",
        "placement-top:slide-out-to-bottom-2",
        "placement-left:slide-out-to-right-2",
        "placement-right:slide-out-to-left-2",
      ],
    },
  },
});

export function Popover({
  children,
  showArrow,
  className,
  ...props
}: PopoverProps) {
  const popoverContext = useSlottedContext(PopoverContext)!;
  const isSubmenu = popoverContext?.trigger === "SubmenuTrigger";
  let offset = showArrow ? 12 : 8;
  offset = isSubmenu ? offset - 6 : offset;
  return (
    <AriaPopover
      offset={offset}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        styles({ ...renderProps, className })
      )}
      style={{
        maxHeight: "80vh",
        ...props.style,
      }}
    >
      {showArrow && (
        <OverlayArrow className="group">
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className="block fill-white stroke-1 group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
      )}
      {children}
    </AriaPopover>
  );
}
