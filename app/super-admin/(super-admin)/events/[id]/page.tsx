'use client';

import Header from '@/app/common/header';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Eye, DollarSign, ShieldCheck, Plus } from 'lucide-react';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const event = {
    image: 'https://images.unsplash.com/photo-1606788075760-5f8f2b089edb',
    title: 'Tech Conference 2025',
    venue: 'Convention Center, San Francisco',
    fromDate: '2025-08-12',
    endDate: '2025-08-14',
    organization: 'TechOrg Inc.',
    views: 3450,
    status: 'Upcoming',
    ticketsSold: 720,
    revenue: 14400,
    totalTickets: 1000,
};

const viewsData = [
    { date: 'Jul 6', views: 210 },
    { date: 'Jul 7', views: 340 },
    { date: 'Jul 8', views: 400 },
    { date: 'Jul 9', views: 230 },
    { date: 'Jul 10', views: 450 },
    { date: 'Jul 11', views: 480 },
    { date: 'Jul 12', views: 520 },
];

const Page = () => {

    const { id } = useParams();
    const openModal = useBoolean();

    const schema = Yup.object().shape({
        ticketName: Yup.string().required("Ticket name is required"),
        price: Yup.string().required("Price is required"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            ticketName: '',
            price: '',
        },
    });
    const onSubmit = (data: any) => {
        openModal.onFalse();
    };
    const handleClose = () => {
        methods.reset();
        openModal.onFalse();
    }

    return (
        <div className="space-y-6">
            <Header
                links={[
                    { name: 'Dashboard', href: '/super-admin' },
                    { name: 'Events', href: '/super-admin/events' },
                    { name: 'Event Detail', href: '' },
                ]}
            />

            {/* Basic Event Info */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 ">
                    <div>
                        <img
                            src={"https://github.com/shadcn.png"}
                            alt={event.title}
                            className="rounded-lg border w-full md:h-[400px] object-cover"
                        />
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className='flex justify-between md:flex-row flex-col '>
                            <div className=''>
                                <p className="font-medium text-gray-600">Event Title</p>
                                <p>{event.title}</p>
                            </div>
                            <div>
                                <Button className='rounded-4xl py-2 bg-blue-700 cursor-pointer text-white hover:bg-blue-800' onClick={openModal.onTrue}>
                                    <Plus className='' />
                                    Add Ticket
                                </Button>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Organization</p>
                            <p>{event.organization}</p>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <p className="font-medium text-gray-600">Start Date</p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="w-4 h-4" />
                                    {event.fromDate}
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600">End Date</p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="w-4 h-4" />
                                    {event.endDate}
                                </div>
                            </div>
                        </div>
                        <hr />

                        <div className="flex gap-6">
                            <div>
                                <p className="font-medium text-gray-600">Venue</p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    {event.venue}
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600">Status</p>
                                <Badge variant="default">{event.status}</Badge>
                            </div>
                        </div>
                        <hr />

                        <div>
                            <p className="font-medium text-gray-600">Total Views</p>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                {event.views} views
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="shadow-md">
                    <CardContent className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Tickets Sold</p>
                            <h3 className="text-xl font-semibold">{event.ticketsSold}</h3>
                        </div>
                        {/* <TicketCheck className="w-8 h-8 text-blue-600" /> */}
                        <ShieldCheck className='md:w-15 w-10  md:h-15 h-10' />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                            <h3 className="text-xl font-semibold">${event.revenue.toLocaleString()}</h3>
                        </div>
                        <DollarSign className="md:w-15 md:h-15 w-10 h-10 " />
                    </CardContent>
                </Card>


            </div>

            {/* Bar Chart */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Event Views (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={viewsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="views" barSize={70} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            {/* dialog for create ticket */}
            <Dialog open={openModal.value} onOpenChange={handleClose}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Add Ticket</DialogTitle>
                    </DialogHeader>
                    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-1 gap-2'>
                            <RHFTextField
                                name="ticketName"
                                label="Ticket Name"
                                placeholder="Enter Ticket Name"
                                className="w-full"
                            />
                            <RHFTextField
                                name="price"
                                label="Price"
                                placeholder="Enter Ticket Price"
                                type="number"
                                className="w-full "
                            />
                        </div>

                        <div className='flex justify-end gap-2 mt-4'>
                            <Button type="submit" className=" bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                Create Ticket
                            </Button>
                        </div>

                    </FormProvider>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Page;
