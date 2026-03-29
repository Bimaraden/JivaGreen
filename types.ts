
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum WasteStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  AVAILABLE = 'AVAILABLE',
  PENDING_PICKUP = 'PENDING_PICKUP',
  PICKED_UP = 'PICKED_UP',
  RECYCLED = 'RECYCLED',
  SOLD = 'SOLD'
}

export interface EcoStats {
  treesGrown: number;
  leavesCount: number;
  co2Saved: number;
  waterSaved: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  role: UserRole;
  avatar?: string;
  ecoStats: EcoStats;
  joinedAt: string;
  isBlocked?: boolean;
}

export interface Waste {
  id: string;
  title: string;
  material: string;
  price: number;
  condition: string;
  sellerId: string;
  sellerName: string;
  status: WasteStatus;
  imageUrl: string;
  description: string;
  availableAt?: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
  isRecycle?: boolean;
  composition?: { material: string; percentage: number }[];
}

export interface EnvironmentalData {
  aqi: number;
  temp: number;
  humidity: number;
  condition: string;
  location: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  points: number;
  amount: number;
  method: string;
  accountNumber: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  date: string;
}
