'use client';

import Header from '@/app/common/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    CalendarDays,
    CheckCircle2,
    Mail,
    Phone,
    XCircle,
    Globe,
    MapPin,
    Building,
    Instagram,
    Facebook,
    Youtube,
    Linkedin,
    Banknote,
} from 'lucide-react';
import React from 'react';

const organization = {
    image: 'https://github.com/shadcn.png',
    name: 'TechNova Inc.',
    email: 'contact@technova.com',
    phone: '+1 (555) 123-4567',
    createdAt: '2023-01-15',
    status: 'active',
    subscriptionValidity: '2024-12-31',
    pleisCommission: '10%',
    region: 'North America',
    type: 'For-Profit',
    category: 'Technology',
    location: 'Silicon Valley',
    clity: 'San Francisco',
    country: 'USA',
    description: 'Innovating the future with cutting-edge technology.',
    businessId: 'BIZ-123456',
    companyName: 'TechNova Corp',
    accountName: 'TechNova Inc.',
    accountNumber: '9876543210',
    oib: 'OIB-987654',
    address: '123 Innovation Drive',
    postalCode: '94016',
    city: 'San Francisco',
    // social
    instagram: 'https://instagram.com/technova',
    facebook: 'https://facebook.com/technova',
    youtube: 'https://youtube.com/@technova',
    linkedin: 'https://linkedin.com/company/technova',
};

const Page = () => {
    return (
        <div className="space-y-4">
            <Header
                links={[
                    { name: 'Dashboard', href: '/super-admin' },
                    { name: 'Organization', href: '/super-admin/organization' },
                    { name: 'Organization Detail', href: '' },
                ]}
            />

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>{organization.name}</CardTitle>
                </CardHeader>

                <CardContent className="grid md:grid-cols-2 gap-6">
                    {/* Left - Organization Image */}
                    <div>
                        <img
                            src={organization.image}
                            alt={organization.name}
                            className="rounded-xl border shadow-lg w-full md:h-[500px] object-cover"
                        />
                    </div>

                    {/* Right - Details */}
                    <div className="space-y-6 text-sm">
                        {/* Basic Info */}
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Basic Info</h4>
                            <div className="space-y-2">
                                <div className="flex gap-2 items-center text-blue-600">
                                    <Mail className="w-4 h-4" /> {organization.email}
                                </div>
                                <div className="flex gap-2 items-center text-green-600">
                                    <Phone className="w-4 h-4" /> {organization.phone}
                                </div>
                                <div className="flex gap-2 items-center text-muted-foreground">
                                    <CalendarDays className="w-4 h-4" />
                                    Created At: {organization.createdAt}
                                </div>
                                <div className="flex gap-2 items-center">
                                    Status:
                                    <Badge
                                        variant={organization.status === 'active' ? 'default' : 'destructive'}
                                        className="flex items-center gap-1 capitalize"
                                    >
                                        {organization.status === 'active' ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <XCircle className="w-4 h-4" />
                                        )}
                                        {organization.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <hr />

                        {/* Business Info */}
                        <div>
                            <h4 className="font-semibold text-lg mb-3">Business Info</h4>

                            <div className="rounded-lg  space-y-4">
                                {/* Region and Type */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Globe className="w-4 h-4" />
                                        <span className="font-medium">Region:</span>
                                        <span>{organization.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building className="w-4 h-4" />
                                        <span className="font-medium">Type:</span>
                                        <span>{organization.type}</span>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="text-muted-foreground">
                                    <span className="font-medium">Category:</span> {organization.category}
                                </div>

                                {/* Description */}
                                <div className="text-muted-foreground">
                                    <span className="font-medium">Description:</span> {organization.description}
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Address Info */}
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Location</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold ">Location:</span>{' '}
                                    {organization.location}
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold ">City:</span>{' '}
                                    {organization.clity}
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold ">Country:</span>{' '}
                                    {organization.country}
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold">Postal Code:</span>{' '}
                                    {organization.postalCode}
                                </p>
                                <div className="md:col-span-2">
                                    <p className='text-muted-foreground'>
                                        <span className="font-semibold">Address:</span>{' '}
                                        {organization.address}
                                    </p>
                                </div>
                            </div>

                        </div>
                        <hr />
                        <div className="flex flex-col text-sm">
                            <p className="font-semibold text-lg mb-2">Social Links</p>

                            <div className=" ">
                                <a
                                    href={organization.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 transition"
                                >
                                    <Instagram className="w-5 h-5 text-pink-600" />
                                    <span className=" font-medium text-muted-foreground">Instagram</span>
                                </a>

                                <a
                                    href={organization.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-mdtransition"
                                >
                                    <Facebook className="w-5 h-5 text-blue-600" />
                                    <span className=" font-medium text-muted-foreground">Facebook</span>
                                </a>

                                <a
                                    href={organization.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 transition"
                                >
                                    <Youtube className="w-5 h-5 text-red-600" />
                                    <span className=" font-medium text-muted-foreground">YouTube</span>
                                </a>

                                <a
                                    href={organization.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 transition"
                                >
                                    <Linkedin className="w-5 h-5 text-sky-700" />
                                    <span className=" font-medium text-muted-foreground">LinkedIn</span>
                                </a>
                            </div>
                        </div>

                        <hr />

                        {/* Bank Info */}
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Bank Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  text-sm">
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold ">Company Name:</span>{' '}
                                    {organization.companyName}
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold ">Account Name:</span>{' '}
                                    {organization.accountName}
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold ">Account No:</span>{' '}
                                    {organization.accountNumber}
                                </p>
                                <p className='text-muted-foreground'>
                                    <span className="font-semibold ">OIB:</span>{' '}
                                    {organization.oib}
                                </p>
                            </div>

                        </div>

                        {/* Business Details */}
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Business Details</h4>
                            <div className="flex flex-col gap-4">
                                <p className='text-muted-foreground'><span className=' font-semibold '>Business ID:</span> {organization.businessId}</p>
                                <p className='text-muted-foreground'><span className=' font-semibold '>Subscription Validity:</span> {organization.subscriptionValidity}</p>
                                <p className="flex items-center gap-2 text-muted-foreground">
                                    <span className=' font-semibold flex gap-2 '>
                                        <Banknote className="w-4 h-4" />
                                        Commission: {organization.pleisCommission}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
