import PaymentForm from "./PaymentForm";
import CustomerForm from "./CustomerForm";
import { Button } from "../ui/aria/Button";

const CheckoutForm: React.FC = () => {
  return (
    <div className="mx-auto px-10">
      <CustomerForm />
      <PaymentForm />
      <div className="relative inline-block">
        <Button variant="secondary" type="submit">
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
