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
  const formRefs = useRef<FormRefs>({
    customerForm: null,
    paymentForm: null,
  });

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Add a small delay to ensure UI shows loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
      <Button
        variant="secondary"
        type="submit"
        className="mt-7"
        onClick={handleSubmit}
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
};

export default CheckoutForm;
