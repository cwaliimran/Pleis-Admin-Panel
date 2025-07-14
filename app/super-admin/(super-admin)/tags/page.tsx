"use client"
import Header from '@/app/common/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'
import FormProvider, {  RHFTextField } from '@/components/rhf'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { useBoolean } from '@/hooks/useBoolean'

const defaultValues = {
    name: '',
}

const Page = () => {

    const openModal = useBoolean();

    const schema = Yup.object().shape({
        name: Yup.string().required("Tag Name is required"),
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
    }



    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Tags", href: "" },
                ]}
            />
            <div>
                <div className=' w-full flex items-center justify-end'>
                    <Button className='rounded-4xl py-2 bg-blue-700 cursor-pointer text-white hover:bg-blue-800' onClick={openModal.onTrue}>
                        <Plus className='' />
                        Create Tag
                    </Button>
                </div>
            </div>
            <Dialog open={openModal.value} onOpenChange={CloseModal}>
                <DialogOverlay
                    className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center md:w-lg w-full">
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle> {openModal.value ? "Create Tag" : "Edit Tag"} </DialogTitle>
                        </DialogHeader>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4 mt-4">
                                <RHFTextField
                                    name='name'
                                    label='Tag Name'
                                    placeholder='Enter Tag Name'
                                    className={` ${methods.formState.errors.name ? 'border-red-400' : ''}`}
                                />

                                <div className='flex justify-end gap-2'>
                                    <Button type='submit' className='bg-blue-700 text-white hover:bg-blue-800 cursor-pointer'>
                                        {openModal.value ? "Add Tag" : "Update Tag"}
                                    </Button>
                                </div>
                            </div>
                        </FormProvider>

                    </DialogContent>
                </DialogOverlay>
            </Dialog>
        </div >
    )
}

export default Page