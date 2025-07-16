


export const paths = {
    superAdmin: {
        default: "/super-admin",
        menu: "/super-admin/menu",
        invoices: "/super-admin/invoices",
        category: {
            default: "/super-admin/category",
            create: "/super-admin/category/create-category",
            list: "/super-admin/category/category-list",
        },
        hightLight: {
            default: "/super-admin/highlight",
            create: "/super-admin/highlight/create-highlight",
            list: "/super-admin/highlight/highlight-list",
        },
        tags: {
            default: "/super-admin/tags",
            create: "/super-admin/tags/create-tag",
            list: "/super-admin/tags/tag-list",
        },
        organizations: {
            default: "/super-admin/organization",
            create: "/super-admin/organization/create-organization",
            list: "/super-admin/organization/organization-list",
        },
        users: {
            default: "/super-admin/user",
            create: "/super-admin/user/create-user",
            list: "/super-admin/user/user-list",
            pendingList: "/super-admin/user/pending-list",
        },
        evnets: {
            default: "/super-admin/events",
            create: "/super-admin/events/create-event",
            list: "/super-admin/events/event-list",
        },
        update: {
            default: "/super-admin/update",
            create: "/super-admin/update/create-update",
            list: "/super-admin/update/update-list",

        },
        venue: {
            default: "/super-admin/venue",
            create: "/super-admin/venue/create-venue",
            list: "/super-admin/venue/venue-list",

        },
        vanueType: {
            default: "/super-admin/venue-type",
            create: "/super-admin/venue-type/create",
            list: "/super-admin/venue-type/venue-type-list",

        },
        region: {
            default: "/super-admin/region",
            create: "/super-admin/region/create-region",
            list: "/super-admin/region/region-list",

        },
        marketing: {
            detault: "/super-admin/marketing",
            create: "/super-admin/marketing/create-marketing",
            list: '/super-admin/marketing/marketing-list'
        },
        transactions: {
            default: "/super-admin/transactions",
        },
        notification: {
            default: "/super-admin/notification",
            overview: "/super-admin/notification/overview",
            list: "/super-admin/notification/list",
            createUpdate: "/super-admin/notification/create-update",
            createGiveaway: "/super-admin/notification/create-giveaway",
            createNotification: "/super-admin/notification/create-notification",
        },
        subscription: '/super-admin/subscription',
        addSupport: '/super-admin/add-support',

    }
}