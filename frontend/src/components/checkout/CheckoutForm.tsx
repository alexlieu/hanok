import { useState } from "react";
import PaymentForm from "./PaymentForm";
import CustomerForm from "./CustomerForm";
import { AccordianItem } from "../ui/AccordianItem";

const CheckoutForm: React.FC = () => {
  const [customerFormOpen, setCustomerFormOpen] = useState(true);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);

  const openPaymentForm = () => {
    setPaymentFormOpen((prevVal) => !prevVal);
  };

  const openCustomerForm = () => {
    setCustomerFormOpen((prevVal) => !prevVal);
  };

  // useEffect(() => {
  //   const subscription = watch((data) => {
  //     console.log(data);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);
  // console.log("Touched fields: ", touchedFields);
  // console.log("Dirty fields: ", dirtyFields);
  // console.log("Errors:", errors);

  return (
    <div className="mx-auto px-10 border-r-2">
      <AccordianItem
        title="Contact details"
        isExpanded={customerFormOpen}
        onToggle={() => openCustomerForm()}
      >
        <CustomerForm />
      </AccordianItem>
      <AccordianItem
        title="Payment form"
        isExpanded={paymentFormOpen}
        onToggle={() => openPaymentForm()}
      >
        <PaymentForm />
      </AccordianItem>
    </div>
  );
};

export default CheckoutForm;
