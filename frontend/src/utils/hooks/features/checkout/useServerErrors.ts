import { useContext } from "react";
import { ServerErrorContext } from "../../../../contexts/ServerErrorContext";

export const useServerErrors = () => {
  const context = useContext(ServerErrorContext);
  if (!context) {
    throw new Error(
      "useServerErrors must be used within a ServerErrorProvider"
    );
  }
  return context;
};
