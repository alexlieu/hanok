import { useFormContext } from "react-hook-form";
import { CheckoutFormValues } from "../../../../schemas/CheckoutSchema";
import { debounce } from "../../../debounce";
import { useMemo } from "react";

const DEBOUNCE_DELAY = 300;

/**
 * Creates a debounced function that will trigger validation for the given field names after a delay.
 *
 * @returns A debounced function that will trigger the given field validations after a delay.
 */
export const useDebouncedFormTrigger = () => {
  const { trigger } = useFormContext<CheckoutFormValues>();

  const debouncedValidate = useMemo(
    () =>
      debounce((fieldNames: (keyof CheckoutFormValues)[]) => {
        trigger(fieldNames);
      }, DEBOUNCE_DELAY),
    [trigger]
  );

  return debouncedValidate;
};
