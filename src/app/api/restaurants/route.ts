import { NextRequest, NextResponse } from 'next/server';
import { Restaurant } from '@/types';

// Mock restaurants for MVP (replace with Google Places API)
// Using realistic data so the app feels real immediately
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1', name: 'The Cattleman\'s Steakhouse', photo: '/food/steak.jpg',
    rating: 4.6, priceLevel: 3, distance: '0.3 mi', cuisine: 'Steakhouse',
    address: '140 Mt Rushmore Rd, Custer, SD', lat: 43.7666, lng: -103.5988, isOpen: true,
  },
  {
    id: '2', name: 'Purple Pie Place', photo: '/food/pie.jpg',
    rating: 4.8, priceLevel: 2, distance: '0.1 mi', cuisine: 'American',
    address: '19 Mt Rushmore Rd, Custer, SD', lat: 43.7660, lng: -103.5980, isOpen: true,
  },
  {
    id: '3', name: 'Black Hills Burger & Bun', photo: '/food/burger.jpg',
    rating: 4.5, priceLevel: 2, distance: '0.4 mi', cuisine: 'Burgers',
    address: '441 Mt Rushmore Rd, Custer, SD', lat: 43.7670, lng: -103.5995, isOpen: true,
  },
  {
    id: '4', name: 'Skogen Kitchen', photo: '/food/nordic.jpg',
    rating: 4.9, priceLevel: 4, distance: '0.2 mi', cuisine: 'Nordic',
    address: '501 Mt Rushmore Rd, Custer, SD', lat: 43.7668, lng: -103.5992, isOpen: true,
  },
  {
    id: '5', name: 'Baker\'s Bakery & Cafe', photo: '/food/bakery.jpg',
    rating: 4.4, priceLevel: 1, distance: '0.2 mi', cuisine: 'Cafe',
    address: '541 Mt Rushmore Rd, Custer, SD', lat: 43.7672, lng: -103.5998, isOpen: true,
  },
  {
    id: '6', name: 'Buglin\' Bull', photo: '/food/bbq.jpg',
    rating: 4.3, priceLevel: 2, distance: '0.5 mi', cuisine: 'BBQ',
    address: '611 Mt Rushmore Rd, Custer, SD', lat: 43.7675, lng: -103.6005, isOpen: true,
  },
  {
    id: '7', name: 'Custer Wolf', photo: '/food/fine.jpg',
    rating: 4.7, priceLevel: 3, distance: '0.3 mi', cuisine: 'Fine Dining',
    address: '23 5th St, Custer, SD', lat: 43.7663, lng: -103.5985, isOpen: true,
  },
  {
    id: '8', name: 'Pizza Works', photo: '/food/pizza.jpg',
    rating: 4.2, priceLevel: 1, distance: '0.4 mi', cuisine: 'Pizza',
    address: '344 Mt Rushmore Rd, Custer, SD', lat: 43.7669, lng: -103.5990, isOpen: true,
  },
  {
    id: '9', name: 'Custer\'s Last Taco', photo: '/food/taco.jpg',
    rating: 4.1, priceLevel: 1, distance: '0.6 mi', cuisine: 'Mexican',
    address: '702 Mt Rushmore Rd, Custer, SD', lat: 43.7680, lng: -103.6010, isOpen: true,
  },
  {
    id: '10', name: 'Sage Creek Grille', photo: '/food/grille.jpg',
    rating: 4.5, priceLevel: 3, distance: '0.8 mi', cuisine: 'American',
    address: '611 Mt Rushmore Rd, Custer, SD', lat: 43.7685, lng: -103.6015, isOpen: true,
  },
  {
    id: '11', name: 'Philly Ted\'s Cheesesteaks', photo: '/food/philly.jpg',
    rating: 4.0, priceLevel: 1, distance: '0.3 mi', cuisine: 'Sandwiches',
    address: '246 Mt Rushmore Rd, Custer, SD', lat: 43.7667, lng: -103.5989, isOpen: true,
  },
  {
    id: '12', name: 'Laughing Water Restaurant', photo: '/food/american.jpg',
    rating: 4.3, priceLevel: 2, distance: '3.2 mi', cuisine: 'American',
    address: 'Custer State Park, SD', lat: 43.7400, lng: -103.5800, isOpen: true,
  },
];

export async function GET(_request: NextRequest) {
  // TODO: Replace with Google Places API call using lat/lng/radius from searchParams
  // const { searchParams } = new URL(request.url);
  // const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?...`;

  // For MVP, return mock data (shuffled)
  const shuffled = [...MOCK_RESTAURANTS].sort(() => Math.random() - 0.5);

  return NextResponse.json({ restaurants: shuffled });
}
