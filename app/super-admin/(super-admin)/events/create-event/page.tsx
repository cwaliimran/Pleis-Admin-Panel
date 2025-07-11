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

    const [imagePreview, setImagePreview] = useState<string>("/images/blank-image.svg")

    const schema = Yup.object().shape({
        name: Yup.string().required('Event name is required'),
        type: Yup.string().required('Event type is required'),
        image: Yup.mixed().nullable(),
        fromDate: Yup.date().required('From date is required'),
        endDate: Yup.date().required('End date is required').min(Yup.ref('fromDate'), 'End date must be after from date'),
        venue: Yup.string().required('Venue is required'),
        region: Yup.string().required('Region is required'),
        category: Yup.string().required('Category is required'),
        tags: Yup.string().required('Search tags are required'),
        promo: Yup.boolean(),
        description: Yup.string().required('Description is required')


    })

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            type: '',
            image: null,
            fromDate: new Date(),
            endDate: undefined,
            venue: '',
            region: 'Zagreb',
            category: '',
            tags: '',
            promo: false,
            description: ''
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
                    heading: 'Add Event',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Events', name: 'create-event' }
                    ]
                }}
            />
            <Card className='md:mx-5 mx-2 mt-5 md:px-10 md:py-5 p-2'>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-12 gap-4 p-4'>
                        <div className=' col-span-12'>
                            <div className='flex items-center justify-between md:flex-row flex-col '>
                                <div className=''>
                                    <div className='md:w-[450px] w-[100px] md:h-[300px] h-[100px] relative mt-5 shadow  rounded overflow-hidden'>
                                        <img
                                            src={imagePreview}
                                            alt='Preview'
                                            className='w-full h-full object-cover rounded'
                                        />
                                        <Edit
                                            className='absolute top-0 right-0  text-black rounded-full cursor-pointer'
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
                                <div className='flex  items-center justify-center'>
                                    <img src="/images/mapImage.png" alt="" className='md:w-[600px] w-[100%] md:h-[500px] h-[100%] relative mt-5 shadow md:mr-10
                                    ' />
                                </div>
                            </div>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-4 mt-5  items-start'>
                                <div>
                                    <RHFTextField
                                        name='name'
                                        label='Name'
                                        placeholder='Enter Name of Event'
                                        className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                                    />

                                    <div className='flex w-full md:flex-row flex-col  gap-4 md:mb-2'>
                                        <div className='flex-1'>
                                            <RHFSelectField
                                                name='venue'
                                                label='Venue'
                                                placeholder='Select Venue'
                                                options={[
                                                    { label: 'Product', value: 'product' },
                                                    { label: 'Service', value: 'service' },
                                                    { label: 'Digital', value: 'digital' }
                                                ]}
                                                className='w-full my-1 rounded-4xl py-4 px-3 flex-1 bg-transparent'
                                            />
                                        </div>
                                        <Button type="button" className='md:mt-6 cursor-pointer md:mb-0 mb-3' onClick={() => router.push("/super-admin/venue/create-venue")}>Add Venue</Button>
                                    </div>
                                    <RHFTextField
                                        name='region'
                                        label='Region'
                                        placeholder='Region'
                                        value="Zagreb"
                                        readOnly
                                        className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                                    />

                                    <div className='flex w-full md:flex-row flex-col  gap-4 md:mb-2'>
                                        <div className='flex-1'>
                                            <RHFSelectField
                                                name='category'
                                                label='Category'
                                                placeholder='Select Category'
                                                options={[
                                                    { label: 'Product', value: 'product' },
                                                    { label: 'Service', value: 'service' },
                                                    { label: 'Digital', value: 'digital' }
                                                ]}
                                                className='w-full my-1 rounded-4xl py-4 px-3 flex-1 bg-transparent'
                                            />
                                        </div>
                                        <Button type="button" className='md:mt-6 cursor-pointer md:mb-0 mb-3' onClick={() => router.push("/super-admin/category/create-category")}>Add Category</Button>
                                    </div>
                                    <RHFTextField
                                        name='enentCategorires'
                                        label='Event Categories'
                                        value=""
                                        readOnly
                                        className='w-full h-[45px] my-1  py-4 px-3 bg-transparent'
                                    />
                                    <div className='flex w-full md:flex-row flex-col  gap-4 md:mb-2'>
                                        <div className='flex-1'>
                                            <RHFSelectField
                                                name='tags'
                                                label='Search Tags'
                                                placeholder=''
                                                options={[
                                                    { label: 'Product', value: 'product' },
                                                    { label: 'Service', value: 'service' },
                                                    { label: 'Digital', value: 'digital' }
                                                ]}
                                                className='w-full my-1 rounded-4xl py-4 px-3 flex-1 bg-transparent '
                                            />
                                        </div>
                                        <Button type="button" className='md:mt-6 cursor-pointer md:mb-0 mb-3' onClick={()=>router.push('/super-admin/tag')}>Add Tag</Button>
                                    </div>
                                    <RHFTextField
                                        name='enenttags'
                                        label='Event Tags'
                                        value=""
                                        readOnly
                                        className='w-full h-[45px] my-1  py-4 px-3 bg-transparent'
                                    />
                                </div>

                                <div>
                                    <div className='w-full flex  gap-4 md:flex-row flex-col'>
                                        <RHFDate
                                            name="fromDate"
                                            label="From Date"
                                            placeholder="Pick a date"
                                            className="flex-1"
                                        />
                                        <RHFDate
                                            name="endDate"
                                            label="end Date"
                                            placeholder="Pick a date"
                                            className="flex-1"
                                        />
                                    </div>
                                    <RHFCheckbox
                                        name='promo'
                                        label='Mark as Promo'
                                        className="mt-4"

                                    />
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
                                        <RHFSelectField
                                            name='type'
                                            label='Add Organiation'
                                            placeholder='Select Organation'
                                            options={[
                                                { label: 'Product', value: 'product' },
                                                { label: 'Service', value: 'service' },
                                                { label: 'Digital', value: 'digital' }
                                            ]}
                                            className='w-full my-1 rounded-4xl py-4 px-3 flex-1 bg-transparent'
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='col-span-11'>
                            <RHFTextField
                                name='description'
                                label='Description'
                                placeholder='Enter Description'
                                className='w-full my-1  py-4 px-3 bg-transparent'
                                rows={10}
                                multiline={true}
                            />
                        </div>

                    </div>

                    <div className='flex justify-end mx-3 gap-4'>
                        {/* <Button onClick={() => router.push("/super-admin/category-list")} className='cursor-pointer'>Cancel</Button> */}
                        <Button type='submit' className='bg-[#FF7722] cursor-pointer'>Save Change</Button>
                    </div>
                </FormProvider>
            </Card>
        </div>
    )
}

export default Page
