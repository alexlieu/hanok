import { createContext } from "react";
import { ValidationError } from "../types/order.types";

export type ServerErrorState = Record<string, ValidationError[]>;

export const ServerErrorContext = createContext<ServerErrorState>({});
