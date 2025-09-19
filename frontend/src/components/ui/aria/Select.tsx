import { LuChevronDown } from "react-icons/lu";
import {
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  Button,
  ListBox,
  ListBoxItemProps,
  SelectValue,
} from "react-aria-components";
import { AnimatedFieldError, Description } from "./Field";
import { DropdownItem, DropdownSection, DropdownSectionProps } from "./ListBox";
import { Popover } from "./Popover";
import { composeTailwindRenderProps } from "./utils";
import { twMerge } from "tailwind-merge";
import { ReactNode, RefObject, useState } from "react";
import { RefCallBack } from "react-hook-form";
import { createLabel } from "./utils/createLabel";
import { selectButtonStyles } from "./styles/selectButtonStyles";

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  inputRef?: RefCallBack;
  listBoxRef?: RefObject<HTMLDivElement | null>;
  listBoxClassNames?: string;
  buttonClassNames?: () => string;
  customSelectValue?: ReactNode;
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  isInvalid,
  isRequired,
  inputRef,
  listBoxRef,
  listBoxClassNames = "max-h-[inherit]",
  buttonClassNames,
  customSelectValue,
  placeholder,
  children,
  items,
  ...props
}: SelectProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 relative h-full"
      )}
      isInvalid={isInvalid}
      onFocusChange={setIsFocused}
      ref={inputRef}
    >
      {createLabel({ label, isRequired, isFocused, isInvalid })}
      <Button
        className={buttonClassNames ? buttonClassNames : selectButtonStyles}
      >
        <SelectValue className="flex-1 text-sm placeholder-shown:italic">
          {({ defaultChildren, isPlaceholder }) => {
            return isPlaceholder ? (
              <>
                {placeholder ? (
                  <>
                    <b>{placeholder}</b> selection
                  </>
                ) : (
                  <p className="font-light not-italic">Select...</p>
                )}
              </>
            ) : (
              <>{customSelectValue ? customSelectValue : defaultChildren}</>
            );
          }}
        </SelectValue>
        <LuChevronDown
          stroke="var(--color-brand-colour-5)"
          strokeWidth={3}
          className="scale-115 group-disabled:text-gray-200"
        />
      </Button>
      {description && <Description>{description}</Description>}
      <AnimatedFieldError isInvalid={isInvalid}>
        {errorMessage}
      </AnimatedFieldError>
      <Popover className="min-w-(--trigger-width)">
        <ListBox
          ref={listBoxRef}
          items={items}
          className={twMerge(
            "outline-hidden p-1 overflow-auto",
            listBoxClassNames
          )}
          // It ensures that the ListBox is clipped with a .75rem radius, even if the underlying content extends beyond that.
          // Cleanly hides any overflow, preventing visual glitches.
          // [clip-path:insert(0_0_0_0_round_.75rem)]
        >
          {children as (item: object) => ReactNode}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return <DropdownItem {...props} />;
}

export function SelectSection<T extends object>(
  props: DropdownSectionProps<T>
) {
  return <DropdownSection {...props} />;
}
