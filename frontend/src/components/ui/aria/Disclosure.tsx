import { ReactNode, useContext } from "react";
import {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosureProps as AriaDisclosureProps,
  DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  DisclosurePanelProps as AriaDisclosurePanelProps,
  composeRenderProps,
  Heading,
  Button,
  DisclosureStateContext,
  DisclosureGroupStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { LuPlus } from "react-icons/lu";

const disclosure = tv({
  base: "group min-w-64",
  variants: {
    variant: {
      primary: "",
      secondary: "border border-2 border-brand-colour-5",
    },
    isInGroup: {
      true: "border-0 border-b last:border-b-0",
    },
  },
});

const disclosureButton = tv({
  extend: focusRing,
  base: "flex gap-2 items-center w-full text-start p-2 cursor-default",
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
}

export function DisclosureHeader({ children }: DisclosureHeaderProps) {
  const { isExpanded } = useContext(DisclosureStateContext)!;
  const isInGroup = useContext(DisclosureGroupStateContext) !== null;
  return (
    <Heading className="text-lg font-semibold">
      <Button
        slot="trigger"
        className={(renderProps) =>
          disclosureButton({ ...renderProps, isInGroup })
        }
      >
        {({ isDisabled }) => (
          <>
            <LuPlus
              aria-hidden
              className={chevron({ isExpanded, isDisabled })}
              strokeWidth={3}
            />
            {children}
          </>
        )}
      </Button>
    </Heading>
  );
}

export interface DisclosurePanelProps extends AriaDisclosurePanelProps {
  children: ReactNode;
}

export function DisclosurePanel({ children, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group-data-[expanded]:px-4 group-data-[expanded]:py-2"
      )}
    >
      {children}
    </AriaDisclosurePanel>
  );
}

export interface DisclosureGroupProps extends AriaDisclosureGroupProps {
  children: ReactNode;
}

export function DisclosureGroup({ children, ...props }: DisclosureGroupProps) {
  return (
    <AriaDisclosureGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "border border-brand-colour-5"
      )}
    >
      {children}
    </AriaDisclosureGroup>
  );
}
