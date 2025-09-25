import PaymentForm, { PaymentFormRef } from "./PaymentForm";
import CustomerForm, { CustomerFormRef } from "./CustomerForm";
import { Button } from "../ui/aria/Button";
import { useRef, useState } from "react";

interface FormRefs {
  customerForm: CustomerFormRef | null;
  paymentForm: PaymentFormRef | null;
}

const CheckoutForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  /**
   * This is the hover state for the button.
   * It is used to force the hover state to be applied when the button is hovered.
   * This is necessary because react-aria's hover state is not applied when the mouse is stationary over the button while it transitions from disabled to enabled.
   */
  const [isHovered, setIsHovered] = useState(false);
  const formRefs = useRef<FormRefs>({
    customerForm: null,
    paymentForm: null,
  });

  const isPhysicallyHovered = useRef(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Add a small delay to ensure UI shows loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const customerValid =
        await formRefs.current.customerForm?.triggerSubmit();
      const paymentValid = await formRefs.current.paymentForm?.triggerSubmit();

      if (!customerValid || !paymentValid) {
        console.log("Form validation failed");
        setIsSubmitting(false);
        return;
      }

      const customerData = formRefs.current.customerForm?.getValues();
      const paymentData = formRefs.current.paymentForm?.getValues();

      const orderData = {
        customer: customerData,
        payment: paymentData,
      };

      console.log("Submitting order:", orderData);
    } catch (error) {
      console.error("Order submission failed:", error);
    } finally {
      setIsSubmitting(false);
      if (isPhysicallyHovered.current) {
        setIsHovered(true);
      }
    }
  };

  return (
    <div className="mx-auto px-10">
      <CustomerForm
        ref={(ref) => {
          formRefs.current.customerForm = ref;
        }}
      />
      <PaymentForm
        ref={(ref) => {
          formRefs.current.paymentForm = ref;
        }}
      />
      <div
        className="relative inline-block"
        onMouseEnter={() => {
          isPhysicallyHovered.current = true;
          if (!isSubmitting) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          isPhysicallyHovered.current = false;
          setIsHovered(false);
        }}
      >
        <Button
          key={`button-${isSubmitting}`}
          variant="secondary"
          type="submit"
          className={
            isHovered && !isSubmitting
              ? "bg-black text-default-bg border-black"
              : undefined
          }
          onClick={handleSubmit}
          isDisabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
