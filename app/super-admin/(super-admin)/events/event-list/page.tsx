"use client"
import Header from '@/app/common/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { useBoolean } from '@/hooks/useBoolean'
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar'
import { EventTable } from '@/sections/event'
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog'
import { useRouter } from 'next/navigation'

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


    const router=useRouter();
    const openModal = useBoolean();
    const editModal = useBoolean();
    const deleteModal = useBoolean();

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
        // openModal.onTrue();
        // editModal.onTrue();
        router.push("/super-admin/events/create-event")
    }

    const handleDelete = (id: string) => {
        deleteModal.onTrue();
    }
    const onDelete = () => {
        deleteModal.onFalse();
    }

    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Events", href: "" },
                ]}
            />
            <div>
                <div className=' w-full flex items-center justify-end'>
                    <Button className='rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary'
                     onClick={()=>router.push('/super-admin/events/create-event')}>
                        <Plus className='' />
                        Create Event
                    </Button>
                </div>
            </div>
            {/* modal for add and update the event */}
            <Dialog open={openModal.value} onOpenChange={CloseModal}>
                <DialogOverlay
                    className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center md:w-lg w-full">
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle> {!editModal.value ? "Create Event" : "Edit Event"} </DialogTitle>
                        </DialogHeader>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4 mt-4">
                                <RHFUploadAvatar name="image" label="Event Image" />
                                <RHFTextField
                                    name='name'
                                    label='Event Name'
                                    placeholder='Enter Event Name'
                                    className={` ${methods.formState.errors.name ? 'border-red-400' : ''}`}
                                />
                                <div className='grid md:grid-cols-2 grid-1 gap-2 items-start'>
                                    <RHFSelectField
                                        name='venue'
                                        label='Venue'
                                        placeholder='Select Venue'
                                        className='w-full flex-1'
                                        options={[
                                            { label: 'Venue 1', value: 'venue1' },
                                            { label: 'Venue 2', value: 'venue2' },
                                            { label: 'Venue 3', value: 'venue3' }
                                        ]}
                                    />
                                    <RHFSelectField
                                        name='category'
                                        label='Category'
                                        placeholder='Select Category'
                                        className='w-full flex-1'
                                        options={[
                                            { label: 'Conference', value: 'conference' },
                                            { label: 'Workshop', value: 'workshop' },
                                            { label: 'Webinar', value: 'webinar' }
                                        ]}
                                    />
                                    <RHFSelectField
                                        name='tag'
                                        label='Tag'
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
                                        options={[
                                            { label: 'Organization A', value: 'orgA' },
                                            { label: 'Organization B', value: 'orgB' },
                                            { label: 'Organization C', value: 'orgC' }
                                        ]}
                                    />
                                    <RHFDate
                                        name='fromDate'
                                        label='From Date'
                                        className={` ${methods.formState.errors.fromDate ? 'border-red-400' : ''}`}
                                    />
                                    <RHFDate
                                        name='endDate'
                                        label='End Date'
                                        className={` ${methods.formState.errors.endDate ? 'border-red-400' : ''}`}
                                    />
                                </div>
                                <RHFTextField
                                    name='description'
                                    label='Description'
                                    placeholder='Enter Event Description'
                                    rows={6}
                                    multiline={true}
                                    className={` ${methods.formState.errors.description ? 'border-red-400' : ''}`}
                                />
                                <div className='flex justify-end gap-2'>
                                    <Button type='submit' className='bg-primary text-white hover:bg-primary cursor-pointer'>
                                        {!editModal.value ? "Add Event" : "Update Event"}
                                    </Button>
                                </div>
                            </div>
                        </FormProvider>

                    </DialogContent>
                </DialogOverlay>
            </Dialog>
            {/* modal for delete the enven */}
            <ConfirmDialog
                open={deleteModal.value}
                title="Delete Event"
                content="Are you sure you want to delete this?"
                onClose={deleteModal.onFalse}
                onConfirm={onDelete}
            />

            <EventTable handleDelete={handleDelete} handleEdit={handleEdit} />
        </div >
    )
}

export default Page