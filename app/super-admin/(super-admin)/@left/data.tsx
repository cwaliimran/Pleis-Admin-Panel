import {
  ArrowBigUp,
  Box,
  Building,
  CalendarDays,
  ChartBar,
  ChartColumnBig,
  ChartNoAxesGantt,
  Earth,
  Handshake,
  List,
  ListOrdered,
  ShoppingBasket,
  Tags,
  Ticket,
  TicketSlash,
  User,
  UsersRound,
  FileClock,
  SlidersVertical,
  Volume1,
  ListFilter,
  BadgeInfo,
  ClipboardList,
} from 'lucide-react';
import { paths } from './paths';

type MenuItem = {
  title: string;
  url?: string;
  icon: any;
  items?: MenuItem[];
  panel?: string;
};

type MenuGroup = {
  label: string;
  key: string;
  icon: any;
  items?: MenuItem[];
  panel?: string;
};

export type SidePanelItem = {
  title: string;
  url: string;
};

export type SidePanelSection = {
  label: string;
  items: SidePanelItem[];
};

export type SidePanel = {
  title: string;
  backLabel: string;
  sections: SidePanelSection[];
};

// Drill-down side panels — triggered by a MenuItem with a matching `panel` key instead of a `url`.
export const sidePanels: Record<string, SidePanel> = {
  presetMenu: {
    title: 'Preset Menu',
    backLabel: 'Back to Menu',
    sections: [
      {
        label: 'Taxonomy',
        items: [
          { title: 'Preset Categories', url: paths.superAdmin.itemsCategory },
          { title: 'Preset Types', url: paths.superAdmin.presetTypes },
        ],
      },
      {
        label: 'Reference Tables',
        items: [
          { title: 'Brands', url: paths.superAdmin.brands },
          { title: 'Serving', url: paths.superAdmin.serving },
          { title: 'Diet Tags', url: paths.superAdmin.dietTags },
          { title: 'Allergens', url: paths.superAdmin.allergens },
          { title: 'Daypart', url: paths.superAdmin.daypart },
        ],
      },
    ],
  },
};

export const menuGroups: MenuGroup[] = [
  {
    label: 'Dashboard',
    key: paths.superAdmin.default,
    icon: ChartColumnBig,
  },
  {
    label: 'Org Management',
    key: paths.superAdmin.organizations.list,
    icon: Building,
    items: [
      {
        title: 'Organizations',
        url: paths.superAdmin.organizations.list,
        icon: CalendarDays,
      },
      {
        title: 'Venues',
        url: paths.superAdmin.venue.default,
        icon: CalendarDays,
      },
      {
        title: 'Events',
        url: paths.superAdmin.events.default,
        icon: CalendarDays,
      },
      {
        title: 'Highlights',
        url: paths.superAdmin.hightLight.default,
        icon: CalendarDays,
      },
      {
        title: 'Reviews',
        url: paths.superAdmin.reviews,
        icon: CalendarDays,
      },
      {
        title: 'QR codes',
        url: paths.superAdmin.qrCodes,
        icon: CalendarDays,
      },
      {
        title: 'Updates',
        url: paths.superAdmin.updates,
        icon: CalendarDays,
      },
    ],
  },
  {
    label: 'Menu',
    key: paths.superAdmin.menuList,
    icon: List,
    items: [
      {
        title: 'Menu List',
        url: paths.superAdmin.menuList,
        icon: CalendarDays,
      },
      {
        title: 'Menu Items',
        url: paths.superAdmin.menuItems,
        icon: CalendarDays,
      },
      {
        title: 'Subcategories',
        url: paths.superAdmin.menuSubcategories,
        icon: CalendarDays,
      },
      {
        title: 'Discounts',
        url: paths.superAdmin.discounts,
        icon: CalendarDays,
      },
    ],
  },
  {
    label: 'Preset Menu',
    key: 'preset-menu-panel',
    icon: ClipboardList,
    panel: 'presetMenu',
  },
  {
    label: 'Loyalty',
    key: paths.superAdmin.loyalty.default,
    icon: Handshake,
    items: [
      {
        title: 'Dashboard',
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
        title: 'Members',
        url: paths.superAdmin.members,
        icon: Tags,
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
        title: 'Referrals',
        url: paths.superAdmin.referrals,
        icon: Tags,
      },
      {
        title: 'Referral Analytics',
        url: paths.superAdmin.referralsAnalytics,
        icon: Tags,
      },
      {
        title: 'Transactions',
        url: paths.superAdmin.transactions.default,
        icon: Tags,
      },
      {
        title: 'Settings',
        url: paths.superAdmin.settings,
        icon: Tags,
      },
    ],
  },
  {
    label: 'Global Loyalty',
    key: paths.superAdmin.globalLoyalty.default,
    icon: Earth,
    items: [
      {
        title: 'Dashboard',
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
        title: 'Referrals',
        url: paths.superAdmin.globalReferrals,
        icon: Tags,
      },
      {
        title: 'Referral Analytics',
        url: paths.superAdmin.globalReferralsAnalytics,
        icon: Tags,
      },
      {
        title: 'Reward category',
        url: paths.superAdmin.rewardCategory,
        icon: ArrowBigUp,
      },
      {
        title: 'Transactions',
        url: paths.superAdmin.globalTransactions.default,
        icon: Tags,
      },
    ],
  },
  {
    label: 'Ticketing',
    key: paths.superAdmin.ticketing,
    icon: Ticket,
    items: [
      {
        title: 'Ticket List',
        url: paths.superAdmin.ticketing,
        icon: CalendarDays,
      },
      {
        title: 'Giveaways',
        url: paths.superAdmin.giveaways,
        icon: CalendarDays,
      },
      {
        title: 'Transactions',
        url: paths.superAdmin.ticketingTransactions,
        icon: ChartBar,
      },
    ],
  },
  {
    label: 'Reservations',
    key: paths.superAdmin.reservation,
    icon: CalendarDays,
    items: [
      {
        title: 'Reservations',
        url: paths.superAdmin.reservation,
        icon: CalendarDays,
      },
      {
        title: 'Calendar view',
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
    label: 'Pleis Management',
    key: paths.superAdmin.category.default,
    icon: ChartNoAxesGantt,
    items: [
      {
        title: 'Categories',
        url: paths.superAdmin.category.default,
        icon: ChartNoAxesGantt,
      },
      {
        title: 'Tags',
        url: paths.superAdmin.tags.default,
        icon: CalendarDays,
      },
      {
        title: 'Tags Type',
        url: paths.superAdmin.tagType,
        icon: CalendarDays,
      },
      {
        title: 'Venue types',
        url: paths.superAdmin.venueType.default,
        icon: ChartBar,
      },
      {
        title: 'Browser control',
        url: paths.superAdmin.browserControl.default,
        icon: ChartBar,
      },
      {
        title: 'Suppliers',
        url: paths.superAdmin.suppliers.default,
        icon: ChartBar,
      },
      {
        title: 'Notification center',
        url: paths.superAdmin.globalNotification,
        icon: CalendarDays,
      },
      // {
      //   title: 'Notification analytics',
      //   url: paths.superAdmin.globalNotificationAnalytics,
      //   icon: CalendarDays,
      // },
    ],
  },
  {
    label: 'Loyalty Settings',
    key: paths.superAdmin.tiers,
    icon: SlidersVertical,
    items: [
      {
        title: 'Tiers',
        url: paths.superAdmin.tiers,
        icon: CalendarDays,
      },
      {
        title: 'Level Status',
        url: paths.superAdmin.levelStatus,
        icon: ArrowBigUp,
      },
      {
        title: 'Status Badges',
        url: paths.superAdmin.status,
        icon: ArrowBigUp,
      },
    ],
  },
  {
    label: 'In App Ordering',
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
        title: 'Transactions',
        url: paths.superAdmin.orderTransactions,
        icon: ChartBar,
      },
      {
        title: 'Settings',
        url: paths.superAdmin.orderSettings,
        icon: CalendarDays,
      },
    ],
  },
  {
    label: 'User Management',
    key: paths.superAdmin.users.list,
    icon: User,
    items: [
      {
        title: 'Users list',
        url: paths.superAdmin.users.list,
        icon: UsersRound,
      },
      {
        title: 'Pending user list',
        url: paths.superAdmin.users.pendingList,
        icon: UsersRound,
      },
      {
        // title: 'Subscription management',
        title: 'Subscriptions',
        url: paths.superAdmin.subscription,
        icon: UsersRound,
      },
      {
        title: 'Terms of service',
        url: paths.superAdmin.terms.default,
        icon: UsersRound,
      },
    ],
  },
  {
    label: 'Transaction history',
    key: paths.superAdmin.transactionsHistory,
    icon: FileClock,
  },
  {
    label: 'Bundles',
    key: paths.superAdmin.bundles,
    icon: Box,
  },
  {
    label: 'Promo codes',
    key: paths.superAdmin.promoCodes,
    icon: TicketSlash,
  },
  {
    label: 'Marketing Requests',
    key: paths.superAdmin.marketingRequests,
    icon: Volume1,
  },
  {
    label: 'Help & Support',
    key: paths.superAdmin.helpSupport,
    icon: BadgeInfo,
  },
  {
    label: 'FAQs',
    key: paths.superAdmin.faqs,
    icon: ListFilter,
  },
  // {
  //   label: 'Giveaways',
  //   key: paths.superAdmin.giveaways,
  //   icon: Gift,
  // },
  // {
  //   label: 'Reviews',
  //   key: paths.superAdmin.reviews,
  //   icon: ThumbsUp,
  // },
  // {
  //   label: 'Notifications',
  //   key: paths.superAdmin.notification.default,
  //   icon: BellRing,
  // },
  // {
  //   label: 'Organizations',
  //   key: paths.superAdmin.organizations.list,
  //   icon: Building,
  // },
  // {
  //   label: 'Events',
  //   key: paths.superAdmin.events.default,
  //   icon: Calendar,
  // },
  // {
  //   label: 'Venue',
  //   key: paths.superAdmin.venue.default,
  //   icon: VenetianMask,
  // },
  // {
  //   label: 'Venue Type',
  //   key: paths.superAdmin.venueType.default,
  //   icon: Layers,
  // },
  // {
  //   label: 'Highlights',
  //   key: paths.superAdmin.hightLight.default,
  //   icon: Highlighter,
  // },
  // {
  //   label: 'Categories',
  //   key: paths.superAdmin.category.default,
  //   icon: List,
  // },

  // {
  //   label: 'QR Codes',
  //   key: paths.superAdmin.qrCodes,
  //   icon: QrCode,
  // },

  // {
  //   label: 'Ticketing',
  //   key: paths.superAdmin.ticketing,
  //   icon: Ticket,
  // },

  // {
  //   label: 'Preset',
  //   key: paths.superAdmin.preset.default,
  //   icon: SlidersHorizontal,
  // },
  // {
  //   label: 'Menu List',
  //   key: paths.superAdmin.menuList,
  //   icon: List,
  // },
  // {
  //   label: 'Items Category',
  //   key: paths.superAdmin.itemsCategory,
  //   icon: Grid2x2Check,
  // },
  // {
  //   label: 'Menu Items',
  //   key: paths.superAdmin.menuItems,
  //   icon: SquareMenu,
  // },
  // {
  //   label: 'Tiers',
  //   key: paths.superAdmin.tiers,
  //   icon: TriangleDashed,
  // },
  // {
  //   label: 'Status',
  //   key: paths.superAdmin.status,
  //   icon: ChartNoAxesColumnIncreasing,
  // },
  // {
  //   label: 'Browser Control',
  //   key: paths.superAdmin.browserControl.default,
  //   icon: Settings,
  // },
  // {
  //   label: 'Tags',
  //   key: paths.superAdmin.tags.default,
  //   icon: Hash,
  // },

  // {
  //   label: 'Supplier',
  //   key: paths.superAdmin.suppliers.default,
  //   icon: Package,
  // },
  // {
  //   label: 'Terms & Conditions',
  //   key: paths.superAdmin.terms.default,
  //   icon: ClipboardPenLine,
  // },
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
