import type { LucideIcon } from 'lucide-react';
import {
  Box,
  Building,
  Calendar,
  CalendarDays,
  ChartBar,
  ChartColumnBig,
  FileClock,
  // Grid2x2Check,
  Handshake,
  List,
  ListOrdered,
  Podcast,
  ShoppingBasket,
  Tags,
  TicketSlash,
  Volume1,
} from 'lucide-react';
import { paths } from './paths';

type MenuItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: MenuItem[];
};

type MenuGroup = {
  label: string;
  key: string;
  icon?: LucideIcon;
  items?: MenuItem[];
};

// const isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development';

export const menuGroups: MenuGroup[] = [
  {
    label: 'Dashboard',
    key: paths.organizer.dashboard,
    icon: ChartColumnBig,
  },
  {
    label: 'Org Management',
    key: paths.organizer.organizations.list,
    icon: Building,
    items: [
      {
        title: 'Organizations',
        url: paths.organizer.organizations.list,
        icon: CalendarDays,
      },
      {
        title: 'Venues',
        url: paths.organizer.venue.default,
        icon: CalendarDays,
      },
      {
        title: 'Events',
        url: paths.organizer.events.list,
        icon: CalendarDays,
      },
      {
        title: 'Reviews',
        url: paths.organizer.reviews,
        icon: CalendarDays,
      },
      {
        title: 'QR codes',
        url: paths.organizer.qrCodes,
        icon: CalendarDays,
      },
      {
        title: 'Updates',
        url: paths.organizer.updates,
        icon: CalendarDays,
      },
    ],
  },
  {
    label: 'Menu',
    key: paths.organizer.menuList,
    icon: List,
    items: [
      {
        title: 'Menu List',
        url: paths.organizer.menuList,
        icon: CalendarDays,
      },
      {
        title: 'Menu Items',
        url: paths.organizer.menuItems,
        icon: CalendarDays,
      },
    ],
  },
  {
    label: 'Loyalty',
    key: paths.organizer.loyalty.default,
    icon: Handshake,
    items: [
      {
        title: 'Loyalty Dashboard',
        url: paths.organizer.loyalty.default,
        icon: Tags,
      },
      {
        title: 'Rewards',
        url: paths.organizer.rewards,
        icon: Tags,
      },
      {
        title: 'Streaks',
        url: paths.organizer.streak,
        icon: ListOrdered,
      },
      {
        title: 'Members',
        url: paths.organizer.members,
        icon: Tags,
      },
      {
        title: 'Challenges',
        url: paths.organizer.challenges,
        icon: Tags,
      },
      {
        title: 'Promotions',
        url: paths.organizer.promotions,
        icon: Tags,
      },
      {
        title: 'Referrals',
        url: paths.organizer.referrals,
        icon: Tags,
      },
      {
        title: 'Referrals Analytics',
        url: paths.organizer.referralsAnalytics,
        icon: Tags,
      },
      {
        title: 'Transactions',
        url: paths.organizer.transactions.default,
        icon: Tags,
      },
      {
        title: 'Settings',
        url: paths.organizer.settings,
        icon: Tags,
      },
    ],
  },

  {
    label: 'Ticketing',
    key: paths.organizer.ticketing,
    icon: List,
    items: [
      {
        title: 'Ticket List',
        url: paths.organizer.ticketing,
        icon: CalendarDays,
      },
      {
        title: 'Giveaways',
        url: paths.organizer.giveaways,
        icon: CalendarDays,
      },
      {
        title: 'Transactions',
        url: paths.organizer.ticketingTransactions,
        icon: CalendarDays,
      },
    ],
  },

  {
    label: 'Reservations',
    key: paths.organizer.reservation,
    icon: CalendarDays,
    items: [
      {
        title: 'Reservations',
        url: paths.organizer.reservation,
        icon: CalendarDays,
      },
      {
        title: 'Calendar view',
        url: paths.organizer.reservationCalendar,
        icon: CalendarDays,
      },
      {
        title: 'Analytics',
        url: paths.organizer.reservationAnalytics,
        icon: ChartBar,
      },
      {
        title: 'Transactions',
        url: paths.organizer.reservationTransactions,
        icon: ChartBar,
      },
    ],
  },

  {
    label: 'In App Ordering',
    key: paths.organizer.orderManagement,
    icon: ShoppingBasket,
    items: [
      {
        title: 'Order Management',
        url: paths.organizer.orderManagement,
        icon: CalendarDays,
      },
      {
        title: 'Menu Management',
        url: paths.organizer.menuManagement,
        icon: CalendarDays,
      },
      {
        title: 'Analytics',
        url: paths.organizer.orderAnalytics,
        icon: CalendarDays,
      },
      {
        title: 'Transactions',
        url: paths.organizer.orderTransactions,
        icon: ChartBar,
      },
      {
        title: 'Settings',
        url: paths.organizer.orderSettings,
        icon: CalendarDays,
      },
    ],
  },

  {
    label: 'Subscription',
    key: paths.organizer.subscription,
    icon: Podcast,
  },
  {
    label: 'User List',
    key: paths.organizer.users.list,
    icon: Calendar,
  },
  {
    label: 'Transaction history',
    key: paths.organizer.transactionsHistory,
    icon: FileClock,
  },
  {
    label: 'Bundles',
    key: paths.organizer.bundles,
    icon: Box,
  },
  {
    label: 'Promo codes',
    key: paths.organizer.promoCodes,
    icon: TicketSlash,
  },
  {
    label: 'Marketing Requests',
    key: paths.organizer.marketingRequests,
    icon: Volume1,
  },
];
