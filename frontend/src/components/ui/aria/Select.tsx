import { LuChevronDown } from "react-icons/lu";
import {
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  Button,
  ListBox,
  SelectValue,
} from "react-aria-components";
import { AnimatedFieldError, Description } from "./Field";
import {
  DropdownItem,
  DropdownItemProps,
  DropdownSection,
  DropdownSectionProps,
} from "./ListBox";
import { composeTailwindRenderProps } from "./utils";
import { twMerge } from "tailwind-merge";
import { ReactNode, RefObject, useState, useEffect, useRef } from "react";
import { RefCallBack } from "react-hook-form";
import { createLabel } from "./utils/createLabel";
import { selectButtonStyles } from "./styles/selectButtonStyles";
import { Popover } from "./Popover";
import { tv } from "tailwind-variants";

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  inputRef?: RefCallBack;
  listBoxRef?: RefObject<HTMLDivElement | null>;
  listBoxClassNames?: string;
  buttonClassNames?: () => string;
  customSelectValue?:
    | ReactNode
    | ((renderProps: { isHovered: boolean; isFocused: boolean }) => ReactNode);
  items?: Iterable<T>;
  widePopover?: boolean;
  children: ReactNode | ((item: T) => ReactNode);
  defaultChevron?: boolean;
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  isInvalid,
  isRequired,
  inputRef,
  listBoxRef,
  listBoxClassNames = "max-h-60",
  buttonClassNames,
  customSelectValue,
  placeholder,
  children,
  items,
  widePopover = false,
  defaultChevron = true,
  ...props
}: SelectProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const internalListBoxRef = useRef<HTMLDivElement>(null);

  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const actualListBoxRef = listBoxRef || internalListBoxRef;

  const handleScroll = () => {
    setIsScrolling(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && actualListBoxRef.current && props.value) {
      const selectedItem = actualListBoxRef.current?.querySelector<HTMLElement>(
        `[data-key="${props.value}"]`
      );
      if (selectedItem) {
        const listBox = actualListBoxRef.current;
        const itemRect = selectedItem.getBoundingClientRect();
        const listBoxRect = listBox.getBoundingClientRect();

        const isItemVisible =
          itemRect.top >= listBoxRect.top &&
          itemRect.bottom <= listBoxRect.bottom;

        if (!isItemVisible) {
          const itemOffsetTop = selectedItem.offsetTop;
          const itemHeight = selectedItem.offsetHeight;
          const listBoxHeight = listBox.clientHeight;

          const targetScrollTop =
            itemOffsetTop - listBoxHeight / 2 + itemHeight / 2;

          listBox.scrollTop = Math.max(0, targetScrollTop);
        }
      }
    }
  }, [isOpen, props.value, actualListBoxRef]);

  const popoverStyle = tv({
    base: "min-w-(--trigger-width)",
    variants: {
      isWide: {
        true: "w-63",
      },
    },
  });

  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 relative h-full"
      )}
      isInvalid={isInvalid}
      onFocusChange={setIsFocused}
      onOpenChange={setIsOpen}
      ref={inputRef}
    >
      {createLabel({ label, isRequired, isFocused, isInvalid })}
      <Button
        className={buttonClassNames ? buttonClassNames : selectButtonStyles}
      >
        {({ isHovered, isFocused }) => (
          <>
            <SelectValue className="flex-1 text-sm placeholder-shown:italic truncate">
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
                  <span
                    className="truncate"
                    title={
                      typeof defaultChildren === "string"
                        ? defaultChildren
                        : undefined
                    }
                  >
                    {typeof customSelectValue === "function"
                      ? customSelectValue({
                          isHovered,
                          isFocused,
                        })
                      : customSelectValue
                      ? customSelectValue
                      : defaultChildren}
                  </span>
                );
              }}
            </SelectValue>
            {defaultChevron ? (
              <LuChevronDown
                stroke="var(--color-brand-colour-5)"
                strokeWidth={3}
                className="scale-115 group-disabled:text-gray-200"
              />
            ) : undefined}
          </>
        )}
      </Button>
      {description && <Description>{description}</Description>}
      <AnimatedFieldError isInvalid={isInvalid} children={errorMessage} />
      <Popover className={popoverStyle({ isWide: widePopover })}>
        <ListBox
          onWheel={handleScroll}
          ref={actualListBoxRef}
          items={items}
          className={twMerge(
            "outline-hidden p-1 overflow-auto transition-colors",
            "group",
            "scrollbar-thin scrollbar-track-transparent",
            `${
              isScrolling
                ? "scrollbar-thumb-brand-colour-4"
                : "scrollbar-thumb-default-scrollbar-thumb"
            }`,
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

export function SelectItem(props: DropdownItemProps) {
  return <DropdownItem {...props} />;
}

export function SelectSection<T extends object>(
  props: DropdownSectionProps<T>
) {
  return <DropdownSection {...props} />;
}
