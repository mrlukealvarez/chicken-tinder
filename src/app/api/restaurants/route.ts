import { NextRequest, NextResponse } from 'next/server';
import { Restaurant } from '@/types';

// Mock restaurants for MVP (replace with Google Places API)
// Using realistic data so the app feels real immediately
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1', name: 'The Cattleman\'s Steakhouse',
    photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    rating: 4.6, priceLevel: 3, distance: '0.3 mi', cuisine: 'Steakhouse',
    address: '140 Mt Rushmore Rd, Custer, SD', lat: 43.7666, lng: -103.5988, isOpen: true,
  },
  {
    id: '2', name: 'Purple Pie Place',
    photo: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80',
    rating: 4.8, priceLevel: 2, distance: '0.1 mi', cuisine: 'American',
    address: '19 Mt Rushmore Rd, Custer, SD', lat: 43.7660, lng: -103.5980, isOpen: true,
  },
  {
    id: '3', name: 'Black Hills Burger & Bun',
    photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    rating: 4.5, priceLevel: 2, distance: '0.4 mi', cuisine: 'Burgers',
    address: '441 Mt Rushmore Rd, Custer, SD', lat: 43.7670, lng: -103.5995, isOpen: true,
  },
  {
    id: '4', name: 'Skogen Kitchen',
    photo: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    rating: 4.9, priceLevel: 4, distance: '0.2 mi', cuisine: 'Nordic',
    address: '501 Mt Rushmore Rd, Custer, SD', lat: 43.7668, lng: -103.5992, isOpen: true,
  },
  {
    id: '5', name: 'Baker\'s Bakery & Cafe',
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    rating: 4.4, priceLevel: 1, distance: '0.2 mi', cuisine: 'Cafe',
    address: '541 Mt Rushmore Rd, Custer, SD', lat: 43.7672, lng: -103.5998, isOpen: true,
  },
  {
    id: '6', name: 'Buglin\' Bull',
    photo: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecf0?w=800&q=80',
    rating: 4.3, priceLevel: 2, distance: '0.5 mi', cuisine: 'BBQ',
    address: '611 Mt Rushmore Rd, Custer, SD', lat: 43.7675, lng: -103.6005, isOpen: true,
  },
  {
    id: '7', name: 'Custer Wolf',
    photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    rating: 4.7, priceLevel: 3, distance: '0.3 mi', cuisine: 'Fine Dining',
    address: '23 5th St, Custer, SD', lat: 43.7663, lng: -103.5985, isOpen: true,
  },
  {
    id: '8', name: 'Pizza Works',
    photo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    rating: 4.2, priceLevel: 1, distance: '0.4 mi', cuisine: 'Pizza',
    address: '344 Mt Rushmore Rd, Custer, SD', lat: 43.7669, lng: -103.5990, isOpen: true,
  },
  {
    id: '9', name: 'Custer\'s Last Taco',
    photo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    rating: 4.1, priceLevel: 1, distance: '0.6 mi', cuisine: 'Mexican',
    address: '702 Mt Rushmore Rd, Custer, SD', lat: 43.7680, lng: -103.6010, isOpen: true,
  },
  {
    id: '10', name: 'Sage Creek Grille',
    photo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    rating: 4.5, priceLevel: 3, distance: '0.8 mi', cuisine: 'American',
    address: '611 Mt Rushmore Rd, Custer, SD', lat: 43.7685, lng: -103.6015, isOpen: true,
  },
  {
    id: '11', name: 'Philly Ted\'s Cheesesteaks',
    photo: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80',
    rating: 4.0, priceLevel: 1, distance: '0.3 mi', cuisine: 'Sandwiches',
    address: '246 Mt Rushmore Rd, Custer, SD', lat: 43.7667, lng: -103.5989, isOpen: true,
  },
  {
    id: '12', name: 'Laughing Water Restaurant',
    photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    rating: 4.3, priceLevel: 2, distance: '3.2 mi', cuisine: 'American',
    address: 'Custer State Park, SD', lat: 43.7400, lng: -103.5800, isOpen: true,
  },
];

export const preferredRegion = 'iad1';

export async function GET(_request: NextRequest) {
  // TODO: Replace with Google Places API call using lat/lng/radius from searchParams
  // const { searchParams } = new URL(request.url);
  // const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?...`;

  // For MVP, return mock data (shuffled)
  const shuffled = [...MOCK_RESTAURANTS].sort(() => Math.random() - 0.5);

  return NextResponse.json({ restaurants: shuffled });
}
