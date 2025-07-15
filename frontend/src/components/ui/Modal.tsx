import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  showModal: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, showModal }) => {
  if (showModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  const modalOverlay = (
    <div className="fixed inset-0 flex justify-center items-center z-[1000] backdrop-blur-xs bg-gray-600/50">
      {children}
    </div>
  );
  return <>{showModal && createPortal(modalOverlay, document.body)}</>;
};

export default Modal;
