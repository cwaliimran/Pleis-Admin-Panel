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
        title: 'Highlights',
        url: paths.organizer.hightLight.default,
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

  // {
  //   label: 'Organizations',
  //   key: paths.organizer.organizations.list,
  //   icon: Building,
  // },
  // {
  //   label: 'Venue',
  //   key: paths.organizer.venue.default,
  //   icon: VenetianMask,
  // },
  // {
  //   label: 'Events',
  //   key: paths.organizer.events.list,
  //   icon: Calendar,
  // },
  // {
  //   label: 'Highlights',
  //   key: paths.organizer.hightLight.default,
  //   icon: Highlighter,
  // },
  // {
  //   label: 'Reviews',
  //   key: paths.organizer.reviews,
  //   icon: ThumbsUp,
  // },
  // {
  //   label: 'QR codes',
  //   key: paths.organizer.reviews,
  //   icon: ThumbsUp,
  // },
  // {
  //   label: 'Updates',
  //   key: paths.organizer.updates,
  //   icon: Megaphone,
  // },

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

  // {
  //   label: 'Menu List',
  //   key: paths.organizer.menuList,
  //   icon: List,
  // },
  // {
  //   label: 'Menu Items',
  //   key: paths.organizer.menuItems,
  //   icon: SquareMenu,
  // },
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

  // {
  //   label: 'Giveaways',
  //   key: paths.organizer.giveaways,
  //   icon: Gift,
  // },
  // ...(isDev
  //   ? [
  //       {
  //         label: 'Sample',
  //         key: paths.organizer.sample.default,
  //         icon: Grid2x2Check,
  //       },
  //     ]
  //   : []),

  // {
  //     label: "Marketing Requests",
  //     key: paths.organizer.marketing.detault,
  //     icon: Volume1
  // },

  // {
  //     label: "Transactions",
  //     key: paths.organizer.transactions.default,
  //     icon: ArrowRightLeft,
  // items: [
  //     {
  //         title: "Premium Transaction",
  //         url: paths.superAdmin.transactions.premium,
  //         icon: Settings,
  //     },
  //     {
  //         title: "Transaction List",
  //         url: paths.superAdmin.transactions.list, // Example ID
  //         icon: Settings,
  //     }, {
  //         title: "Refund List",
  //         url: paths.superAdmin.transactions.refund, // Example ID
  //         icon: Settings,
  //     }
  // ]
  // },
  // {
  //     label: "Notification",
  //     key: paths.organizer.notification.default,
  //     icon: Bell,
  // items: [
  //     {
  //         title: "Overview",
  //         url: paths.superAdmin.notification.overview,
  //         icon: Bell,
  //     },
  //     {
  //         title: "Notification List",
  //         url: paths.superAdmin.notification.list, // Example ID
  //         icon: Bell,
  //     },
  //     {
  //         title: "Create Notification",
  //         url: paths.superAdmin.notification.createUpdate, // Example ID
  //         icon: Bell,
  //     },
  //     {
  //         title: "Create Giveaway",
  //         url: paths.superAdmin.notification.createGiveaway, // Example ID
  //         icon: Bell,
  //     },
  //     {
  //         title: "Create Notification",
  //         url: paths.superAdmin.notification.createNotification, // Example ID
  //         icon: Bell,
  //     }
  // ]
  // },

  // {
  //     label: "Subscription",
  //     key: paths.organizer.subscription,
  //     icon: Podcast,
  // },
  // {
  //     label: "Logout",
  //     key: "/",
  //     icon: LogOut,
  // }
];
