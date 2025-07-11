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

const Page = () => {
    const router = useRouter()
    const fileRef = useRef<HTMLInputElement | null>(null)


    const schema = Yup.object().shape({
        name: Yup.string().required('Venue name is required'),
        venueType: Yup.string().required('Venue type is required'),
        organization: Yup.string().required('Organization is required'),
        location: Yup.string().required('Location is required'),
        country: Yup.string().required('Country is required'),
        category: Yup.string().required('Category is required'),
        image: Yup.mixed().nullable()
    })

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            venueType: '',
            organization: '',
            location: '',
            country: 'pakistan',
            category: '',
            image: null
        }
    })

    const {
        handleSubmit
    } = methods

    const onSubmit = (data: any) => {
        console.log("Form Data:", data)
    }


    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Add Venue',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Venue', name: '/super-admin/venue/venue-list' }
                    ]
                }}
            />
            <Card className='md:mx-5 mx-2 mt-5 md:px-10 md:py-5 p-2'>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-12 gap-4 p-4'>
                        <div className=' md:col-span-6 col-span-12'>

                            <div className='grid md:grid-cols-1 grid-cols-1 gap-4 mt-5  items-start'>
                                <div>
                                    <RHFTextField
                                        name='name'
                                        label='Venue Name'
                                        placeholder='Enter Name Venue'
                                        className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                                    />

                                    <RHFSelectField
                                        name='venueType'
                                        label='Venue Type'
                                        placeholder='Select Venue Type'
                                        options={[
                                            { label: 'Product', value: 'product' },
                                            { label: 'Service', value: 'service' },
                                            { label: 'Digital', value: 'digital' }
                                        ]}
                                        className='w-full my-1 rounded-4xl py-4 px-3 flex-1 bg-transparent mb-3'
                                    />
                                    <RHFSelectField
                                        name='organization'
                                        label='Add Organization'
                                        placeholder='Select Organization'
                                        options={[
                                            { label: 'Product', value: 'product' },
                                            { label: 'Service', value: 'service' },
                                            { label: 'Digital', value: 'digital' }
                                        ]}
                                        className='w-full my-1 rounded-4xl py-4 px-3 flex-1 bg-transparent mb-3'
                                    />
                                    <RHFTextField
                                        name='location'
                                        label='Location'
                                        placeholder='Enter Name Location'
                                        className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
                                    />
                                    <div className='w-full flex md:flex-row flex-col md:gap-4'>
                                        <div className='flex-1'>
                                            <RHFTextField
                                                name='country'
                                                label='Country'
                                                placeholder=''
                                                readOnly
                                                className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
                                            />
                                        </div>

                                        <div className='flex-1'>
                                            <RHFSelectField
                                                name='city'
                                                label='City/Region'
                                                placeholder='Select Region'
                                                options={[
                                                    { label: 'Karachi', value: 'karachi' },
                                                    { label: 'Lahore', value: 'lahore' },
                                                    { label: 'Islamabad', value: 'islamabad' }
                                                ]}
                                                className='w-full  my-1  py-4 px-3  bg-transparent'
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='md:col-span-8 col-span-12 '>
                            <img src="/images/mapImage.png" alt="" className='w-full h-full
                                    ' />
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
