import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useContext,
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

const DisclosureRadioContext = createContext<RadioRenderProps | null>(null);
const DisclosureRadioGroupInteractionContext = createContext<boolean>(false);

interface DisclosureRadioProps extends AriaRadioProps {
  children: ReactNode;
  panelContent?: ReactNode;
}

export const DisclosureRadio = (props: DisclosureRadioProps) => {
  const { selectedValue } = useContext(RadioGroupStateContext) ?? {};
  const isSelected = selectedValue === props.value;
  return (
    <>
      <div className="w-fit">
        <AriaRadio {...props} className={"group"}>
          {(renderProps) => (
            <DisclosureRadioContext.Provider value={renderProps}>
              {props.children}
            </DisclosureRadioContext.Provider>
          )}
        </AriaRadio>
      </div>
      {props.panelContent && (
        <DisclosureRadioPanel isExpanded={isSelected}>
          {props.panelContent}
        </DisclosureRadioPanel>
      )}
    </>
  );
};

interface DisclosureRadioHeaderProps {
  children: ReactNode;
}

export const DisclosureRadioHeader = ({
  children,
}: DisclosureRadioHeaderProps) => {
  const { isSelected, isDisabled } = useContext(DisclosureRadioContext) ?? {};
  return (
    <div className="flex gap-2 items-center w-fit">
      <SelectIndicatorIcon
        isSelected={!!isSelected}
        isDisabled={isDisabled}
        className={twMerge([
          "w-[1rem] h-[1rem]",
          "group-focus-visible:outline-transparent group-focus-visible:ring-2",
          "group-focus-visible:ring-brand-focus group-focus-visible:ring-offset-2 transition-shadow",
        ])}
      />
      {children}
    </div>
  );
};

interface DisclosureRadioPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  scrollIntoView?: boolean;
  isExpanded: boolean;
}

const DisclosureRadioPanel = ({
  children,
  scrollIntoView = true,
  isExpanded,
  ...props
}: DisclosureRadioPanelProps) => {
  const hasUserInteracted = useContext(DisclosureRadioGroupInteractionContext);
  const panelRef = useRef<HTMLDivElement>(null);
  const X_OFFSET_PX = 5;
  const handleAnimationComplete = () => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
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
            scrollIntoView && hasUserInteracted
              ? handleAnimationComplete
              : undefined
          }
          className={`overflow-hidden w-[calc(100%+var(--x-offset)*2)] -mx-[var(--x-offset)]`}
        >
          <div
            ref={panelRef}
            {...props}
            className={twMerge(props.className, `py-2 px-[var(--x-offset)]`)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
