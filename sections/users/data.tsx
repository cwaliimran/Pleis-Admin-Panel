import { id } from "date-fns/locale";

export const organizerData = [
  {
    _id: 1,
    name: "Long Organizer Name",
    totalRevenue: 1000,
    views: 5000,
    ticketsSold: 200,
    date: "2023-10-01",
    commission: 50,
    status: "Premium User",
  },
  {
    _id: 2,
    name: "Short Name",
    totalRevenue: 500,
    views: 3000,
    ticketsSold: 150,
    date: "2023-10-02",
    commission: 30,
    status: "Free User",
  },
  {
    _id: 3,
    name: "Another Organizer",
    totalRevenue: 1200,
    views: 6000,
    ticketsSold: 250,
    date: "2023-10-03",
    commission: 60,
    status: "Premium User",
  },
  {
    _id: 4,
    name: "Last Organizer",
    totalRevenue: 800,
    views: 4000,
    ticketsSold: 180,
    date: "2023-10-04",
    commission: 40,
    status: "Free User",
  },
  {
    _id: 5,
    name: "Organizer Five",
    totalRevenue: 900,
    views: 4500,
    ticketsSold: 220,
    date: "2023-10-05",
    commission: 45,
    status: "Premium User",
  },
  {
    _id: 6,
    name: "Organizer Six",
    totalRevenue: 1100,
    views: 5500,
    ticketsSold: 230,
    date: "2023-10-06",
    commission: 55,
    status: "Free User",
  },
  {
    _id: 7,
    name: "Organizer Seven",
    totalRevenue: 1300,
    views: 6500,
    ticketsSold: 270,
    date: "2023-10-07",
    commission: 65,
    status: "Premium User",
  },
  {
    _id: 8,
    name: "Organizer Eight",
    totalRevenue: 1400,
    views: 7000,
    ticketsSold: 300,
    date: "2023-10-08",
    commission: 70,
    status: "Free User",
  },
  {
    _id: 9,
    name: "Organizer Nine",
    totalRevenue: 1500,
    views: 7500,
    ticketsSold: 320,
    date: "2023-10-09",
    commission: 75,
    status: "Premium User",
  },
  {
    _id: 10,
    name: "Organizer Ten",
    totalRevenue: 1600,
    views: 8000,
    ticketsSold: 350,
    date: "2023-10-10",
    commission: 80,
    status: "Free User",
  },
];

export const tabsData = [
  { value: "info", label: "Info" },
  { value: "events", label: "Events" },
  { value: "loyalty", label: "Loyalty" },
  { value: "analytics", label: "Analytics" },
  { value: "notifications", label: "Notifications" },
  { value: "calendar", label: "Calendar" },
];

export const organizerTabs = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "Transactions",
    label: "Transactions",
  },
  {
    value: "refunds",
    label: "Refunds",
  },
];

export const userData = [
  {
    _id: 1,
    title: "Total Revenue",
    value: 1000,
    status: "up",
  },
  {
    _id: 2,
    title: "Views",
    value: 5000,
    status: "up",
    total: 10000,
  },
  {
    _id: 3,
    title: "Total Tickets Sold",
    value: 200,
    status: "down",
  },
  {
    _id: 4,
    title: "Orgainizer Events",
    value: 5,
    status: "up",
  },
];
export const organizerCardData = [
  {
    _id: 1,
    title: "Total Revenue",
    value: 0, // in USD or your currency
    status: "up",
  },
  {
    _id: 2,
    title: "Total Purchases",
    value: 0, // Total of tickets, experiences, orders
    status: "down",
    total: 10, // Optional: could represent comparison with last period
  },
  {
    _id: 3,
    title: "Follows",
    value: 0, // Followed Organizations + Events
    status: "up",
  },
];

export const activePromontions = [
  {
    title: "Vigor Challenge",
    description: "Drink 2x Vodkas",
  },
  {
    title: "Early Bird Tickets",
    description: "2+1 Free Drink",
  },
];

export const orgTags = ["Org 1", "Org 2", "Org 3", "Org 4"];
export const eventTags = ["Event 1", "Event 2", "Event 3"];

export const followedOrganizationsList = [
  {
    id: 1,
    orgName: "TechNova Inc",
    status: "active",
  },
  {
    id: 2,
    orgName: "GreenWorks Ltd",
    status: "inactive",
  },
  {
    id: 3,
    orgName: "AgroTech Pvt. Ltd",
    status: "active",
  },
  {
    id: 4,
    orgName: "BrightLabs",
    status: "active",
  },
  {
    id: 5,
    orgName: "UrbanEdge Solutions",
    status: "inactive",
  },
  {
    id: 6,
    orgName: "NextGen Innovations",
    status: "active",
  },
  {
    id: 7,
    orgName: "EcoSphere Enterprises",
    status: "active",
  },
  {
    id: 8,
    orgName: "QuantumSoft",
    status: "inactive",
  },
];

export const followedEventList = [
  {
    id: 1,
    orgName: "Tech Summit 2025",
    status: "active",
    views: "1500",
  },
  {
    id: 2,
    orgName: "AI World Conference",
    status: "inactive",
    views: "2000",
  },
  {
    id: 3,
    orgName: "Startup Expo",
    status: "active",
    views: "2500",
  },
  {
    id: 4,
    orgName: "Blockchain Fest",
    status: "active",
    views: "250",
  },
  {
    id: 5,
    orgName: "Women in Tech",
    status: "inactive",
    views: "750",
  },
];

export const userTags = ["Clubbing", "Techno", "Clubbing", "Techno"];
export const venueTypes = ["Type 1", "Type 2", "Type 3", "Type 4"];

export const dateTabs = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "week",
    label: "Week",
  },
  {
    value: "month",
    label: "Month",
  },
  {
    value: "all",
    label: "All",
  },
];

export const usersList = [
  {
    id: "1",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    totalPoints: 120,
    totalRevenue: 5000,
    region: "North America",
    phone: "123-456-7890",
  },
  {
    id: "2",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "inactive",
    totalPoints: 80,
    totalRevenue: 3000,
    region: "Europe",
    phone: "987-654-3210",
  },
  {
    id: "3",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    role: "staff",
    status: "active",
    totalPoints: 150,
    totalRevenue: 7000,
    region: "Asia",
    phone: "456-789-1230",
  },
  {
    id: "4",
    image: "https://randomuser.me/api/portraits/women/41.jpg",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@example.com",
    role: "user",
    status: "pending",
    totalPoints: 60,
    totalRevenue: 2000,
    region: "South America",
    phone: "321-654-9870",
  },
  {
    id: "5",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    firstName: "Michael",
    lastName: "Taylor",
    email: "michael.taylor@example.com",
    role: "user",
    status: "active",
    totalPoints: 90,
    totalRevenue: 4000,
    region: "Africa",
    phone: "654-321-0987",
  },
  {
    id: "6",
    image: "https://randomuser.me/api/portraits/women/61.jpg",
    firstName: "Sophia",
    lastName: "Anderson",
    email: "sophia.anderson@example.com",
    role: "admin",
    status: "inactive",
    totalPoints: 110,
    totalRevenue: 6000,
    region: "Australia",
    phone: "789-123-4560",
  },
  {
    id: "7",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    firstName: "James",
    lastName: "Thomas",
    email: "james.thomas@example.com",
    role: "staff",
    status: "active",
    totalPoints: 130,
    totalRevenue: 8000,
    region: "North America",
    phone: "123-456-7891",
  },
  {
    id: "8",
    image: "https://randomuser.me/api/portraits/women/81.jpg",
    firstName: "Olivia",
    lastName: "Jackson",
    email: "olivia.jackson@example.com",
    role: "user",
    status: "pending",
    totalPoints: 70,
    totalRevenue: 2500,
    region: "Europe",
    phone: "987-654-3211",
  },
  {
    id: "9",
    image: "https://randomuser.me/api/portraits/men/91.jpg",
    firstName: "William",
    lastName: "White",
    email: "william.white@example.com",
    role: "user",
    status: "active",
    totalPoints: 140,
    totalRevenue: 9000,
    region: "Asia",
    phone: "456-789-1231",
  },
  {
    id: "10",
    image: "https://randomuser.me/api/portraits/women/99.jpg",
    firstName: "Mia",
    lastName: "Martin",
    email: "mia.martin@example.com",
    role: "organizer",
    status: "inactive",
    totalPoints: 100,
    totalRevenue: 5500,
    region: "South America",
    phone: "321-654-9871",
  },
];
