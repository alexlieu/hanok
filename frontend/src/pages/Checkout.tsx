import { useLoaderData, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../utils/hooks/useWindowDimensions";
import { CheckoutRequiredData } from "../types/CheckoutType";
import { CheckoutSession } from "../components/checkout/CheckoutSession";
import { Button } from "../components/ui/aria/Button";
import { FaChevronLeft } from "react-icons/fa";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const checkoutRequiredData = useLoaderData() as CheckoutRequiredData;

  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[80%] max-w-5xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-default-bg">
          <div className="mx-auto">
            <div className="flex items-center justify-between h-[4.5rem] relative">
              <Button
                className="flex gap-1 text-[0.8rem] group"
                variant="icon"
                onClick={() => navigate("/basket")}
              >
                <FaChevronLeft
                  size="0.8rem"
                  className="group-hover:translate-x-[-0.15rem] delay-150 ease-out transition-transform"
                />
                <span>back to basket</span>
              </Button>
              <h1 className="text-3xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                checkout
              </h1>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className={`${isSmallScreen ? "space-y-6" : "flex gap-[4rem]"}`}>
          <CheckoutSession checkoutData={checkoutRequiredData} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
