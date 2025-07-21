"use client"
import Header from '@/app/common/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { useBoolean } from '@/hooks/useBoolean'
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar'
import { EventTable } from '@/sections/event'
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { userTags } from '@/sections/users/data'
import { Badge } from '@/components/ui/badge'
import EventCard from '@/sections/event/eventCard'
import UpcomingUpdate from '@/sections/event/upcomingUpdate'
import UpcomingUpdateCard from '@/sections/event/upcomingUpdateCard'
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect'

const defaultValues = {
    image: null,
    name: '',
    venue: [],
    category: [],
    tag: [],
    organization: '',
    fromDate: new Date(),
    endDate: new Date(),
    description: ''
}

const Page = () => {

    const openModal = useBoolean();
    const editModal = useBoolean();
    const deleteModal = useBoolean();
    const [preview, setPreview] = useState<string | null>(null);

    const schema = Yup.object().shape({
        image: Yup.mixed().nullable(),
        name: Yup.string().required("Event name is required"),
        venue: Yup.array()
            .min(1, 'At least one Venue is required')
            .of(Yup.string().required('Venue is required')),
        category: Yup.array()
            .min(1, 'At least one Category is required')
            .of(Yup.string().required('Category is required')),
        tag: Yup.array()
            .min(1, 'At least one Tag is required')
            .of(Yup.string().required('Tag is required')),
        organization: Yup.string().required("Organization is required"),
        fromDate: Yup.date().required("From Date is required"),
        endDate: Yup.date().required("End Date is required"),
        description: Yup.string().required("Description is required")
    })

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues
    })

    const onSubmit = (data: any) => {
    }
    const CloseModal = () => {
        methods.reset(defaultValues);
        openModal.onFalse();
        editModal.onFalse();
    }
    const handleEdit = (id: string) => {
        openModal.onTrue();
        editModal.onTrue();
    }


    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "New Event", href: "" },
                ]}
            />
            <div>

            </div>

            <div className='grid grid-cols-12 gap-4'>
                <div className='md:col-span-8 col-span-12'>
                    <Card className='shadow-md   dark:bg-[#171717]'>
                        <CardHeader>
                            <CardTitle>Create a new reward</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                                <div className='flex md:flex-row flex-col gap-2 items-center'>
                                    <Controller
                                        name={"image"}
                                        control={methods.control}
                                        render={({ field }) => (
                                            <div>
                                                <label
                                                    className="relative flex flex-col items-center justify-center w-[220px] h-[238px] border-2  border-gray-300 rounded-xl bg-gray-50 cursor-pointer overflow-hidden hover:border-gray-400 transition"
                                                >
                                                    {preview ? (
                                                        <img
                                                            src={preview}
                                                            alt="Preview"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 text-lg">+ Add photo</span>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setPreview(reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                                field.onChange(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    />
                                    <div className='w-full flex-col'>
                                        <RHFTextField
                                            name='name'
                                            placeholder='Enter Event Name'
                                            className={` h-[40px] !w-full mb-3 rounded-3xl ${methods.formState.errors.name ? 'border-red-400' : ''}`}
                                        />
                                        <RHFTextField
                                            name="description"
                                            placeholder="Type Reward Description"
                                            multiline={true}
                                            rows={4}
                                            maxLength={100}
                                            className={` min-h-[180px] ${methods.formState.errors.description ? 'border-red-400' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div className=' gap-2 flex flex-col mt-2'>
                                   
                                    <RHFMultiSelect
                                        name="venue"
                                        label="Select Venues"
                                        placeholder='Select Venue'
                                        options={[
                                            { label: 'Venue 1', value: 'venue1' },
                                            { label: 'Venue 2', value: 'venue2' },
                                            { label: 'Venue 3', value: 'venue3' }
                                        ]}
                                    />
                                    <RHFMultiSelect
                                        name="category"
                                        label="Select Categories"
                                        placeholder='Select Category'
                                        options={[
                                            { label: 'Conference', value: 'conference' },
                                            { label: 'Workshop', value: 'workshop' },
                                            { label: 'Webinar', value: 'webinar' }
                                        ]}
                                    />
                                   
                                    <RHFMultiSelect
                                        name="tag"
                                        label="Select Tags"
                                        placeholder='Select Tag'
                                        options={[
                                            { label: 'Technology', value: 'technology' },
                                            { label: 'Business', value: 'business' },
                                            { label: 'Health', value: 'health' }
                                        ]}
                                    />

                                    <RHFSelectField
                                        name='organization'
                                        label='Organization'
                                        placeholder='Select Organization'
                                        className='w-full  h-[40px]flex-1 mb-3'
                                        options={[
                                            { label: 'Organization A', value: 'orgA' },
                                            { label: 'Organization B', value: 'orgB' },
                                            { label: 'Organization C', value: 'orgC' }
                                        ]}
                                    />
                                    <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
                                        <RHFDate
                                            name='fromDate'
                                            label='From Date'
                                            className={` h-[40px] ${methods.formState.errors.fromDate ? 'border-red-400' : ''}`}
                                        />
                                        <RHFDate
                                            name='endDate'
                                            label='End Date'
                                            className={` h-[40px] ${methods.formState.errors.endDate ? 'border-red-400' : ''}`}
                                        />
                                    </div>
                                    <div className='flex justify-end mt-4'>
                                        <Button type='submit' className='bg-primary text-white hover:bg-primary cursor-pointer'>
                                            Create Event
                                        </Button>
                                    </div>
                                </div>



                            </FormProvider>
                        </CardContent>
                    </Card>
                </div>
                <div className='md:col-span-4 col-span-12 '>

                    {[1, 2].map(() => (
                        <EventCard key={Math.random()} />
                    ))}
                    <UpcomingUpdate />
                    <UpcomingUpdateCard />

                </div>
            </div>
        </div >
    )
}

export default Page