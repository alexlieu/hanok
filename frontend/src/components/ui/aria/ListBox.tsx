import { FaCheck } from "react-icons/fa";
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxProps as AriaListBoxProps,
  Collection,
  Header,
  ListBoxItemProps,
  ListBoxSection,
  SectionProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "./utils";

interface ListBoxProps<T>
  extends Omit<AriaListBoxProps<T>, "layout" | "orientation"> {}

export function ListBox<T extends object>({
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "outline-0 p-1 border border-gray-300"
      )}
    >
      {children}
    </AriaListBox>
  );
}

export const itemStyles = tv({
  extend: focusRing,
  base: "group relative flex items-center gap-8 cursor-default select-none will-change-transform text-sm",
  variants: {
    isSelected: {
      false: "text-slate-700 hover:bg-slate-300",
      true: "bg-brand-colour-2 text-white",
    },
    isDisabled: {
      true: "text-slate-300",
    },
  },
});

export function ListBoxItem(props: ListBoxItemProps) {
  let textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className={itemStyles}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <div className="absolute left-4 right-4 bottom-0 h-px bg-white/20" />
        </>
      ))}
    </AriaListBoxItem>
  );
}

export const dropDownItemStyles = tv({
  base: "group flex item-center gap-5 py-0.5 px-1 cursor-default select-none text-sm focus:outline-none",
  variants: {
    isDisabled: {
      false: "text-gray-900",
      true: "text-gray-300",
    },
    isSelected: {
      true: "",
    },
    isFocused: {
      true: "bg-brand-colour-2 text-white",
    },
  },
  compoundVariants: [
    {
      isFocused: false,
      isOpen: true,
      className: "bg-gray-100",
    },
  ],
});

export function DropdownItem(props: ListBoxItemProps) {
  let textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={dropDownItemStyles}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex items-center flex-1 gap-2 font-normal truncate group-selected:font-semibold">
            {children}
          </span>
          <span className="flex items-center w-5">
            {isSelected && <FaCheck width={4} height={4} />}
          </span>
        </>
      ))}
    </AriaListBoxItem>
  );
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string;
  items?: any;
}

export function DropdownSection<T extends object>(
  props: DropdownSectionProps<T>
) {
  return (
    <ListBoxSection className="first:-mt-[5px] after:content-[''] after:block after:h-[5px]">
      <Header className="text-sm font-semibold text-gray-500 truncate sticky z-100 -top-[5px] -mt-px mx-0.5 bg-gray-100/60 backdrop-blur-md border-y border-y-gray-200">
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </ListBoxSection>
  );
}
