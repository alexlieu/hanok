import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { easeInOutExpo } from "../../utils/ease";
import { useEffect } from "react";

type NavMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
const NavMenu = ({ isOpen, onClose, children }: NavMenuProps) => {
  // Need to add focus inside menu when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const menuWrapper = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 text-3xl font-dm-sans backdrop-blur-3xl flex flex-row justify-between p-10"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ ease: easeInOutExpo, duration: 0.5 }}
          role="dialog"
          aria-modal={true}
          aria-labelledby="mobile-nav-menu"
          tabIndex={-1}
        >
          <nav>{children}</nav>
          <button onClick={onClose} className="h-fit text-xl cursor-pointer">
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return createPortal(menuWrapper, document.body);
};

export default NavMenu;
