import { useRef, useState } from "react";
import Apple from "../../assets/checkout_logos/payment-types/apple-pay-logo-dark.svg?react";
import Google from "../../assets/checkout_logos/payment-types/google-pay-logo-dark.svg?react";
import Modal from "../ui/Modal";
import { useClickOutside } from "../../utils/hooks/useClickOutside";

const EXPRESS_PAYMENT_OPTIONS = ["apple", "google"];

type ModalManagerType = "apple" | "google" | null;

const ExpressCheckout: React.FC = () => {
  const [modalManager, setModalManager] = useState<ModalManagerType>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useClickOutside(triggerRef, objectRef, () => setModalManager(null));

  return (
    <div className="flex flex-row justify-between w-full h-full">
      {EXPRESS_PAYMENT_OPTIONS.map((po) => (
        <button
          type="button"
          className="flex-1 m-[0.75em] py-2 scale-100 bg-black hover:bg-[#3c4043]"
          onClick={() =>
            setModalManager((prevState) =>
              prevState != po.toLowerCase() ? (po as ModalManagerType) : null
            )
          }
          ref={triggerRef}
        >
          {po === "apple" ? (
            <Apple className="h-[1.5em] m-auto" />
          ) : (
            <Google className="h-[1.5em] m-auto" />
          )}
        </button>
      ))}
      <Modal showModal={!!(modalManager !== null)}>
        <div
          ref={objectRef}
          className="h-[50vh] w-[80vw] max-w-[20em] py-5 px-10 font-dm-sans text-xl flex flex-col items-center"
        >
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() => setModalManager(null)}
              className="relative cursor-pointer"
            >
              <div
                className="
                w-[1.5em] h-[1.5em]

                before:content-[''] before:absolute
                before:w-full before:h-[3px]
                before:bg-black before:rounded-md
                before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                before:transform before:rotate-45

                after:content-[''] after:absolute
                after:w-full after:h-[3px]
                after:bg-black after:rounded-md
                after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                after:transform after:-rotate-45
              "
              ></div>
            </button>
          </div>
          <button
            type="button"
            className="border-2 p-2 hover:bg-black hover:text-white mt-10 w-[70%] active:rotate-1"
          >
            Pay with <span className="capitalize">{modalManager} Pay</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ExpressCheckout;
