
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
    HeartPlus
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
        label: "Categories",
        key: paths.superAdmin.category.default,
        icon: List,
        items: [
            {
                title: "Create Category",
                url: paths.superAdmin.category.create,
                icon: CalendarDays,
            },
            {
                title: "Category List",
                url: paths.superAdmin.category.list, // Example ID
                icon: CalendarDays,
            }
        ]
    },
    {
        label: "Tags",
        key: paths.superAdmin.tags,
        icon: Hash,
    },
    {
        label: "Organizations",
        key: paths.superAdmin.organizations.default,
        icon: Building,
        items: [
            {
                title: "Create Organization",
                url: paths.superAdmin.organizations.create,
                icon: Home,
            },
            {
                title: "Organization List",
                url: paths.superAdmin.organizations.list,
                icon: Home,
            }
        ]
    },
    {
        label: "User",
        key: paths.superAdmin.users.default,
        icon: User,
        items: [
            {
                title: "Create User",
                url: paths.superAdmin.users.create,
                icon: UsersRound,
            },
            {
                title: "User List",
                url: paths.superAdmin.users.list, // Example ID
                icon: UsersRound,
            },
            {
                title: "Pending User List",
                url: paths.superAdmin.users.pendingList, // Example ID
                icon: UsersRound,
            }
        ]
    },
    {
        label: "Events",
        key: paths.superAdmin.evnets.default,
        icon: Calendar,
        items: [
            {
                title: "Create Event",
                url: paths.superAdmin.evnets.create,
                icon: Tags,
            },
            {
                title: "Events List",
                url: paths.superAdmin.evnets.list, // Example ID
                icon: Tags,
            }
        ]
    },
    {
        label: "Update",
        key: paths.superAdmin.update.default,
        icon: ChevronsUp,
        items: [
            {
                title: "Create Update",
                url: paths.superAdmin.update.create,
                icon: CreditCard,
            },
            {
                title: "Update List",
                url: paths.superAdmin.update.list, // Example ID
                icon: CreditCard,
            }
        ]
    },
    {
        label: "Venue",
        key: paths.superAdmin.venue.default,
        icon: VenetianMask,
        items: [
            {
                title: "Create Venue",
                url: paths.superAdmin.venue.create,
                icon: Bell,
            },
            {
                title: "Venues List",
                url: paths.superAdmin.venue.list, // Example ID
                icon: Bell,
            }
        ]
    },
    {
        label: "Venue Type",
        key: paths.superAdmin.vanueType.default,
        icon: VenetianMask,
        items: [
            {
                title: "Create Venue Type",
                url: paths.superAdmin.vanueType.create,
                icon: Rocket,
            },
            {
                title: "Venue Type List",
                url: paths.superAdmin.vanueType.list, // Example ID
                icon: Rocket,
            }
        ]
    },
    {
        label: "Region",
        key: paths.superAdmin.region.default,
        icon: ChartArea,
        items: [
            {
                title: "Create Region",
                url: paths.superAdmin.region.create,
                icon: Settings,
            },
            {
                title: "Region List",
                url: paths.superAdmin.region.list, // Example ID
                icon: Settings,
            }
        ]
    },
    {
        label: "Marketing Requests",
        key: paths.superAdmin.marketing,
        icon: Volume1,
    },
    {
        label: "Transactions",
        key: paths.superAdmin.transactions.default,
        icon: ArrowRightLeft,
        items: [
            {
                title: "Premium Transaction",
                url: paths.superAdmin.transactions.premium,
                icon: Settings,
            },
            {
                title: "Transaction List",
                url: paths.superAdmin.transactions.list, // Example ID
                icon: Settings,
            }, {
                title: "Refund List",
                url: paths.superAdmin.transactions.refund, // Example ID
                icon: Settings,
            }
        ]
    },
    {
        label: "Add Support",
        key: paths.superAdmin.addSupport,
        icon: HeartPlus,
    }
]