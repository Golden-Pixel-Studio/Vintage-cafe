export const fallbackBusiness = {
  name: "Vintage Cafe",
  tagline: "Where Every Sip Tells a Story",
  since: "2018",
  address:
    "Shop no.15 & 16, Gagan Unnati, Katraj - Kondhwa Rd, next to Iskon Temple, Kondhwa Budruk, Pune, Maharashtra 411048, India",
  shortAddress: "Gagan Unnati, next to ISKCON Temple, Kondhwa Budruk, Pune",
  phone: "+91 75177 73756",
  phoneDisplay: "75177 73756",
  whatsapp: "917517773756",
  rating: 4.3,
  reviewCount: 300,
  visitCount: 2139,
  priceForTwo: "INR 450 for two",
  liveDataStatus: "Public-directory fallback. Add a Google Places API key for live updates.",
  openingHours: [
    "Monday: 12:00 PM - 11:45 PM",
    "Tuesday: 12:00 PM - 11:45 PM",
    "Wednesday: 12:00 PM - 11:45 PM",
    "Thursday: 12:00 PM - 11:45 PM",
    "Friday: 12:00 PM - 11:45 PM",
    "Saturday: 12:00 PM - 11:45 PM",
    "Sunday: 12:00 PM - 11:45 PM"
  ],
  coordinates: {
    lat: 18.4618,
    lng: 73.8876
  },
  mapEmbed:
    "https://www.google.com/maps?q=Vintage%20Cafe%2C%20Shop%20no.15%20%26%2016%2C%20Gagan%20Unnati%2C%20Katraj%20-%20Kondhwa%20Rd%2C%20next%20to%20Iskon%20Temple%2C%20Kondhwa%20Budruk%2C%20Pune%2C%20Maharashtra%20411048%2C%20India&output=embed",
  sourceNotes: [
    "Cafe owner-provided phone number: +91 75177 73756.",
    "Public directories report ratings around 4.2 to 4.3.",
    "Popular dishes include cold coffee, sandwiches, Chinese, pizza, pasta, dosa, pav bhaji, burgers, Maggi, nachos, and mastani."
  ]
};

export const menuCategories = [
  {
    id: "coffee",
    label: "Coffee",
    intro: "Slow, creamy, chilled, and comfort-first pours built for Pune evenings.",
    items: [
      {
        name: "Signature Cold Coffee",
        description: "A chilled house blend with velvety milk, balanced sweetness, and a smooth caffeine lift.",
        price: "INR 60",
        badge: "Most Loved",
        image:
          "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Thick Cold Coffee",
        description: "Dense, creamy, dessert-like cold coffee served for the serious cafe ritualist.",
        price: "INR 75",
        badge: "Creamy",
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Hot Chocolate",
        description: "Warm cocoa, soft foam, and vintage comfort in a cup.",
        price: "INR 95",
        badge: "Cozy",
        image:
          "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=900&q=80"
      }
    ]
  },
  {
    id: "snacks",
    label: "Snacks",
    intro: "Fast, flavorful comfort plates inspired by local cravings and cafe classics.",
    items: [
      {
        name: "Veg Cheese Burger",
        description: "Toasted buns, vegetable patty, mayo, cheese, crisp cucumber, tomato, and onion.",
        price: "INR 160",
        badge: "Popular",
        image:
          "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Amul Pav Bhaji",
        description: "Classic Mumbai-style bhaji finished with Amul butter and served with toasted pav.",
        price: "INR 170",
        badge: "Street Classic",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Veg Hakka Noodles",
        description: "Springy noodles tossed with vegetables and a savory Indo-Chinese finish.",
        price: "INR 160",
        badge: "Spicy",
        image:
          "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Masala Dosa",
        description: "Crisp dosa with spiced aloo masala, coconut chutney, and sambar.",
        price: "INR 135",
        badge: "Comfort",
        image:
          "https://images.unsplash.com/photo-1630409351217-bc4fa6422075?auto=format&fit=crop&w=900&q=80"
      }
    ]
  },
  {
    id: "desserts",
    label: "Desserts",
    intro: "Sweet finishes for celebrations, catch-ups, and late-night cravings.",
    items: [
      {
        name: "Mastani",
        description: "Pune-style indulgence with thick milkshake texture and a celebratory dessert finish.",
        price: "INR 140",
        badge: "Pune Favorite",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Chocolate Waffle Plate",
        description: "Warm waffle, chocolate drizzle, and a scoop-ready cafe dessert moment.",
        price: "INR 180",
        badge: "Shareable",
        image:
          "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Brownie Sundae",
        description: "Fudgy brownie with cream, chocolate sauce, and cafe nostalgia.",
        price: "INR 160",
        badge: "Decadent",
        image:
          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80"
      }
    ]
  }
];

export const galleryImages = [
  {
    title: "The first pour",
    type: "Coffee craft",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=82"
  },
  {
    title: "Warm corner table",
    type: "Ambience",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=82"
  },
  {
    title: "Cafe evening glow",
    type: "Interior",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=82"
  },
  {
    title: "Friends over plates",
    type: "Dining",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=82"
  },
  {
    title: "Street-food comfort",
    type: "Menu",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=82"
  },
  {
    title: "Dessert ritual",
    type: "Dessert",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=82"
  }
];

export const testimonials = [
  {
    name: "Harshada K.",
    role: "Local reviewer",
    quote:
      "A pocket-friendly cafe with an inviting ambience. It feels comfortable for relaxed meals and easy catch-ups.",
    rating: 4
  },
  {
    name: "Piyush Z.",
    role: "Regular guest",
    quote:
      "I have been visiting for years. The taste has stayed consistent and it is a reliable place in Kondhwa.",
    rating: 5
  },
  {
    name: "Aarav M.",
    role: "Weekend visitor",
    quote:
      "Cold coffee, sandwiches, and dosa make this a dependable hangout near ISKCON with friends and family.",
    rating: 5
  }
];

export const businessSources = [
  {
    label: "TripTap listing",
    url: "https://triptap.com/places/in/maharashtra/haveli/vintage-cafe-t019b705"
  },
  {
    label: "Zaubee listing",
    url: "https://zaubee.com/biz/vintage-cafe-l57izk01"
  },
  {
    label: "Yappe listing",
    url: "https://yappe.in/maharashtra/pune/vintage-cafe/402363"
  },
  {
    label: "Magicpin listing",
    url: "https://magicpin.in/Pune/Katraj/Restaurant/Vintage-Cafe/store/1844ba/"
  },
  {
    label: "Restaurant Guru listing",
    url: "https://restaurant-guru.in/Vintage-Cafe-Pune"
  }
];
