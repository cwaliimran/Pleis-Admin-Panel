"use client"
import Header from '@/app/common/header'
import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
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
import VenueTable from '@/sections/venue/venueTable'
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog'

const defaultValues = {
    // image: null,
    name: '',
    venueType: '',
    organization: '',
    // location: '',
    clity: '',
    country: ''
}

const Page = () => {

    const openModal = useBoolean();
    const editModal = useBoolean();
    const deleteModal = useBoolean();

    const schema = Yup.object().shape({
        // image: Yup.mixed().nullable(),
        name: Yup.string().required("Venue name is required"),
        venueType: Yup.string().required("Venue Type is required"),
        organization: Yup.string().required("Organization is required"),
        // location: Yup.string().required("Location is required"),
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
                    <DialogContent className=' dark:bg-[#171717]'>
                        <DialogHeader>
                            <DialogTitle> {!editModal.value ? "Create Venue" : "Edit Venue"} </DialogTitle>
                        </DialogHeader>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4 mt-4">
                                {/* <RHFUploadAvatar name="image" label="Venue Image" /> */}
                                <RHFTextField
                                    name='name'
                                    label='Venue Name'
                                    placeholder='Enter Venue Name'
                                    className={` ${methods.formState.errors.name ? 'border-red-400' : ''}`}

                                />
                                <RHFSelectField
                                    name='venueType'
                                    label='Venue Type'
                                    placeholder='Select Venue Type'
                                    options={[
                                        { label: 'Indoor', value: 'indoor' },
                                        { label: 'Outdoor', value: 'outdoor' },
                                        { label: 'Virtual', value: 'virtual' }
                                    ]}
                                />

                                <RHFSelectField
                                    name='organization'
                                    label='Organization'
                                    placeholder='Select Organization'
                                    options={[
                                        { label: 'Organization A', value: 'org-a' },
                                        { label: 'Organization B', value: 'org-b' },
                                        { label: 'Organization C', value: 'org-c' }
                                    ]}
                                />
                                {/* <RHFTextField
                                    name='location'
                                    label='Location'
                                    placeholder='Enter Location'
                                    className={` ${methods.formState.errors.location ? 'border-red-400' : ''}`}

                                /> */}
                                <RHFSelectField
                                    name='clity'
                                    label='City'
                                    placeholder='Select City'
                                    options={[
                                        { label: 'New York', value: 'new-york' },
                                        { label: 'Los Angeles', value: 'los-angeles' },
                                        { label: 'Chicago', value: 'chicago' }
                                    ]}
                                />
                                <RHFTextField
                                    name='country'
                                    label='Country'
                                    placeholder='Enter Country'
                                />

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