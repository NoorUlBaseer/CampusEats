// Dummy data for the app. In a real app this would come from an API.

export const CAFETERIAS = [
  {
    id: 'c1',
    name: 'Main Cafe',
    location: 'Near Block A',
    emoji: '🍔',
    tag: 'Fast Food',
    rating: 4.6,
    prepTime: '10–15 min',
    timing: '8 AM – 8 PM',
    color: '#FF6B35', // header + hero colour for this cafeteria
    tint: '#FFF0E8', // soft background for its emoji tiles
    items: [
      { id: 'c1-1', name: 'Zinger Burger', price: 450, emoji: '🍔', popular: true, description: 'Crispy fried chicken fillet with mayo and lettuce in a soft bun.' },
      { id: 'c1-2', name: 'Club Sandwich', price: 380, emoji: '🥪', description: 'Triple-layer sandwich with chicken, egg and cheese, served with fries.' },
      { id: 'c1-3', name: 'Loaded Fries', price: 300, emoji: '🍟', popular: true, description: 'Fries topped with cheese sauce, jalapenos and chicken chunks.' },
      { id: 'c1-4', name: 'Cold Coffee', price: 250, emoji: '🧋', description: 'Chilled coffee blended with milk and ice cream.' },
    ],
  },
  {
    id: 'c2',
    name: 'Desi Dhaba',
    location: 'Behind Library',
    emoji: '🍛',
    tag: 'Desi',
    rating: 4.8,
    prepTime: '15–20 min',
    timing: '11 AM – 6 PM',
    color: '#D9480F',
    tint: '#FFF4E6',
    items: [
      { id: 'c2-1', name: 'Chicken Biryani', price: 350, emoji: '🍛', popular: true, description: 'Spicy Karachi-style biryani with raita and salad.' },
      { id: 'c2-2', name: 'Daal Chawal', price: 220, emoji: '🍚', description: 'Yellow daal with steamed rice and achaar.' },
      { id: 'c2-3', name: 'Chicken Karahi (Half)', price: 900, emoji: '🍲', description: 'Fresh karahi cooked in tomatoes and green chillies, with 2 naans.' },
      { id: 'c2-4', name: 'Doodh Patti', price: 80, emoji: '☕', popular: true, description: 'Strong milky tea, the fuel of every all-nighter.' },
    ],
  },
  {
    id: 'c3',
    name: 'Juice Corner',
    location: 'Sports Complex',
    emoji: '🥤',
    tag: 'Drinks',
    rating: 4.4,
    prepTime: '5–10 min',
    timing: '9 AM – 5 PM',
    color: '#2B8A3E',
    tint: '#EBFBEE',
    items: [
      { id: 'c3-1', name: 'Mango Shake', price: 200, emoji: '🥭', popular: true, description: 'Thick shake made with seasonal mangoes.' },
      { id: 'c3-2', name: 'Fresh Lime', price: 120, emoji: '🍋', description: 'Sweet and salty fresh lime soda.' },
      { id: 'c3-3', name: 'Fruit Chaat', price: 180, emoji: '🍉', description: 'Seasonal fruits with chaat masala.' },
    ],
  },
];

// Helper used by screens that only receive an id as a route param.
export function getCafeteriaById(id) {
  return CAFETERIAS.find((c) => c.id === id);
}

// Finds the cafeteria an item belongs to (used for colours on item screens).
export function getCafeteriaByName(name) {
  return CAFETERIAS.find((c) => c.name === name);
}

// Popular items from every cafeteria, for the home screen carousel.
export const POPULAR_ITEMS = CAFETERIAS.flatMap((c) =>
  c.items.filter((i) => i.popular).map((item) => ({ item, cafeteria: c }))
);
