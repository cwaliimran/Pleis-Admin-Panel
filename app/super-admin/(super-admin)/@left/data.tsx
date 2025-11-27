import {
  ArrowBigUp,
  BellRing,
  Box,
  Building,
  Calendar,
  CalendarDays,
  ChartBar,
  ChartColumnBig,
  // ChartNoAxesColumnIncreasing,
  ClipboardPenLine,
  Earth,
  Grid2x2Check,
  Handshake,
  Hash,
  Highlighter,
  Layers,
  List,
  ListOrdered,
  Package,
  QrCode,
  Settings,
  ShoppingBasket,
  SlidersHorizontal,
  SquareMenu,
  Tags,
  Ticket,
  TicketSlash,
  TriangleDashed,
  User,
  UsersRound,
  VenetianMask,
} from 'lucide-react';
import { paths } from './paths';

type MenuItem = {
  title: string;
  url?: string;
  icon: any;
  items?: MenuItem[];
};

type MenuGroup = {
  label: string;
  key: string;
  icon: any;
  items?: MenuItem[];
};

export const menuGroups: MenuGroup[] = [
  {
    label: 'Dashboard',
    key: paths.superAdmin.default,
    icon: ChartColumnBig,
  },
  {
    label: 'Organizations',
    key: paths.superAdmin.organizations.list,
    icon: Building,
  },
  {
    label: 'Events',
    key: paths.superAdmin.events.default,
    icon: Calendar,
  },
  {
    label: 'Venue',
    key: paths.superAdmin.venue.default,
    icon: VenetianMask,
  },
  {
    label: 'Venue Type',
    key: paths.superAdmin.venueType.default,
    icon: Layers,
  },
  {
    label: 'Highlights',
    key: paths.superAdmin.hightLight.default,
    icon: Highlighter,
  },

  {
    label: 'Categories',
    key: paths.superAdmin.category.default,
    icon: List,
  },
  {
    label: 'Global Loyalty',
    key: paths.superAdmin.globalLoyalty.default,
    icon: Earth,
    items: [
      {
        title: 'Global Loyalty',
        url: paths.superAdmin.globalLoyalty.default,
        icon: Tags,
      },
      {
        title: 'Rewards',
        url: paths.superAdmin.globalRewards,
        icon: Tags,
      },
      {
        title: 'Streaks',
        url: paths.superAdmin.globalStreak,
        icon: ListOrdered,
      },
      {
        title: 'Third Party',
        url: paths.superAdmin.thirdParty,
        icon: Tags,
      },
      {
        title: 'Challenges',
        url: paths.superAdmin.globalChallenges,
        icon: Tags,
      },
      {
        title: 'Promotions',
        url: paths.superAdmin.globalPromotions,
        icon: Tags,
      },
      {
        title: 'Members',
        url: paths.superAdmin.members,
        icon: Tags,
      },
      {
        title: 'Referrals',
        url: paths.superAdmin.globalReferrals,
        icon: Tags,
      },
      {
        title: 'Level Status',
        url: paths.superAdmin.levelStatus,
        icon: ArrowBigUp,
      },
      {
        title: 'Reward Category',
        url: paths.superAdmin.rewardCategory,
        icon: ArrowBigUp,
      },
    ],
  },
  {
    label: 'Loyalty',
    key: paths.superAdmin.loyalty.default,
    icon: Handshake,
    items: [
      {
        title: 'Loyalty Dashboard',
        url: paths.superAdmin.loyalty.default,
        icon: Tags,
      },
      {
        title: 'Rewards',
        url: paths.superAdmin.rewards,
        icon: Tags,
      },
      {
        title: 'Streaks',
        url: paths.superAdmin.streak,
        icon: ListOrdered,
      },
      {
        title: 'Challenges',
        url: paths.superAdmin.challenges,
        icon: Tags,
      },
      {
        title: 'Promotions',
        url: paths.superAdmin.promotions,
        icon: Tags,
      },
      {
        title: 'Members',
        url: paths.superAdmin.members,
        icon: Tags,
      },
      {
        title: 'Settings',
        url: paths.superAdmin.settings,
        icon: Tags,
      },
      {
        title: 'Referrals',
        url: paths.superAdmin.referrals,
        icon: Tags,
      },
      {
        title: 'Transactions',
        url: paths.superAdmin.transactions.default,
        icon: Tags,
      },
    ],
  },
  {
    label: 'Reservation',
    key: paths.superAdmin.reservation,
    icon: CalendarDays,
    items: [
      {
        title: 'Reservation',
        url: paths.superAdmin.reservation,
        icon: CalendarDays,
      },
      {
        title: 'Calendar',
        url: paths.superAdmin.calendar,
        icon: CalendarDays,
      },
      {
        title: 'Analytics',
        url: paths.superAdmin.analytics,
        icon: ChartBar,
      },
      {
        title: 'Transactions',
        url: paths.superAdmin.reservationTransactions,
        icon: ChartBar,
      },
    ],
  },
  {
    label: 'App Ordering',
    key: paths.superAdmin.orderManagement,
    icon: ShoppingBasket,
    items: [
      {
        title: 'Order Management',
        url: paths.superAdmin.orderManagement,
        icon: CalendarDays,
      },
      {
        title: 'Menu Management',
        url: paths.superAdmin.menuManagement,
        icon: CalendarDays,
      },
      {
        title: 'Analytics',
        url: paths.superAdmin.orderAnalytics,
        icon: CalendarDays,
      },
      {
        title: 'Settings',
        url: paths.superAdmin.orderSettings,
        icon: CalendarDays,
      },
    ],
  },
  {
    label: 'QR Codes',
    key: paths.superAdmin.qrCodes,
    icon: QrCode,
  },
  {
    label: 'Promo Codes',
    key: paths.superAdmin.promoCodes,
    icon: TicketSlash,
  },
  {
    label: 'Notifications',
    key: paths.superAdmin.notification.default,
    icon: BellRing,
  },
  {
    label: 'Ticketing',
    key: paths.superAdmin.ticketing,
    icon: Ticket,
  },
  {
    label: 'Bundles',
    key: paths.superAdmin.bundles,
    icon: Box,
  },
  {
    label: 'Preset',
    key: paths.superAdmin.preset.default,
    icon: SlidersHorizontal,
  },
  {
    label: 'Menu List',
    key: paths.superAdmin.menuList,
    icon: List,
  },
  {
    label: 'Items Category',
    key: paths.superAdmin.itemsCategory,
    icon: Grid2x2Check,
  },
  {
    label: 'Menu Items',
    key: paths.superAdmin.menuItems,
    icon: SquareMenu,
  },
  {
    label: 'Tiers',
    key: paths.superAdmin.tiers,
    icon: TriangleDashed,
  },
  // {
  //   label: 'Status',
  //   key: paths.superAdmin.status,
  //   icon: ChartNoAxesColumnIncreasing,
  // },
  {
    label: 'Browser Control',
    key: paths.superAdmin.browserControl.default,
    icon: Settings,
  },
  {
    label: 'Tags',
    key: paths.superAdmin.tags.default,
    icon: Hash,
  },
  {
    label: 'User List',
    key: paths.superAdmin.users.list,
    icon: User,
    items: [
      {
        title: 'User List',
        url: paths.superAdmin.users.list,
        icon: UsersRound,
      },
      {
        title: 'Pending User List',
        url: paths.superAdmin.users.pendingList,
        icon: UsersRound,
      },
    ],
  },
  {
    label: 'Supplier',
    key: paths.superAdmin.suppliers.default,
    icon: Package,
  },
  {
    label: 'Terms & Conditions',
    key: paths.superAdmin.terms.default,
    icon: ClipboardPenLine,
  },
  // {
  //   label: "Marketing Requests",
  //   key: paths.superAdmin.marketing.detault,
  //   icon: Volume1,
  // },
  // {
  //   label: "Transactions",
  //   key: paths.superAdmin.transactions.default,
  //   icon: ArrowRightLeft,
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
  //   label: "Notification",
  //   key: paths.superAdmin.notification.default,
  //   icon: Bell,
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
  //   label: "Subscription",
  //   key: paths.superAdmin.subscription,
  //   icon: Podcast,
  // },
  // {
  //   label: "Add Support",
  //   key: paths.superAdmin.addSupport,
  //   icon: HeartPlus,
  // },
];
