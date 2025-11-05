import { AnimatePresence, motion } from "motion/react";
import { WarningIcon } from "./icons/WarningIcon";
import { useServerErrors } from "../../utils/hooks/features/checkout/useServerErrors";

interface ServerErrorMessageProps {
  show: boolean;
  message: string | undefined;
}

const ServerErrorMessage = ({ show, message }: ServerErrorMessageProps) => {
  const serverErrors = useServerErrors();
  const shouldShake = serverErrors.playErrorAnimation ?? false;
  const onShakeComplete = serverErrors.onErrorAnimationComplete;

  return (
    <>
      <AnimatePresence mode="wait">
        {show && (
          <motion.p
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="col-span-2 text-error-red text-sm flex items-center gap-2 font-medium pb-3 pl-1"
          >
            <WarningIcon
              fill="var(--color-error-red)"
              size="1rem"
              shake={shouldShake}
              onAnimationComplete={onShakeComplete}
            />
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServerErrorMessage;
