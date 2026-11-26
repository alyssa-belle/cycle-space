// Cycle Space prototype data. All spaces and details below are fictional.

const STARTUP = {
  name: "Cycle Space",
  pitch: "Cycle Space connects organizations that need flexible, affordable space with property owners who have rooms to share."
};

const LISTINGS = [
  {
    id: 1,
    name: "The Sunroom Studio",
    category: "Creative studio",
    location: "Antigonish, NS",
    description: "A bright, flexible studio for art classes, small workshops, and hands-on projects.",
    details: "Up to 12 people · Natural light · Tables and chairs",
    rate: "$24 / hour",
    availability: "Weekday afternoons"
  },
  {
    id: 2,
    name: "Market Street Meeting Room",
    category: "Meeting room",
    location: "Halifax, NS",
    description: "A quiet, comfortable room for team catch-ups, planning sessions, or community meetings.",
    details: "Up to 8 people · Whiteboard · Wi-Fi",
    rate: "$18 / hour · $120 / day",
    bookingOptions: [
      { amount: 18, unit: "hour" },
      { amount: 120, unit: "day" }
    ],
    availability: "Weekdays"
  },
  {
    id: 3,
    name: "Harbourview Workshop",
    category: "Workshop",
    location: "Dartmouth, NS",
    description: "A practical, open room with space to spread out, learn something, and make a little mess.",
    details: "Up to 16 people · Work tables · Sink",
    rate: "$32 / hour",
    availability: "Weekends"
  },
  {
    id: 4,
    name: "The Common Room",
    category: "Community space",
    location: "Antigonish, NS",
    description: "A welcoming gathering room for local groups, club meetups, and neighborhood events.",
    details: "Up to 24 people · Accessible entry · Chairs included",
    rate: "$35 / hour",
    availability: "Evenings and weekends"
  },
  {
    id: 5,
    name: "North End Desk Nook",
    category: "Coworking",
    location: "Halifax, NS",
    description: "A calm spot to focus, catch up on work, or get a small project off the ground.",
    details: "Up to 4 people · Desks · Wi-Fi",
    rate: "$12 / hour",
    availability: "Weekdays"
  },
  {
    id: 6,
    name: "Pine Street Learning Room",
    category: "Classroom",
    location: "Truro, NS",
    description: "A simple, friendly classroom ready for tutoring, study groups, or a short course.",
    details: "Up to 18 people · Projector · Whiteboard",
    rate: "$28 / hour",
    availability: "Weekday evenings"
  },
  {
    id: 7,
    name: "The Little Gallery",
    category: "Event space",
    location: "Dartmouth, NS",
    description: "An intimate blank-canvas venue for pop-ups, small showcases, and creative meetups.",
    details: "Up to 20 people · Open floor · Street-level access",
    rate: "$40 / hour",
    availability: "Select evenings"
  },
  {
    id: 8,
    name: "Garden Level Studio",
    category: "Creative studio",
    location: "Truro, NS",
    description: "A low-key, light-filled room for small group sessions, planning, and creative work.",
    details: "Up to 10 people · Tables · Natural light",
    rate: "$20 / hour · $130 / day",
    bookingOptions: [
      { amount: 20, unit: "hour" },
      { amount: 130, unit: "day" }
    ],
    availability: "Weekdays and weekends"
  },
  {
    id: 9,
    name: "Market Lane Store Backroom",
    category: "Retail storage",
    location: "Halifax, NS",
    description: "A backroom for a small clothing business to store extra stock between pop-ups, markets, or restocks.",
    details: "Garment rails · Shelving · Shared loading access",
    rate: "$35 / day",
    bookingOptions: [{ amount: 35, unit: "day" }],
    availability: "Select weekdays"
  }
];
