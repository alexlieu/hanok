import PaymentForm from "./PaymentForm";
import CustomerForm from "./CustomerForm";
import { Controller } from "react-hook-form";
import { TextArea } from "../ui/aria/TextArea";
import { useFormContext } from "react-hook-form";
import { Disclosure, DisclosureHeader } from "../ui/aria/Disclosure";
import { DisclosurePanel } from "../ui/aria/Disclosure";

const CheckoutForm: React.FC = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col w-full space-y-[1.3rem]">
      <CustomerForm />
      <PaymentForm />
      <Disclosure>
        <DisclosureHeader>Add Special Instructions</DisclosureHeader>
        <DisclosurePanel scrollIntoView>
          <Controller
            name="specialInstructions"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => (
              <TextArea
                inputRef={ref}
                value={value || ""}
                onChange={onChange}
                onBlur={onBlur}
                aria-label="Special instructions"
                className={`w-full`}
                description="Please feel free to add any additional requests or requirements you may need for your order and we'll do our best to accommodate."
                errorMessage={error?.message}
                isInvalid={invalid}
              />
            )}
          />
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default CheckoutForm;
