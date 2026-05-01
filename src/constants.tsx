
import { Waste, WasteStatus, User, UserRole } from './types';

export const POINT_CONVERSION_RATE = 100; // 1 point = 100 IDR (20 points = 2000 IDR)

// Fix: Add missing ecoStats and joinedAt properties to MOCK_USER
export const MOCK_USER: User = {
  id: 'u1',
  name: 'Budi Santoso',
  email: 'budi@example.com',
  points: 450,
  role: UserRole.USER,
  avatar: 'https://picsum.photos/seed/budi/100/100',
  ecoStats: { treesGrown: 45, leavesCount: 10, co2Saved: 27, waterSaved: 150 },
  joinedAt: '2024-01-01T00:00:00.000Z'
};

// Fix: Add missing ecoStats and joinedAt properties to MOCK_ADMIN
export const MOCK_ADMIN: User = {
  id: 'admin1',
  name: 'Admin WasteFlow',
  email: 'admin@wasteflow.com',
  points: 0,
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/seed/admin/100/100',
  ecoStats: { treesGrown: 100, leavesCount: 1000, co2Saved: 2700, waterSaved: 5000 },
  joinedAt: '2023-12-01T00:00:00.000Z'
};

export const MOCK_WASTES: Waste[] = [
  {
    id: 'b1',
    title: 'Kardus Bekas',
    material: 'Kertas/Karton',
    price: 5000,
    condition: 'Kering',
    sellerId: 'u1',
    sellerName: 'Budi Santoso',
    status: WasteStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/seed/cardboard/300/400',
    description: 'Kardus bekas packing, bersih dan kering.',
    createdAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'b2',
    title: 'Koran Bekas',
    material: 'Kertas',
    price: 3000,
    condition: 'Rapi',
    sellerId: 'u2',
    sellerName: 'Siti Aminah',
    status: WasteStatus.PENDING_PICKUP,
    imageUrl: 'https://picsum.photos/seed/newspaper/300/400',
    description: 'Kumpulan koran bekas bertumpuk rapi.',
    createdAt: '2024-01-11T00:00:00.000Z'
  },
  {
    id: 'b3',
    title: 'Kaleng Soda',
    material: 'Aluminium',
    price: 8000,
    condition: 'Pipih',
    sellerId: 'u1',
    sellerName: 'Budi Santoso',
    status: WasteStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/seed/cans/300/400',
    description: 'Kaleng aluminium sudah dipipihkan.',
    createdAt: '2024-01-12T00:00:00.000Z'
  }
];
