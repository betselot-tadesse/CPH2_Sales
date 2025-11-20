export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  servedWith?: string;
  isVeg: boolean;
  isSpicy: boolean;
}

export enum CallOutcome {
  Picked = "Picked",
  NotPicked1 = "Not Picked (Attempt 1)",
  NotPicked2 = "Not Picked (Attempt 2)",
  NotPickedFinal = "Not Picked (Final)",
}

export enum OrderStatus {
  Ordered = "Ordered",
  NotOrdered = "Not Ordered",
  NoResponse = "No Response", // For not picked
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface CallRecord {
  id: string;
  roomNumber: string;
  timestamp: number;
  callAttempt: number;
  outcome: CallOutcome;
  orderStatus: OrderStatus;
  orderedItems: OrderItem[];
  totalAmount: number;
}

export interface DailyStats {
  totalRoomsCalled: number;
  totalPicked: number;
  totalOrders: number;
  totalNotPicked: number;
  totalNotOrdered: number;
  totalRevenue: number;
  conversionRate: number;
}