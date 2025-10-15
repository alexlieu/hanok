import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useContext,
  useState,
  useCallback,
  useRef,
  createContext,
} from "react";
import {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosureProps as AriaDisclosureProps,
  DisclosureGroupProps as AriaDisclosureGroupProps,
  composeRenderProps,
  Heading,
  Button,
  DisclosureStateContext,
  DisclosureGroupStateContext,
} from "react-aria-components";
import { Key } from "@react-types/shared";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { LuPlus } from "react-icons/lu";
import { AnimatePresence, motion, Variants } from "motion/react";
import { twMerge } from "tailwind-merge";

const DisclosureGroupInteractionContext = createContext<boolean>(false);
const DisclosureInteractionContext = createContext<boolean>(false);

const disclosure = tv({
  base: "group min-w-64",
  variants: {
    variant: {
      primary: "",
      secondary: "border border-2 border-brand-colour-5",
    },
    isInGroup: {
      true: "border-0 last:border-b-0",
    },
  },
});

const disclosureButton = tv({
  extend: focusRing,
  base: "flex gap-2 items-center w-fit text-start cursor-default",
  variants: {
    isDisabled: {
      true: "text-unavailable-text",
    },
    isInGroup: {
      true: "-outline-offset-2",
    },
  },
});

const chevron = tv({
  base: "w-5 h-5 transition-transform",
  variants: {
    isExpanded: {
      true: "rotate-45",
    },
    isDisabled: {
      true: "text-unavailable-text",
    },
  },
});

export interface DisclosureProps extends AriaDisclosureProps {
  /** @default 'primary' **/
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function Disclosure({ children, ...props }: DisclosureProps) {
  const isInGroup = useContext(DisclosureGroupStateContext) !== null;
  //                      ^^^^^^  what?
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  return (
    <DisclosureInteractionContext.Provider value={hasUserInteracted}>
      <AriaDisclosure
        {...props}
        className={composeRenderProps(
          props.className,
          (className, renderProps) =>
            disclosure({ ...renderProps, isInGroup, className })
        )}
        onExpandedChange={() => {
          if (!hasUserInteracted) {
            setHasUserInteracted(true);
          }
        }}
      >
        {children}
      </AriaDisclosure>
    </DisclosureInteractionContext.Provider>
  );
}

export interface DisclosureHeaderProps {
  children: ReactNode;
  variant?: "primary";
}

const iconVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
  },
  focus: {
    scale: 1.1,
  },
  pressed: {
    scale: 0.9,
  },
  expanded: {
    rotate: 45,
    color: "var(--color-brand-colour-1)",
  },
  collapsed: {
    rotate: 0,
    color: "var(--color-tooltip-bg)",
  },
};

export function DisclosureHeader({
  variant = "primary",
  children,
}: DisclosureHeaderProps) {
  const { isExpanded } = useContext(DisclosureStateContext)!;
  const isInGroup = useContext(DisclosureGroupStateContext) !== null;

  const baseAnimationState = isExpanded ? "expanded" : "collapsed";

  return (
    <Heading className="text-lg font-semibold">
      <Button
        slot="trigger"
        className={(renderProps) =>
          disclosureButton({ ...renderProps, isInGroup })
        }
      >
        {({ isDisabled, isFocusVisible, isHovered, isPressed }) => {
          // If a single animation state is set, it becomes an either/or situation when selecting animation states.
          // A both/and situation is needed which is why an array of variant names need to be passed to the animate prop.
          const animationStates = [baseAnimationState];
          if (isPressed) {
            animationStates.push("pressed");
          } else if (isHovered) {
            animationStates.push("hover");
          } else if (isFocusVisible) {
            animationStates.push("focus");
          }
          return (
            <>
              {variant === "primary" && (
                <motion.div
                  className="flex items-center justify-center"
                  variants={iconVariants}
                  animate={animationStates}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                  }}
                  initial={false}
                >
                  <LuPlus
                    aria-hidden
                    className={chevron({ isDisabled })}
                    strokeWidth={3.5}
                  />
                </motion.div>
              )}
              {children}
            </>
          );
        }}
      </Button>
    </Heading>
  );
}

export interface DisclosurePanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  scrollIntoView?: boolean;
}

export function DisclosurePanel({
  children,
  scrollIntoView = false,
  ...props
}: DisclosurePanelProps) {
  const { isExpanded } = useContext(DisclosureStateContext)!;
  const isInGroup = useContext(DisclosureGroupStateContext) !== null;
  const panelRef = useRef<HTMLDivElement>(null);

  const groupHasInteracted = useContext(DisclosureGroupInteractionContext);
  const standaloneHasInteracted = useContext(DisclosureInteractionContext);

  const hasBeenInteractedWith = isInGroup
    ? groupHasInteracted
    : standaloneHasInteracted;

  const handleAnimationComplete = () => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Due to the overflow hidden styling on the div, the focus ring is being cutoff.
  // The workaround is to increase the width of the div beyond the width of its container and
  // add padding to its content.
  const X_OFFSET_PX = 5;

  return (
    <AnimatePresence initial={false}>
      {isExpanded ? (
        <motion.div
          style={{ "--x-offset": `${X_OFFSET_PX}px` } as CSSProperties}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "fit-content",
            opacity: 1,
            transition: {
              height: { duration: 0.35, ease: "easeInOut" },
              opacity: { duration: 0.45, ease: "easeInOut", delay: 0.1 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
              opacity: { duration: 0.3, ease: "easeInOut" },
            },
          }}
          onAnimationComplete={
            scrollIntoView && hasBeenInteractedWith
              ? handleAnimationComplete
              : undefined
          }
          className={`overflow-hidden w-[calc(100%+var(--x-offset)*2)] -mx-[var(--x-offset)]`}
        >
          <div
            ref={panelRef}
            {...props}
            className={twMerge(props.className, `py-2 px-[var(--x-offset)]`)}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export interface DisclosureGroupProps extends AriaDisclosureGroupProps {
  children: ReactNode;
  requiresOneOpen?: boolean;
}

export function DisclosureGroup({
  children,
  requiresOneOpen = false,
  expandedKeys: controlledExpandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
  ...props
}: DisclosureGroupProps) {
  // Internal state for uncontrolled mode
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Set<Key>>(
    defaultExpandedKeys ? new Set(defaultExpandedKeys) : new Set()
  );

  // Use controlled or uncontrolled state
  const isControlled = controlledExpandedKeys !== undefined;
  const expandedKeys = isControlled
    ? controlledExpandedKeys
    : internalExpandedKeys;

  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleExpandedChange = useCallback(
    (keys: Set<Key>) => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }

      if (requiresOneOpen && keys.size === 0) {
        return;
      }

      if (!isControlled) {
        setInternalExpandedKeys(keys);
      }

      if (onExpandedChange) {
        onExpandedChange(keys);
      }
    },
    [requiresOneOpen, isControlled, onExpandedChange, hasUserInteracted]
  );

  return (
    <DisclosureGroupInteractionContext.Provider value={hasUserInteracted}>
      <AriaDisclosureGroup
        {...props}
        expandedKeys={expandedKeys}
        onExpandedChange={handleExpandedChange}
        className={composeTailwindRenderProps(props.className, "")}
      >
        {children}
      </AriaDisclosureGroup>
    </DisclosureGroupInteractionContext.Provider>
  );
}
