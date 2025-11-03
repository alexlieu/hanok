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
import { Transition } from "framer-motion";

const DisclosureRadioContext = createContext<RadioRenderProps | null>(null);
const DisclosureRadioGroupInteractionContext = createContext<boolean>(false);

interface DisclosureRadioProps extends Omit<AriaRadioProps, "className"> {
  children: ReactNode;
  panelContent?: ReactNode;
  className?: string;
  panelTransition?: Transition;
}

export const DisclosureRadio = (props: DisclosureRadioProps) => {
  const { selectedValue } = useContext(RadioGroupStateContext) ?? {};
  const isSelected = selectedValue === props.value;
  return (
    <>
      <div className={props.className}>
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
}

export const DisclosureRadioHeader = ({
  children,
  rightSlot,
}: DisclosureRadioHeaderProps) => {
  const { isSelected, isDisabled } = useContext(DisclosureRadioContext) ?? {};
  return (
    <div className="flex gap-2 items-center w-full">
      <SelectIndicatorIcon
        isSelected={!!isSelected}
        isDisabled={isDisabled}
        className={twMerge([
          "w-[1rem] h-[1rem]",
          "group-focus-visible:outline-transparent group-focus-visible:ring-2",
          "group-focus-visible:ring-brand-focus group-focus-visible:ring-offset-2 transition-shadow",
        ])}
      />
      <div className="flex items-center justify-between w-full">
        {children}
        {rightSlot && rightSlot()}
      </div>
    </div>
  );
};

interface DisclosureRadioPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  scrollIntoView?: boolean;
  isExpanded: boolean;
  transition?: Transition;
}

const DisclosureRadioPanel = ({
  children,
  scrollIntoView = true,
  isExpanded,
  transition = {
    ease: "easeOut",
    duration: 0.3,
  },
  ...props
}: DisclosureRadioPanelProps) => {
  const hasUserInteracted = useContext(DisclosureRadioGroupInteractionContext);
  const panelRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const X_OFFSET_PX = 5;
  // Display state is used to prevent the panel from affecting the render flow when it is hidden.
  const [display, setDisplay] = useState<"block" | "hidden">(
    isExpanded ? "block" : "hidden"
  );

  const handleAnimationComplete = () => {
    if (isExpanded && panelRef.current) {
      panelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (!isExpanded) {
      setDisplay("hidden");
    }
  };

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  return (
    <motion.div
      ref={panelRef}
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
        {...props}
        className={twMerge(props.className, `py-2 px-[var(--x-offset)]`)}
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
