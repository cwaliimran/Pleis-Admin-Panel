"use client"
import Superadminheader from '@/app/common/superadminheader'
import CustomBreadCrums from '@/components/breadcrums/customBreadCrums'
import FormProvider, { RHFCheckbox, RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf'
import { Card } from '@/components/ui/card'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Edit } from 'lucide-react'
import { useBoolean } from '@/hooks/useBoolean'

const Page = () => {

    const open = useBoolean();

    const fileRef = useRef<HTMLInputElement | null>(null)

    const [imagePreview, setImagePreview] = useState<string>("/images/blank-image.svg")

    const schema = Yup.object().shape({
        fname: Yup.string().required('First name is required'),
        lname: Yup.string().required('Last name is required'),
        phone: Yup.string().required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        role: Yup.string().required('Role is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        image: Yup.mixed().nullable()
    })

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            fname: '',
            lname: '',
            phone: '',
            address: '',
            role: '',
            email: '',
            password: '',
            image: null

        }
    })

    const {
        setValue,
        handleSubmit
    } = methods

    const onSubmit = (data: any) => {
        console.log("Form Data:", data)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)
            setValue("image", file)
        }
    }

    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Add Profile',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Profile', name: 'create-user' }
                    ]
                }}
            />
            <Card className='md:mx-5 mx-2 mt-5 md:px-10 md:py-5 p-2'>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-4 p-4'>
                        <div className=' '>

                            <div className='flex justify-center item-start'>
                                <div className='md:w-[250px] w-[100px] md:h-[250px] h-[100px] relative mt-5 shadow  rounded-4xl overflow-hidden'>
                                    <img
                                        src={imagePreview}
                                        alt='Preview'
                                        className='w-full h-full object-cover rounded'
                                    />
                                    <Edit
                                        className='absolute top-2 right-2  text-black rounded-full cursor-pointer'
                                        onClick={() => fileRef.current?.click()}
                                    />
                                    <Input
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                        ref={fileRef}
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className=' '>
                            {/* <div className='grid md:grid-cols-1 grid-cols-1 gap-4 mt-5  items-start'> */}
                            <div>
                                <RHFTextField
                                    name='fname'
                                    label='First Name'
                                    placeholder='Enter Name'
                                    className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                                />
                                <RHFTextField
                                    name='lname'
                                    label='Last Name'
                                    placeholder='Select Last Name'
                                    className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                                />
                                <RHFTextField
                                    name='phone'
                                    label='Phone No'
                                    placeholder='Enter Phone No'
                                    className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
                                />
                                <RHFTextField
                                    name='address'
                                    label='Address'
                                    placeholder='Enter Address'
                                    className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
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
                                    className='w-full  my-1 rounded-4xl  py-4 px-3  bg-transparent mb-3'
                                />
                                <RHFTextField
                                    name='email'
                                    label='Email'
                                    placeholder='Enter Email'
                                    className='w-full  my-1 rounded-4xl flex-1 py-4 px-3 bg-transparent'
                                />
                                <RHFTextField
                                    type='password'
                                    name='password'
                                    label='Password'
                                    placeholder='Enter Password'
                                    showPassword={open.value}
                                    onTogglePassword={open.onToggle}
                                    className='w-full  my-1 rounded-4xl flex-1 py-4 px-3 bg-transparent'
                                />
                            </div>
                        </div>



                    </div>

                    <div className='flex justify-end mx-3 gap-4'>
                        <Button type='submit' className='bg-[#FF7722] cursor-pointer'>Save Change</Button>
                    </div>
                </FormProvider>
            </Card>
        </div>
    )
}

export default Page
