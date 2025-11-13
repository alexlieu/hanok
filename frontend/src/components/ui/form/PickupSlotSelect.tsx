import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CheckoutFormValues } from "../../../schemas/CheckoutSchema";
import { SelectItem } from "../aria/Select";
import { Select } from "../aria/Select";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../../types/CheckoutType";
import { useServerErrors } from "../../../utils/hooks/features/checkout/useServerErrors";
import { useMemo } from "react";
import { DayOfWeek, getDayOfWeek } from "@internationalized/date";
import { borderedSelectButtonStyles } from "../aria/styles/borderedSelectButtonStyles";

const PickupSlotSelect = () => {
  const {
    pickupRules: { pickupSlots, openingHours },
  } = useLoaderData<CheckoutRequiredData>();
  const serverErrors = useServerErrors();
  const { control } = useFormContext<CheckoutFormValues>();
  const selectedPickupDate = useWatch({ control, name: "pickupDate" });

  const openingHoursMap = useMemo(() => {
    return new Map(
      openingHours.map((hour) => [
        hour.dayOfWeek,
        { start: hour.start, end: hour.end },
      ])
    );
  }, [openingHours]);

  const selectedDayOpeningHours = selectedPickupDate
    ? openingHoursMap.get(
        getDayOfWeek(selectedPickupDate, "en-GB") as unknown as DayOfWeek
      )
    : undefined;
  const availablePickupSlots = selectedDayOpeningHours
    ? pickupSlots.filter(
        (slot) =>
          slot.end.compare(selectedDayOpeningHours.end) < 0 &&
          slot.start.compare(selectedDayOpeningHours.start) > 0
      )
    : [];

  return (
    <div>
      <Controller
        name="pickupSlot"
        control={control}
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { invalid, error },
          formState: { errors },
        }) => {
          const zodError = error?.message;
          const serverError =
            serverErrors.validationErrors.pickupSlot?.[0]?.message;
          const errorMessage = zodError || serverError;
          const invalidState = !!(invalid || serverError);
          const slotOptions = errors.pickupDate ? [] : availablePickupSlots;
          return (
            <Select
              label="Pickup Time"
              buttonClassNames={borderedSelectButtonStyles}
              isRequired
              isInvalid={invalidState}
              isDisabled={!!errors.pickupDate}
              errorMessage={errorMessage}
              inputRef={ref}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            >
              {slotOptions.map(({ value, label }) => {
                return (
                  <SelectItem key={value} id={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </Select>
          );
        }}
      />
    </div>
  );
};

export default PickupSlotSelect;
