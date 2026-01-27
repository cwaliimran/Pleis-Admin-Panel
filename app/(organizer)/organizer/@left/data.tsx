import type { LucideIcon } from 'lucide-react';
import {
  Building,
  Calendar,
  ChartColumnBig,
  Gift,
  // Grid2x2Check,
  Handshake,
  Highlighter,
  List,
  ListOrdered,
  Megaphone,
  Podcast,
  SquareMenu,
  Tags,
  ThumbsUp,
  TicketSlash,
  VenetianMask,
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
    label: 'Organizations',
    key: paths.organizer.organizations.list,
    icon: Building,
  },
  {
    label: 'Events',
    key: paths.organizer.events.list,
    icon: Calendar,
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
        title: 'Members',
        url: paths.organizer.members,
        icon: Tags,
      },
      {
        title: 'Settings',
        url: paths.organizer.settings,
        icon: Tags,
      },
      {
        title: 'Referrals',
        url: paths.organizer.referrals,
        icon: Tags,
      },
      {
        title: 'Transactions',
        url: paths.organizer.transactions.default,
        icon: Tags,
      },
    ],
  },
  {
    label: 'Venue',
    key: paths.organizer.venue.default,
    icon: VenetianMask,
  },
  {
    label: 'Highlights',
    key: paths.organizer.hightLight.default,
    icon: Highlighter,
  },
  {
    label: 'Menu List',
    key: paths.organizer.menuList,
    icon: List,
  },
  {
    label: 'Menu Items',
    key: paths.organizer.menuItems,
    icon: SquareMenu,
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
    label: 'Marketing Requests',
    key: paths.organizer.marketingRequests,
    icon: Volume1,
  },
  {
    label: 'Reviews',
    key: paths.organizer.reviews,
    icon: ThumbsUp,
  },
  {
    label: 'Updates',
    key: paths.organizer.updates,
    icon: Megaphone,
  },
  {
    label: 'Promo codes',
    key: paths.organizer.promoCodes,
    icon: TicketSlash,
  },
  {
    label: 'Giveaways',
    key: paths.organizer.giveaways,
    icon: Gift,
  },
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
