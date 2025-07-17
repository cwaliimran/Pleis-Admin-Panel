
"use client"

import Header from '@/app/common/header'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf'
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import RHFMultiImageUpload from '@/components/rhf/rhf-mutiple-upload'

export const defaultValues = {
    name: '',
    logo: null,
    venueType: '',
    category: '',
    tags: '',
    workingHours: '',
    description: '',
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: '',
    photoGallery: null,
    businessInfo: ''
}

export const tabOptions = [
    { label: 'Basic Info', value: 'basicInfo' },
    { label: 'Social Links', value: 'socialLinks' },
    // { label: 'Business Details', value: 'businessDetails' },
    // { label: 'Bank Details', value: 'bankDetails' }
]

export const schema = Yup.object().shape({
    name: Yup.string().required('Organization name is required'),
    logo: Yup.mixed().nullable(),
    venueType: Yup.string(),
    category: Yup.string(),
    tag: Yup.string(),
    workingHours: Yup.string(),
    description: Yup.string(),
    instagram: Yup.string().url('Invalid Instagram URL').nullable().notRequired(),
    facebook: Yup.string().url('Invalid Facebook URL').nullable().notRequired(),
    youtube: Yup.string().url('Invalid YouTube URL').nullable().notRequired(),
    linkedin: Yup.string().url('Invalid LinkedIn URL').nullable().notRequired(),
    photoGallery: Yup.mixed().nullable(),
    businessInfo: Yup.string(),
    // email: Yup.string().email('Invalid email'),
    // phone: Yup.string(),
    // region: Yup.string(),
    // location: Yup.string().required('Location is required'),
    // city: Yup.string(),
    // country: Yup.string(),

    // commission: Yup.string(),
    // businessId: Yup.string(),
    // companyName: Yup.string(),
    // accountName: Yup.string(),
    // accountNumber: Yup.string(),
    // oib: Yup.string(),
    // address: Yup.string(),
    // postalCode: Yup.string(),
    // bankCity: Yup.string(),
    // bankCountry: Yup.string()
})

const Page = () => {
    const [activeTab, setActiveTab] = useState('basicInfo')
    const [isEdit, setIsEdit] = useState(false)

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues
    })

    const onSubmit = (data: any) => {
    }

    const handleNextTab = async () => {
        if (activeTab === 'basicInfo') {
            const isValid = await methods.trigger(['name'])
            if (!isValid) return
            setActiveTab('socialLinks')
        }
        // else if (activeTab === 'socialLinks') {
        //     setActiveTab('businessDetails')
        // } else if (activeTab === 'businessDetails') {
        //     setActiveTab('bankDetails')
        // }
    }

    return (
        <div className="bg-muted/40 min-h-screen pb-12">
            <Header
                links={[
                    { name: 'Dashboard', href: '/super-admin' },
                    { name: 'Organizations', href: '' }
                ]}
            />
            <div className=' md:max-w-5xl w-full md:!mx-auto'>
                <Card className='shadow-xl rounded-2xl   dark:bg-[#171717]'>
                    <CardContent className=' min-h-[86vh]   p-0
                     ' >
                        <CardHeader>
                            <h2 className="md:text-2xl text-xl font-bold mb-6 text-foreground">
                                {!isEdit ? 'Create Organization' : 'Edit Organization'}
                            </h2>

                            <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                                    <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-1 block ">
                                        <TabsList className="flex md:items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1 min-w-max">
                                            {tabOptions.map((tab, index) => (
                                                <TabsTrigger
                                                    key={index}
                                                    value={tab.value}
                                                    className={cn(
                                                        'text-sm md:text-md font-semibold rounded-full px-4 py-2 transition-colors cursor-pointer'
                                                    )}
                                                >
                                                    {tab.label}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>
                                </Tabs>

                                <div className="mt-6 w-full border-black">
                                    {activeTab === 'basicInfo' && (
                                        <div className="flex flex-col gap-6">
                                            <RHFUploadAvatar name="image" label="Organization Logo" />
                                            <RHFTextField name="name" label="Organization Name" placeholder="Enter Organization Name"
                                                className={`w-full h-[40px] ${methods.formState.errors.name ? 'border-red-400' : ''}`}
                                            />
                                            <div className="grid md:grid-cols-2 gap-4">

                                                <RHFSelectField name="venueType" label="Venue Type" placeholder="Select Venue Type"
                                                    options={[
                                                        { label: 'Indoor', value: 'indoor' },
                                                        { label: 'Outdoor', value: 'outdoor' },
                                                        { label: 'Virtual', value: 'virtual' }
                                                    ]}
                                                />
                                                <RHFSelectField name="category" label="Category" placeholder="Select Category"
                                                    options={[
                                                        { label: 'Education', value: 'education' },
                                                        { label: 'Health', value: 'health' },
                                                        { label: 'Technology', value: 'technology' }
                                                    ]} />
                                                <RHFSelectField name="tag" label="Tag" placeholder="Select Tag"
                                                    options={[
                                                        { label: 'Popular', value: 'popular' },
                                                        { label: 'New', value: 'new' },
                                                        { label: 'Featured', value: 'featured' }
                                                    ]}
                                                />
                                                <RHFTextField name="workingHours" label="Working Hours" placeholder="Enter Working Hours" />
                                               
                                            </div>
                                            <RHFMultiImageUpload name="photoGallery" label="Photo Gallery" />
                                            <RHFTextField
                                                name="description"
                                                label="Description"
                                                placeholder="Enter Description"
                                                multiline
                                                rows={4}
                                            />
                                        </div>
                                    )}

                                    {activeTab === 'socialLinks' && (
                                        <div className="flex flex-col gap-4 mt-4">
                                            <RHFTextField name="instagram" label="Instagram Link" placeholder="Enter Instagram Link" />
                                            <RHFTextField name="facebook" label="Facebook Link" placeholder="Enter Facebook Link" />
                                            <RHFTextField name="youtube" label="YouTube Link" placeholder="Enter YouTube Link" />
                                            <RHFTextField name="linkedin" label="LinkedIn Link" placeholder="Enter LinkedIn Link" />
                                        </div>
                                    )}

                                  
                                </div>

                                <div className="flex justify-end mt-6 items-center gap-3">
                                    {activeTab !== 'basicInfo' && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (activeTab === 'socialLinks') setActiveTab('basicInfo')
                                            }}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    {activeTab !== 'socialLinks' && (
                                        <Button type="button" className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer" onClick={handleNextTab}>
                                            Next
                                        </Button>
                                    )}
                                    {activeTab === 'socialLinks' && (
                                        <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer">
                                            {!isEdit ? 'Add Organization' : 'Update Organization'}
                                        </Button>
                                    )}
                                </div>
                            </FormProvider>
                        </CardHeader>

                    </CardContent>
                </Card>
            </div>
        </div >
    )
}

export default Page;
