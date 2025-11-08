import { useLoaderData, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../utils/hooks/useWindowDimensions";
import { CheckoutRequiredData } from "../types/CheckoutType";
import { CheckoutSession } from "../components/checkout/CheckoutSession";
import { Button } from "../components/ui/aria/Button";
import { ChevronBack } from "../components/ui/icons/ChevronBack";
import { motion } from "motion/react";
import { useEffect } from "react";
import { STICKY_HEADER_HEIGHT } from "../constants/layout";
import { CSSProperties } from "react";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const checkoutRequiredData = useLoaderData() as CheckoutRequiredData;

  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = STICKY_HEADER_HEIGHT;

    return () => {
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex justify-center mb-500">
      <div className="w-[80%] max-w-5xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-default-bg">
          <div className="mx-auto">
            <div
              className="flex items-center justify-between relative"
              style={{ height: STICKY_HEADER_HEIGHT } as CSSProperties}
            >
              <Button
                variant="icon"
                onClick={() => navigate("/basket")}
                className="p-0"
              >
                <motion.div
                  whileHover="hover"
                  className="flex gap-1 text-[0.8rem] items-center p-1"
                >
                  <ChevronBack size="0.8rem" strokeWidth={"1.8px"} />
                  <span>back to basket</span>
                </motion.div>
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
