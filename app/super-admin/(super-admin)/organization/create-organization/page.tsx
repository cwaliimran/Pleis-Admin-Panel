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
import { Edit, Plus } from 'lucide-react'
import { useBoolean } from '@/hooks/useBoolean'
import { Badge } from '@/components/ui/badge'

const Page = () => {

    const open = useBoolean();

    const fileRef = useRef<HTMLInputElement | null>(null)

    const [imagePreview, setImagePreview] = useState<string>("/images/blank-image.svg")

    const schema = Yup.object().shape({
        name: Yup.string().required('Organization name is required'),
        location: Yup.string().required('Location is required'),
        email: Yup.string().email('Invalid email').optional(),
        phone: Yup.string().optional(),
        region: Yup.string().optional(),
        type: Yup.string().optional(),
        orgType: Yup.string().optional(),
        category: Yup.string().optional(),
        orgCategories: Yup.string().optional(),
        description: Yup.string().optional(),
        instagram: Yup.string().optional(),
        facebook: Yup.string().optional(),
        youtube: Yup.string().optional(),
        linkedin: Yup.string().optional(),
        commission: Yup.number().min(1, 'Commission must be at least 1%').max(100, 'Commission cannot exceed 100%').optional(),
        bussinessSpaceId: Yup.string().optional(),
        companyName: Yup.string().optional(),
        accountName: Yup.string().optional(),
        accountNo: Yup.string().optional(),
        oib: Yup.string().optional(),
        address: Yup.string().optional(),
        postalCode: Yup.string().optional(),
        city: Yup.string().optional(),
        country: Yup.string().optional(),
        representativename: Yup.string().optional(),
        representativesurname: Yup.string().optional(),
        image: Yup.mixed().nullable().optional()


    })

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            region: '',
            type: '',
            orgType: '',
            category: '',
            orgCategories: '',
            description: '',
            location: '',
            instagram: '',
            facebook: '',
            youtube: '',
            linkedin: '',
            commission: 1,
            bussinessSpaceId: '',
            companyName: '',
            accountName: '',
            accountNo: '',
            oib: '',
            address: '',
            postalCode: '',
            city: '',
            country: 'Pakistan',
            representativename: '',
            representativesurname: '',
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
                    heading: 'Add Organization',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Organization', name: 'create-organization' }
                    ]
                }}
            />
            <Card className='md:mx-5 mx-2 mt-5 md:px-10 md:py-5 p-2'>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid md:grid-cols-12 grid-cols-1 md:gap-10 gap-0 p-4'>
                        <div className='col-span-5 '>
                            <div className='flex justify-center item-start'>
                                <div className='md:w-[100%] w-[100px] md:h-[320px] h-[100px] relative mt-5 shadow  rounded-2xl overflow-hidden'>
                                    <img
                                        src={imagePreview}
                                        alt='Preview'
                                        className='w-full h-full object-cover rounded-'
                                    />
                                    <Edit
                                        className='absolute top-2 right-2  text-black  cursor-pointer'
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
                            <div className='grid md:grid-cols-1 grid-cols-1 gap-1 mt-5  items-start'>
                                <RHFTextField
                                    name='name'
                                    label='Name'
                                    placeholder='Enter Name of Organization'
                                    className={`w-full my-1 rounded-4xl py-4 px-3 bg-transparent ${methods.formState.errors.name ? 'border border-red-500' : ''}`}
                                />
                                <RHFTextField
                                    type='email'
                                    name='email'
                                    label='Email(Associated with bank)'
                                    placeholder='Enter Email'
                                    className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                                />
                                <RHFTextField
                                    name='phone'
                                    label='Phone(Associated with bank)'
                                    placeholder='Enter Phone No'
                                    className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
                                />
                                <RHFSelectField
                                    name='region'
                                    label='Region'
                                    placeholder='Select Region'
                                    options={[
                                        { label: 'Karachi', value: 'karachi' },
                                        { label: 'Lahore', value: 'lahore' },
                                        { label: 'Islamabad', value: 'islamabad' }
                                    ]}
                                    className='w-full  my-1 rounded-4xl  py-4 px-3  bg-transparent mb-3'
                                />
                                <RHFTextField
                                    name='type'
                                    label='Type'
                                    placeholder='Search Type'
                                    className='w-full   rounded-4xl py-4 px-3 bg-transparent'
                                />
                                <Badge className=' cursor-pointer mb-2'>
                                    Type <Plus className='inline-block' />
                                </Badge>


                                <RHFTextField
                                    name='orgType'
                                    label='Org Types'
                                    placeholder=''
                                    readOnly
                                    className='w-full  my-1  flex-1 py-4 px-3 bg-transparent'
                                />
                                <RHFTextField
                                    name='category'
                                    label='Category'
                                    placeholder='Search Category'
                                    className='w-full   rounded-4xl py-4 px-3 bg-transparent'
                                />
                                <Badge className=' cursor-pointer mb-2'>
                                    Category <Plus className='inline-block' />
                                </Badge>


                                <RHFTextField
                                    name='orgCategories'
                                    label='Org Categories'
                                    placeholder=''
                                    readOnly
                                    className='w-full  my-1  flex-1 py-4 px-3 bg-transparent'
                                />
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
                        <div className='col-span-6 '>
                            <RHFTextField
                                name='location'
                                label='Location'
                                placeholder='Enter Location'
                                className={`w-full my-1 rounded-4xl py-4 px-3 bg-transparent ${methods.formState.errors.location ? 'border border-red-500' : ''}`}

                            />
                            <img src="/images/mapImage.png" alt="" className='md:w-[600px] w-[100%] md:h-[500px] h-[200px]  mb-3 relative mt-5 shadow md:mr-10
                                    ' />
                            <h1 className='text-xl my-3'>Social links</h1>
                            <RHFTextField
                                name='instagram'
                                label='Instagram'
                                placeholder='https://instagram.com/...'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='facebook'
                                label='Facebook'
                                placeholder='https://facebook.com/...'
                                className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='youtube'
                                label='YouTube'
                                placeholder='https://youtube.com/...'
                                className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='linkedin'
                                label='LinkedIn'
                                placeholder='https://linkedin.com/...'
                                className='w-full  my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <h1 className='text-xl my-3'>Bussiness Details</h1>
                            <RHFSelectField
                                name='commission'
                                label='Euforia Commission (%)'
                                defaultValue={'1'}
                                placeholder=''
                                options={[
                                    { label: '1%', value: '1' },
                                    { label: '5%', value: '5' },
                                    { label: '10%', value: '10' },
                                    { label: '15%', value: '15' },
                                    { label: '20%', value: '20' }
                                ]}
                                className='w-full  my-1 rounded-4xl  py-4 px-3  bg-transparent mb-3'
                            />
                            <RHFTextField
                                name='bussinessSpaceId'
                                label='Bussiness Space Id'
                                placeholder='Enter Organization Bussiness Id'
                                className='w-full  my-1 rounded-4xl flex-1 py-4 px-3 bg-transparent'
                            />
                            <h1 className='text-xl my-3'>Bank details</h1>
                            <RHFTextField
                                name='companyName'
                                label='Company Name'
                                placeholder='Enter Company Name'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='accountName'
                                label='Account Name'
                                placeholder='Enter Account Name'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='accountNo'
                                label='Account No'
                                placeholder='Enter Account No'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='oib'
                                label=' OIB'
                                placeholder='Enter OIB'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='address'
                                label='Address'
                                placeholder='Enter Address Associated with bank'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='postalCode'
                                label='Postal Code'
                                placeholder=' Enter Postal Code'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='city'
                                label='City'
                                placeholder=' Enter City'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='country'
                                label='Country'
                                placeholder=' Enter Country'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='representativename'
                                label='Representative name'
                                placeholder=' Enter Representative name'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
                            <RHFTextField
                                name='representativesurname'
                                label='Representative surname'
                                placeholder=' Enter Representative surname'
                                className='w-full my-1 rounded-4xl py-4 px-3 bg-transparent'
                            />
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
