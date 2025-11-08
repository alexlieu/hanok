import { motion } from "motion/react";
import {
  createContext,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  RadioGroup as RACRadioGroup,
  RadioGroupProps as RACRadioGroupProps,
  Radio as AriaRadio,
  RadioProps as AriaRadioProps,
  RadioRenderProps,
  RadioGroupStateContext,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { SelectIndicatorIcon } from "../icons/SelectIndicatorIcon";
import { createNoFocusLabel } from "./utils/createLabel";
import { RefCallBack } from "react-hook-form";
import { Transition, Variants } from "framer-motion";

const DisclosureRadioContext = createContext<RadioRenderProps | null>(null);
const DisclosureRadioGroupInteractionContext = createContext<boolean>(false);

interface DisclosureRadioProps extends Omit<AriaRadioProps, "className"> {
  className?: string;
  children: ReactNode;
  panelContent?: ReactNode;
  panelTransition?: Transition;
  disableScrollTo?: boolean;
  scrollOffset?: number | string;
}

export const DisclosureRadio = (props: DisclosureRadioProps) => {
  const { selectedValue } = useContext(RadioGroupStateContext) ?? {};
  const isSelected = selectedValue === props.value;

  const headerRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollMarginTopValue =
    props.scrollOffset && props.scrollOffset !== 0
      ? typeof props.scrollOffset === "string"
        ? props.scrollOffset
        : `${props.scrollOffset}px`
      : undefined;

  return (
    <>
      <div
        className={props.className}
        ref={headerRef}
        style={{ scrollMarginTop: scrollMarginTopValue }}
      >
        <div className="w-full">
          <AriaRadio {...props} className={"group"}>
            {(renderProps) => (
              <DisclosureRadioContext.Provider value={renderProps}>
                {props.children}
              </DisclosureRadioContext.Provider>
            )}
          </AriaRadio>
        </div>
      </div>
      {props.panelContent && (
        <DisclosureRadioPanel
          isExpanded={isSelected}
          transition={props.panelTransition}
          onOpenComplete={props.disableScrollTo ? undefined : handleScrollTo}
        >
          {props.panelContent}
        </DisclosureRadioPanel>
      )}
    </>
  );
};

interface DisclosureRadioHeaderProps {
  children: ReactNode;
  rightSlot?: () => ReactNode | ReactNode;
  className?: string;
}

const headerVariant: Variants = {
  normal: {
    x: 0,
  },
  hover: (isSelected: boolean) => ({
    x: isSelected ? 0 : 3,
  }),
};

const headerTransition: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 20,
};

export const DisclosureRadioHeader = ({
  children,
  rightSlot,
  className,
}: DisclosureRadioHeaderProps) => {
  const { isSelected, isDisabled } = useContext(DisclosureRadioContext) ?? {};
  return (
    <motion.div
      className={twMerge("flex gap-2 items-center w-full", className)}
      whileHover={"hover"}
    >
      <motion.span
        variants={headerVariant}
        transition={headerTransition}
        custom={!!isSelected}
      >
        <SelectIndicatorIcon
          isSelected={!!isSelected}
          isDisabled={isDisabled}
          className={twMerge([
            "w-[1rem] h-[1rem]",
            "group-focus-visible:outline-transparent group-focus-visible:ring-2",
            "group-focus-visible:ring-brand-focus group-focus-visible:ring-offset-2 transition-shadow",
          ])}
        />
      </motion.span>
      <motion.span className="flex items-center justify-between w-full">
        <motion.span
          variants={headerVariant}
          transition={headerTransition}
          custom={!!isSelected}
        >
          {children}
        </motion.span>
        {rightSlot && rightSlot()}
      </motion.span>
    </motion.div>
  );
};

interface DisclosureRadioPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  scrollIntoView?: boolean;
  isExpanded: boolean;
  transition?: Transition;
  onOpenComplete?: () => void;
}

const DisclosureRadioPanel = ({
  children,
  scrollIntoView = true,
  isExpanded,
  transition = {
    ease: "easeOut",
    duration: 0.3,
  },
  onOpenComplete,
  ...props
}: DisclosureRadioPanelProps) => {
  const hasUserInteracted = useContext(DisclosureRadioGroupInteractionContext);
  const isInitialRender = useRef(true);
  const X_OFFSET_PX = 5;
  // Display state is used to prevent the panel from affecting the render flow when it is hidden.
  const [display, setDisplay] = useState<"block" | "hidden">(
    isExpanded ? "block" : "hidden"
  );

  const handleAnimationComplete = () => {
    if (isExpanded && onOpenComplete && hasUserInteracted) {
      onOpenComplete();
    }
    if (!isExpanded) {
      setDisplay("hidden");
    }
  };

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  const { onKeyDown: propsOnKeyDown, ...restProps } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Stop arrow key events from bubbling to RadioGroup when they originate from text inputs
    // This prevents the RadioGroup interpreting arrow keys as navigation commands when focused on a text input.
    if (
      (e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown") &&
      (e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement)
    ) {
      e.stopPropagation();
    }
    // Call any existing onKeyDown handler from props
    propsOnKeyDown?.(e);
  };

  return (
    <motion.div
      style={{ "--x-offset": `${X_OFFSET_PX}px` } as CSSProperties}
      className={`overflow-hidden w-[calc(100%+var(--x-offset)*2)] -mx-[var(--x-offset)] ${display}`}
      onPointerDown={(e) => e.stopPropagation()}
      animate={{
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
        pointerEvents: isExpanded ? "auto" : "none",
      }}
      transition={transition}
      initial={
        isInitialRender.current && isExpanded
          ? false
          : { height: 0, opacity: 0 }
      }
      onAnimationStart={() => setDisplay("block")}
      onAnimationComplete={
        scrollIntoView && hasUserInteracted
          ? handleAnimationComplete
          : undefined
      }
    >
      <div
        {...restProps}
        className={twMerge(props.className, `py-2 px-[var(--x-offset)]`)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </motion.div>
  );
};

interface DisclosureRadioGroupProps extends RACRadioGroupProps {
  children: ReactNode;
  label?: string;
  inputRef?: RefCallBack;
}

export const DisclosureRadioGroup = (props: DisclosureRadioGroupProps) => {
  const { children, label, isRequired, onChange, inputRef: ref } = props;
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  return (
    <DisclosureRadioGroupInteractionContext.Provider value={hasUserInteracted}>
      <RACRadioGroup
        ref={ref}
        {...props}
        onChange={(value) => {
          if (!hasUserInteracted) {
            setHasUserInteracted(true);
          }
          onChange?.(value);
        }}
      >
        {label &&
          createNoFocusLabel({
            label,
            isRequired,
            className: "lowercase tracking-wide text-lg font-medium",
          })}
        {children}
      </RACRadioGroup>
    </DisclosureRadioGroupInteractionContext.Provider>
  );
};
