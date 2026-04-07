export interface Restaurant {
  id: string;
  name: string;
  photo: string;
  rating: number;
  priceLevel: number;
  distance: string;
  cuisine: string;
  address: string;
  lat: number;
  lng: number;
  isOpen?: boolean;
}

export interface Session {
  id: string;
  code: string;
  hostId: string;
  guestId?: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  restaurants: Restaurant[];
  status: 'waiting' | 'swiping' | 'complete';
  createdAt: string;
}

export interface Swipe {
  sessionId: string;
  odUserId: string;
  restaurantId: string;
  direction: 'left' | 'right';
}

export interface Match {
  restaurant: Restaurant;
  bothLiked: boolean;
}
