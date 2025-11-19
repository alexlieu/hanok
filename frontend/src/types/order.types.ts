import { CalendarDate, ZonedDateTime } from "@internationalized/date";
import { PAYMENT_METHODS } from "../schemas/CustomerFormSchema";

export type PaymentMethod = Uppercase<
  (typeof PAYMENT_METHODS)[number]["value"]
>;

export interface OrderRequest {
  fullName: string;
  orderItems: OrderItemRequest[];
  payment: PaymentRequest;
  pickupDate: string;
  pickupSlot: string;
  customerId?: string;
  phoneNumber?: string;
  email?: string;
  specialInstructions?: string;
}

export interface OrderItemRequest {
  productVariantId: number;
  quantity: number;
  notes?: string;
}

export interface PaymentRequest {
  total: number;
  paymentMethod: PaymentMethod;
  paymentToken?: string;
  cardDetails?: CardDetailsRequest;
}

export interface CardDetailsRequest {
  cardNumber: string;
  holderName: string;
  expiration: string;
  cvv: string;
  billingAddress: BillingAddressRequest;
}

export interface BillingAddressRequest {
  addressLine1: string;
  postalCode: string;
  country: string;
  addressLine2?: string;
  stateProvinceRegion?: string;
  county?: string;
  city?: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "CANCELLED"
  | "COMPLETED";

export interface OrderSuccessRawResponse {
  orderStatus: OrderStatus;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  pickupSlot: string;
  maskedCardNo: string;
  orderItems: OrderItemRawResponse[];
  total: number;
  specialInstructions: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  pickupDateTime: string;
  orderDateTime: string;
}

export interface OrderItemRawResponse {
  productName: string;
  variantConfig: ProductVariantConfig;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
}

export interface OrderResponse {
  orderStatus: OrderStatus;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  pickupSlot: string;
  maskedCardNo: string;
  orderItems: OrderItemResponse[];
  total: string;
  specialInstructions: string;
  customerName: string;
  email?: string;
  phoneNumber?: string;
  pickupDateTime: CalendarDate;
  orderDateTime: ZonedDateTime;
}

export interface OrderItemResponse {
  productName: string;
  variantConfig: ProductVariantConfig;
  unitPrice: string;
  quantity: number;
  itemTotal: string;
}

export interface ProductVariantConfig {
  size: string;
  flavour: string;
}

export interface ValidationError {
  code: string;
  message: string;
  parameters: Record<string, unknown>;
}

export interface CodedError {
  timestamp: string;
  status: string;
  statusCode: number;
  error: string;
  message: string;
  path: string;
  code: string;
}

export interface BackendErrorResponse {
  timestamp: string;
  status: string;
  statusCode: number;
  error: string;
  message?: string;
  path: string;
  code: string;
  validationErrors?: Record<string, ValidationError[]>;
}
