import {
  FieldErrorProps,
  Group,
  GroupProps,
  InputProps as AriaInputProps,
  LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  Text,
  TextProps,
  composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { composeTailwindRenderProps } from "./utils";
import { RefCallBack } from "react-hook-form";
import { fieldGroupStyles } from "./styles/fieldGroupStyles";
import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        "text-sm text-black font-light cursor-default w-fit",
        props.className
      )}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-sm text-gray-600", props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-error-red text-sm"
      )}
    />
  );
}

export interface AnimatedFieldErrorProps
  extends HTMLAttributes<HTMLSpanElement> {
  isInvalid: boolean | undefined;
  children: ReactNode;
}

export function AnimatedFieldError({
  isInvalid,
  children,
  ...props
}: AnimatedFieldErrorProps) {
  return (
    <AnimatePresence>
      {isInvalid && (
        <motion.span
          {...(props as HTMLMotionProps<"span">)}
          className={twMerge(props.className, "text-error-red text-sm")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

interface FieldGroupErrorProps {
  children: ReactNode;
  className?: string;
}

const fieldGroupErrorStyles = tv({
  base: "text-error-red text-sm",
});

export function FieldGroupError({ children, className }: FieldGroupErrorProps) {
  if (!children) return null;
  return <div className={fieldGroupErrorStyles({ className })}>{children}</div>;
}

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className })
      )}
    />
  );
}

export interface InputProps extends AriaInputProps {
  inputRef?: RefCallBack;
}

export const Input = (props: InputProps) => {
  // Destructure inputRef from props to prevent it from being passed to DOM
  const { inputRef, ...inputProps } = props;

  return (
    <RACInput
      {...inputProps}
      ref={inputRef}
      className={composeTailwindRenderProps(props.className, "px-2 py-1.5")}
      placeholder={props.placeholder}
    />
  );
};
