import { LuChevronDown } from "react-icons/lu";
import {
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  Button,
  ListBox,
  ListBoxItemProps,
  SelectValue,
  ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Description, FieldError, Label } from "./Field";
import { DropdownItem, DropdownSection, DropdownSectionProps } from "./ListBox";
import { Popover } from "./Popover";
import { composeTailwindRenderProps } from "./utils";
import { twMerge } from "tailwind-merge";
import { ReactNode, RefObject } from "react";

const styles = tv({
  base: "flex items-center text-start gap-4 w-full cursor-default px-2 py-1",
  variants: {
    isDisabled: {
      false: "text-gray-800 hover:bg-gray-100 group-invalid:border-error-red",
      true: "text-gray-200",
    },
    isFocused: {
      true: "ring-[2px] ring-brand-focus outline-none transition-shadow",
    },
  },
});

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  listBoxRef?: RefObject<HTMLDivElement | null>;
  listBoxClassNames?: string;
  buttonClassNames?: () => string;
  customSelectValue?: ReactNode;
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
}

export function Select<T extends Object>({
  label,
  description,
  errorMessage,
  listBoxRef,
  listBoxClassNames = "max-h-[inherit]",
  buttonClassNames,
  customSelectValue,
  placeholder,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 relative"
      )}
    >
      {label && <Label>{label}</Label>}
      <Button className={buttonClassNames ? buttonClassNames : styles}>
        <SelectValue className="flex-1 text-sm placeholder-shown:italic">
          {({ defaultChildren, isPlaceholder }) => {
            return isPlaceholder ? (
              <>
                {placeholder ? (
                  <>
                    <b>{placeholder}</b> selection
                  </>
                ) : (
                  <>Select...</>
                )}
              </>
            ) : (
              <>{customSelectValue ? customSelectValue : defaultChildren}</>
            );
          }}
        </SelectValue>
        <LuChevronDown className="w-4 h-4 text-gray-600 group-disabled:text-gray-200" />
      </Button>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
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
          {children}
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
