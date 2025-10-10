import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
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
import { BiChevronDown } from "react-icons/bi";

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
  return (
    <AriaDisclosure
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        disclosure({ ...renderProps, isInGroup, className })
      )}
    >
      {children}
    </AriaDisclosure>
  );
}

export interface DisclosureHeaderProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
}

const MotionPlus = motion.create(LuPlus);

const iconVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
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

  const animationState = isExpanded ? "expanded" : "collapsed";

  return (
    <Heading className="text-lg font-semibold">
      <motion.div
        initial="rest"
        whileHover="hover"
        whileTap="pressed"
        className="w-fit"
      >
        <Button
          slot="trigger"
          className={(renderProps) =>
            disclosureButton({ ...renderProps, isInGroup })
          }
        >
          {({ isDisabled }) => (
            <>
              {variant === "primary" && (
                <MotionPlus
                  aria-hidden
                  className={chevron({ isDisabled })}
                  strokeWidth={3.5}
                  variants={iconVariants}
                  animate={animationState}
                  transition={{
                    rotate: {
                      duration: 0.05,
                      ease: "easeOut",
                    },
                    color: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                    scale: {
                      duration: 0.01,
                    },
                  }}
                  initial={false}
                />
              )}
              {variant === "tertiary" && (
                <div className="flex-shrink-0 h-[0.9rem] w-[0.9rem] border-2 border-brand-colour-5 rounded-full flex items-center justify-center relative">
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[0.5rem] w-[0.5rem] bg-brand-colour-2 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
              {children}
              {variant === "secondary" && (
                <BiChevronDown
                  aria-hidden
                  strokeWidth={2}
                  color="var(--color-tooltip-bg)"
                />
              )}
            </>
          )}
        </Button>
      </motion.div>
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
  const panelRef = useRef<HTMLDivElement>(null);
  const { isExpanded } = useContext(DisclosureStateContext)!;

  const wasExpanded = useRef<boolean>(isExpanded);

  const handleAnimationComplete = () => {
    if (!wasExpanded.current && panelRef.current) {
      panelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    wasExpanded.current = isExpanded;
  }, [isExpanded]);

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
            scrollIntoView ? handleAnimationComplete : undefined
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

  const handleExpandedChange = useCallback(
    (keys: Set<Key>) => {
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
    [requiresOneOpen, isControlled, onExpandedChange]
  );

  return (
    <AriaDisclosureGroup
      {...props}
      expandedKeys={expandedKeys}
      onExpandedChange={handleExpandedChange}
      className={composeTailwindRenderProps(props.className, "")}
    >
      {children}
    </AriaDisclosureGroup>
  );
}
