"use client"
import Header from '@/app/common/header'
import Superadminheader from '@/app/common/superadminheader'
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
import { UserTable } from '@/sections/users'
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog'

const defaultValues = {
    image: null,
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    address: '',
    phone: ''
}

const Page = () => {

    const openModal = useBoolean();
    const showPassword = useBoolean();
    const editModal = useBoolean();
    const deleteModal = useBoolean();

    const schema = Yup.object().shape({
        image: Yup.mixed().nullable(),
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        role: Yup.string().required("Role is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        address: Yup.string(),
        phone: Yup.string(),
    })

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues
    })

    const onSubmit = (data: any) => {
        console.log("Form Data:", data)
    }
    const CloseModal = () => {
        methods.reset(defaultValues);
        openModal.onFalse();
        editModal.onFalse();
    }
    const handleEdit = (id: string) => {
        console.log("id", id);
        openModal.onTrue();
        editModal.onTrue();
    }

    const handleDelete = (id: string) => {
        console.log("id", id)
        deleteModal.onTrue();
    }
    const onDelete = () => {
        console.log("Delete confirmed")
        deleteModal.onFalse();
    }

    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Users", href: "" },
                ]}
            />
            <div>
                <div className=' w-full flex items-center justify-end'>
                    <Button className='rounded-4xl py-2 bg-blue-700 cursor-pointer text-white hover:bg-blue-800' onClick={openModal.onTrue}>
                        <Plus className='' />
                        Create User
                    </Button>
                </div>
            </div>
            {/* dialog for add and update the user */}
            <Dialog open={openModal.value} onOpenChange={CloseModal}>
                <DialogOverlay
                    className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center md:w-lg w-full">
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle> {!editModal.value ? "Create User" : "Edit User"} </DialogTitle>
                        </DialogHeader>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-3 mt-4">
                                <RHFUploadAvatar name="image" label="Profile Image" />
                                <div className='grid md:grid-cols-2 grid-cols-1 gap-4 items-start'>
                                    <RHFTextField
                                        name='firstName'
                                        label='First Name'
                                        placeholder='Enter First Name'
                                        className={` ${methods.formState.errors.firstName ? 'border-red-400' : ''}`}

                                    />
                                    <RHFTextField
                                        name='lastName'
                                        label='Last Name'
                                        placeholder='Enter Last Name'
                                        className={` ${methods.formState.errors.lastName ? 'border-red-400' : ''}`}
                                    />
                                </div>
                                <RHFTextField
                                    name='email'
                                    label='Email'
                                    placeholder='Enter Email'
                                    className={` ${methods.formState.errors.email ? 'border-red-400' : ''}`}
                                />
                                <RHFTextField
                                    name='password'
                                    label='Password'
                                    type='password'
                                    placeholder='Enter Password'
                                    showPassword={showPassword.value}
                                    onTogglePassword={showPassword.onToggle}
                                    className={` ${methods.formState.errors.password ? 'border-red-400' : ''}`}
                                />
                                <RHFSelectField
                                    name='role'
                                    label='Role'
                                    placeholder='Select Role'
                                    options={[
                                        { label: 'Admin', value: 'admin' },
                                        { label: 'User', value: 'user' },
                                        { label: 'Super Admin', value: 'super-admin' }
                                    ]}
                                />

                                <div className=' grid md:grid-cols-2 grid-cols-1 gap-4'>
                                    <RHFTextField
                                        name='phone'
                                        label='Phone'
                                        placeholder='Enter Phone Number'
                                    />
                                    <RHFTextField
                                        name='address'
                                        label='Address'
                                        placeholder='Enter Address'
                                    />
                                </div>



                                <div className='flex justify-end gap-2'>
                                    <Button type='submit' className='bg-blue-700 text-white hover:bg-blue-800 cursor-pointer'>
                                        {!editModal.value ? "Add User" : "Update User"}
                                    </Button>
                                </div>
                            </div>
                        </FormProvider>

                    </DialogContent>
                </DialogOverlay>
            </Dialog>
            {/* dialog for delete the user */}
            <ConfirmDialog
                open={deleteModal.value}
                title="Delete User"
                content="Are you sure you want to delete this?"
                onClose={deleteModal.onFalse}
                onConfirm={onDelete}
            />
            <UserTable handleDelete={handleDelete}  handleEdit={handleEdit}/>
        </div >
    )
}

export default Page