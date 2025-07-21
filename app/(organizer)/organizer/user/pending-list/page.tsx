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
    const pendingModal = useBoolean();

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
    const handlePending = (id: string) => {
        pendingModal.onTrue();
    }
    const onPending = () => {
        pendingModal.onFalse();
    }

    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Pending Users List", href: "" },
                ]}
            />
            <div>
               
            </div>
           
            <ConfirmDialog
                open={deleteModal.value}
                title="Delete User"
                content="Are you sure you want to delete this?"
                onClose={deleteModal.onFalse}
                onConfirm={onDelete}
            />
            <ConfirmDialog
                open={pendingModal.value}
                title="Active User"
                content="Are you sure you want to active this user?"
                onClose={pendingModal.onFalse}
                onConfirm={onPending}
            />
            <UserTable handleDelete={handleDelete} handleEdit={handleEdit} pendingUser={true} handlePending={handlePending} />
        </div >
    )
}

export default Page