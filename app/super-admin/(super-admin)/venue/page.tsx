"use client"
import Header from '@/app/common/header'
import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useRef } from 'react'
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { useBoolean } from '@/hooks/useBoolean'
import VenueTable from '@/sections/venue/venueTable'
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog'
import RHFTextfieldWithSelect from '@/components/rhf/rhf-text-field-with-select'

const defaultValues = {
    // image: null,
    name: '',
    venueType: '',
    organization: '',
    location: '',
}

const Page = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openModal = useBoolean();
    const editModal = useBoolean();
    const deleteModal = useBoolean();

    const schema = Yup.object().shape({
        // image: Yup.mixed().nullable(),
        name: Yup.string().required("Venue name is required"),
        venueType: Yup.string().required("Venue Type is required"),
        organization: Yup.string().required("Organization is required"),
        location: Yup.string().required("Location is required"),
        clity: Yup.string(),
        country: Yup.string(),
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

    const handleDelete = (id: string) => {
        deleteModal.onTrue();
    }
    const onDelete = () => {
        deleteModal.onFalse();
    }

    const handleAvatarChange = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Venues", href: "" },
                ]}
            />
            <div>
                <div className=' w-full flex items-center justify-end'>
                    <Button className='rounded-4xl py-2 bg-blue-700 cursor-pointer text-white hover:bg-blue-800' onClick={openModal.onTrue}>
                        <Plus className='' />
                        Create Venue
                    </Button>
                </div>
            </div>
            {/* dialog for add and update the venue */}
            <Dialog open={openModal.value} onOpenChange={CloseModal}>
                <DialogOverlay
                    className="fixed inset-0 bg-white   bg-opacity-30 flex items-center justify-center md:w-lg w-full">
                    <DialogContent className=' dark:bg-[#171717] '>
                        <DialogHeader>
                            <DialogTitle> {!editModal.value ? "Create Venue" : "Edit Venue"} </DialogTitle>
                        </DialogHeader>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4 mt-4">
                                {/* <RHFUploadAvatar name="image" label="Venue Image" /> */}

                                <div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAvatarChange}
                                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        Upload Floor Plan
                                    </Button>
                                    <p className="text-gray-500 text-sm mt-2">
                                        JPG, GIF or PNG. 1MB max.
                                    </p>
                                </div>


                                <RHFTextField
                                    name='name'
                                    label='Venue Name'
                                    placeholder='Enter Venue Name'
                                    className={` ${methods.formState.errors.name ? 'border-red-400' : ''}`}

                                />

                                <RHFTextfieldWithSelect
                                    name="venueType"
                                    label='Venue Type'
                                    placeholder="Select Venue Type"
                                    options={[
                                        { value: "event1", label: "Event 1" },
                                        { value: "event2", label: "Event 2" },
                                        { value: "event3", label: "Event 3" },
                                    ]}
                                />
                                <RHFTextfieldWithSelect
                                    name='organization'
                                    label='Organization'
                                    placeholder='Select Organization'
                                    options={[
                                        { label: 'Organization A', value: 'org-a' },
                                        { label: 'Organization B', value: 'org-b' },
                                        { label: 'Organization C', value: 'org-c' }
                                    ]}
                                />
                                <RHFTextField
                                    name='location'
                                    label='Location'
                                    placeholder='Enter Location'
                                />

                                <div>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463.9634089519931!2d14.611164251664785!3d45.23098434778954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476363d3cb88c945%3A0x7b1900b8b651a903!2sObala!5e1!3m2!1sen!2s!4v1752833828572!5m2!1sen!2s" className='md:w-[470px] w-full md:h-[160px] h-full ' loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>

                                <div className='flex justify-end gap-2'>
                                    <Button type='submit' className='bg-blue-700 text-white hover:bg-blue-800 cursor-pointer'>
                                        {!editModal.value ? "Add Venue" : "Update Venue"}
                                    </Button>
                                </div>
                            </div>
                        </FormProvider>

                    </DialogContent>
                </DialogOverlay>
            </Dialog>
            
            {/* dialog for delete venue */}
            <ConfirmDialog
                open={deleteModal.value}
                title="Delete Venue"
                content="Are you sure you want to delete this?"
                onClose={deleteModal.onFalse}
                onConfirm={onDelete}
            />
            <VenueTable handleDelete={handleDelete} handleEdit={handleEdit} />
        </div >
    )
}

export default Page