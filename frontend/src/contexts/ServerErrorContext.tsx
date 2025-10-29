import { createContext } from "react";
import { CodedError, ValidationError } from "../types/order.types";

export type ServerErrorState = {
  validationErrors: Record<string, ValidationError[]>;
  codedError: CodedError | null;
};

export const ServerErrorContext = createContext<ServerErrorState>({
  validationErrors: {},
  codedError: null,
});
