
import {
    Home,
    Settings,
    ChartColumnBig,
    CalendarDays,
    UsersRound,
    Tags,
    Bell,
    Rocket,
    LayoutDashboard,
    CreditCard,
    List,
    Hash,
    Building,
    User,
    Calendar,
    ChevronsUp,
    VenetianMask,
    ChartArea,
    Volume1,
    ArrowRightLeft,
    HeartPlus,
    Highlighter,
    Podcast
} from "lucide-react"
import { paths } from "./paths"

type MenuItem = {
    title: string
    url?: string
    icon: any
    items?: MenuItem[]
}

type MenuGroup = {
    label: string
    key: string,
    icon: any,
    items?: MenuItem[]
}

export const menuGroups: MenuGroup[] = [
    {
        label: "Dashboard",
        key: paths.superAdmin.default,
        icon: ChartColumnBig,
    },
    {
        label: "Organizations",
        key: paths.superAdmin.organizations.default,
        icon: Building,
        // items: [
        //     {
        //         title: "Create Organization",
        //         url: paths.superAdmin.organizations.create,
        //         icon: Home,
        //     },
        //     {
        //         title: "Organization List",
        //         url: paths.superAdmin.organizations.list,
        //         icon: Home,
        //     }
        // ]
    },
    {
        label: "Events",
        key: paths.superAdmin.evnets.default,
        icon: Calendar,
        // items: [
        //     {
        //         title: "Create Event",
        //         url: paths.superAdmin.evnets.create,
        //         icon: Tags,
        //     },
        //     {
        //         title: "Events List",
        //         url: paths.superAdmin.evnets.list, // Example ID
        //         icon: Tags,
        //     }
        // ]
    },
    {
        label: "Venue",
        key: paths.superAdmin.venue.default,
        icon: VenetianMask,
        // items: [
        //     {
        //         title: "Create Venue",
        //         url: paths.superAdmin.venue.create,
        //         icon: Bell,
        //     },
        //     {
        //         title: "Venues List",
        //         url: paths.superAdmin.venue.list, // Example ID
        //         icon: Bell,
        //     }
        // ]
    },
   
    {
        label: "Highlights",
        key: paths.superAdmin.hightLight.default,
        icon: Highlighter,
        // items: [
        //     {
        //         title: "Create Highlight",
        //         url: paths.superAdmin.hightLight.create,
        //         icon: CalendarDays,
        //     },
        //     {
        //         title: "Highlight List",
        //         url: paths.superAdmin.hightLight.list, // Example ID
        //         icon: CalendarDays,
        //     }
        // ]
    },
    {
        label: "Categories",
        key: paths.superAdmin.category.default,
        icon: List,
        // items: [
        //     {
        //         title: "Create Category",
        //         url: paths.superAdmin.category.create,
        //         icon: CalendarDays,
        //     },
        //     {
        //         title: "Category List",
        //         url: paths.superAdmin.category.list, // Example ID
        //         icon: CalendarDays,
        //     }
        // ]
    },
    {
        label: "Venue Type",
        key: paths.superAdmin.vanueType.default,
        icon: VenetianMask,
        // items: [
        //     {
        //         title: "Create Venue Type",
        //         url: paths.superAdmin.vanueType.create,
        //         icon: Rocket,
        //     },
        //     {
        //         title: "Venue Type List",
        //         url: paths.superAdmin.vanueType.list, // Example ID
        //         icon: Rocket,
        //     }
        // ]
    },
    {
        label: "Tags",
        key: paths.superAdmin.tags.default,
        icon: Hash,
        // items: [
        //     {
        //         title: "Create Tag",
        //         url: paths.superAdmin.tags.create,
        //         icon: Tags,
        //     },
        //     {
        //         title: "Tag List",
        //         url: paths.superAdmin.tags.list, // Example ID
        //         icon: Tags,
        //     }
        // ]
    },

    {
        label: "User",
        key: paths.superAdmin.users.default,
        icon: User,
        // items: [
        //     {
        //         title: "Create User",
        //         url: paths.superAdmin.users.create,
        //         icon: UsersRound,
        //     },
        //     {
        //         title: "User List",
        //         url: paths.superAdmin.users.list, // Example ID
        //         icon: UsersRound,
        //     },
        //     {
        //         title: "Pending User List",
        //         url: paths.superAdmin.users.pendingList, // Example ID
        //         icon: UsersRound,
        //     }
        // ]
    },
    {
        label: "Marketing Requests",
        key: paths.superAdmin.marketing.detault,
        icon: Volume1,
        // items: [
        //     {
        //         title: "Create Marketing",
        //         url: paths.superAdmin.marketing.create,
        //         icon: Volume1,
        //     },
        //     {
        //         title: "Marketing List",
        //         url: paths.superAdmin.marketing.list, // Example ID
        //         icon: Volume1,
        //     }
        // ]

    },
    {
        label: "Transactions",
        key: paths.superAdmin.transactions.default,
        icon: ArrowRightLeft,
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
    },
     {
        label: "Notification",
        key: paths.superAdmin.notification.default,
        icon: Bell,
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
    },
    
    {
        label: "Subscription",
        key: paths.superAdmin.subscription,
        icon: Podcast,
    },
    {
        label: "Add Support",
        key: paths.superAdmin.addSupport,
        icon: HeartPlus,
    }
]