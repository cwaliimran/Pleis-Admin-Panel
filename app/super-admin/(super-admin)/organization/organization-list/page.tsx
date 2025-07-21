"use client"
import Header from '@/app/common/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { useBoolean } from '@/hooks/useBoolean'
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog'
import OrganizationTable from '@/sections/organization/organizationTable'
import { useRouter } from 'next/navigation'

export const defaultValues = {
    image: null,
    name: '',
    email: '',
    phone: '',
    region: '',
    type: '',
    category: '',
    location: '',
    city: '',
    country: '',
    description: '',
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: '',
    commission: '',
    businessId: '',
    companyName: '',
    accountName: '',
    accountNumber: '',
    oib: '',
    address: '',
    postalCode: '',
    bankCity: '',
    bankCountry: ''
}
export const tabOptions = [
    { label: "Basic Info", value: "basicInfo" },
    { label: "Social Links", value: "socialLinks" },
    { label: "Business Details", value: "businessDetails" },
    { label: "Bank Details", value: "bankDetails" },
];

export const schema = Yup.object().shape({
    //  Basic Info
    image: Yup.mixed().nullable(),
    name: Yup.string().required("Organization name is required"),
    email: Yup.string().email("Invalid email"),
    phone: Yup.string(),
    region: Yup.string(),
    type: Yup.string(),
    category: Yup.string(),
    location: Yup.string().required("Location is required"),
    city: Yup.string(),
    country: Yup.string(),
    description: Yup.string(),

    // Social Links
    instagram: Yup.string()
        .url("Invalid Instagram URL")
        .nullable()
        .notRequired(),
    facebook: Yup.string()
        .url("Invalid Facebook URL")
        .nullable()
        .notRequired(),
    youtube: Yup.string()
        .url("Invalid YouTube URL")
        .nullable()
        .notRequired(),
    linkedin: Yup.string()
        .url("Invalid LinkedIn URL")
        .nullable()
        .notRequired(),

    //  Business Details
    commission: Yup.string(),
    businessId: Yup.string(),

    //  Bank Details
    companyName: Yup.string(),
    accountName: Yup.string(),
    accountNumber: Yup.string(),
    oib: Yup.string(),
    address: Yup.string(),
    postalCode: Yup.string(),
    bankCity: Yup.string(),
    bankCountry: Yup.string(),
});

const Page = () => {


    const router = useRouter();
    const openModal = useBoolean();
    const editModal = useBoolean();
    const deleteModal = useBoolean();
    const [activeTab, setActiveTab] = useState('basicInfo');

    // only organization name is required and location is required


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
    const handleNextTab = async () => {
        if (activeTab === "basicInfo") {
            const isValid = await methods.trigger(["name", "location"]);
            if (!isValid) {
                return;
            }
            setActiveTab("socialLinks");
        } else if (activeTab === "socialLinks") {
            setActiveTab("businessDetails");
        } else if (activeTab === "businessDetails") {
            setActiveTab("bankDetails");
        }
    };

    const handleEdit = (id: string) => {
        // openModal.onTrue();
        // editModal.onTrue();
        router.push("/super-admin/organization/create-organization")

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
                    { name: "Organizations", href: "" },
                ]}
            />
            <div>
                <div className=' w-full flex items-center justify-end'>
                    <Button className='rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary' onClick={() => router.push("/super-admin/organization/create-organization")}>
                        <Plus className='' />
                        Create Organization
                    </Button>
                </div>
            </div>
            {/* dialog for add and update the organization */}
            <Dialog open={openModal.value} onOpenChange={CloseModal}>
                <DialogOverlay
                    className="fixed inset-0 bg-white bg-opacity-30   ">
                    <DialogContent className='md:!max-w-[600px]  min-h-[86vh] max-h-[90vh] w-full overflow-y-auto flex flex-col md:items-start' >
                        <DialogHeader>
                            <DialogTitle> {!editModal.value ? "Create Organization" : "Edit Organization"} </DialogTitle>
                        </DialogHeader>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <div className="w-full my-2 md:hidden block">
                                    <Select value={activeTab} onValueChange={setActiveTab}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Tab" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tabOptions.map((tab, index: number) => (
                                                <SelectItem key={index} value={tab.value}>
                                                    {tab.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-1 md:block hidden">
                                    <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1 min-w-max">
                                        {tabOptions.map((tab, index) => (
                                            <TabsTrigger
                                                key={index}
                                                value={tab.value}
                                                className={cn(
                                                    "text-sm md:text-md font-semibold rounded-full px-4 py-2 transition-colors cursor-pointer"
                                                )}
                                            >
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </Tabs>

                            {activeTab === "basicInfo" && <div className="flex flex-col gap-4 mt-4">
                                <RHFUploadAvatar
                                    name='image'
                                    label='Organization Image'
                                />
                                <RHFTextField
                                    name='name'
                                    label=' Organization Name'
                                    placeholder='Enter Organization Name'
                                    className={` ${methods.formState.errors.name ? 'border-red-400' : ''}`}

                                />
                                <div className="w-full  grid md:grid-cols-2 grid-cols-1 gap-4">
                                    <RHFTextField
                                        type="email"
                                        name="email"
                                        label="Email (Associated with bank)"
                                        placeholder="Enter Email"
                                    />
                                    <RHFTextField
                                        name="phone"
                                        label="Phone (Associated with bank)"
                                        placeholder="Enter Phone No"
                                    />
                                    <RHFSelectField
                                        name='region'
                                        label='Region'
                                        placeholder='Select Region'
                                        options={[
                                            { label: 'North America', value: 'north-america' },
                                            { label: 'Europe', value: 'europe' },
                                            { label: 'Asia', value: 'asia' }
                                        ]}
                                    />

                                    <RHFSelectField
                                        name='type'
                                        label='Types'
                                        placeholder=" Select Type"
                                        options={[
                                            { label: 'Non-Profit', value: 'non-profit' },
                                            { label: 'For-Profit', value: 'for-profit' },
                                            { label: 'Government', value: 'government' }
                                        ]}
                                    />
                                    <RHFSelectField
                                        name='category'
                                        label='category'
                                        placeholder=" Select Category"
                                        options={[
                                            { label: 'Education', value: 'education' },
                                            { label: 'Health', value: 'health' },
                                            { label: 'Technology', value: 'technology' }
                                        ]}
                                    />
                                    <RHFTextField
                                        name='location'
                                        label='Location'
                                        placeholder='Enter Location'
                                        className={` ${methods.formState.errors.location ? 'border-red-400' : ''}`}

                                    />
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
                                </div>
                                <RHFTextField
                                    name='description'
                                    label='Description'
                                    placeholder='Enter Event Description'
                                    rows={6}
                                    multiline={true}
                                />

                            </div>}
                            {activeTab === "socialLinks" && <div className="flex flex-col gap-4 mt-4 ">
                                <RHFTextField
                                    name='instagram'
                                    label='Instagram Link'
                                    placeholder='Enter Instagram Link'
                                />
                                <RHFTextField
                                    name='facebook'
                                    label='Facebook Link'
                                    placeholder='Enter Facebook Link'
                                />
                                <RHFTextField
                                    name='youtube'
                                    label='You Tube Link'
                                    placeholder='Enter You Tube Link'
                                />
                                <RHFTextField
                                    name='linkedin'
                                    label='LinkedIn Link'
                                    placeholder='Enter LinkedIn Link'
                                />
                            </div>}
                            {activeTab === "businessDetails" && <div className="flex flex-col gap-4 mt-4">
                                <RHFSelectField
                                    name='commission'
                                    label='Commission'
                                    placeholder='Select Commission'
                                    options={[
                                        { label: '10%', value: '10' },
                                        { label: '15%', value: '15' },
                                        { label: '20%', value: '20' }
                                    ]}
                                />
                                <RHFTextField
                                    name='businessId'
                                    label='Business ID'
                                    placeholder='Enter Business ID'
                                />
                            </div>
                            }
                            {activeTab === "bankDetails" && <div className="flex flex-col gap-4 mt-4">
                                {/* company name */}
                                <RHFTextField
                                    name='companyName'
                                    label='Company Name'
                                    placeholder='Enter Company Name'
                                />
                                {/* account name */}
                                <RHFTextField
                                    name='accountName'
                                    label='Account Name'
                                    placeholder='Enter Account Name'
                                />
                                {/* account number */}
                                <RHFTextField
                                    name='accountNumber'
                                    label='Account Number'
                                    placeholder='Enter Account Number'
                                />
                                {/* OIB */}
                                <RHFTextField
                                    name='oib'
                                    label='OIB'
                                    placeholder='Enter OIB'
                                />
                                {/* address */}
                                <RHFTextField
                                    name='address'
                                    label='Address'
                                    placeholder='Enter Address'
                                />
                                {/* postal code */}
                                <RHFTextField
                                    name='postalCode'
                                    label='Postal Code'
                                    placeholder='Enter Postal Code'
                                />
                                {/* city */}
                                <RHFTextField
                                    name='city'
                                    label='City'
                                    placeholder='Enter City'
                                />
                                {/* country */}
                                <RHFTextField
                                    name='country'
                                    label='Country'
                                    placeholder='Enter Country'
                                />
                            </div>
                            }
                            <div className='flex justify-end mt-4 items-center gap-2'>
                                {activeTab !== "basicInfo" && (

                                    <div className="">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className='cursor-pointer'
                                            onClick={() => {
                                                if (activeTab === "socialLinks") setActiveTab("basicInfo")
                                                else if (activeTab === "businessDetails") setActiveTab("socialLinks")
                                                else if (activeTab === "bankDetails") setActiveTab("businessDetails")
                                            }}
                                        >
                                            Back to
                                        </Button>
                                    </div>
                                )}
                                {activeTab !== "bankDetails" && (
                                    <div className="">
                                        <Button
                                            type="button"
                                            className='bg-primary text-white hover:bg-primary cursor-pointer'
                                            onClick={handleNextTab}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}

                                {activeTab === "bankDetails" && <Button type='submit' className='bg-primary text-white hover:bg-primary cursor-pointer'>
                                    {!editModal.value ? "Add Organization" : "Update Organization"}
                                </Button>}
                            </div>
                        </FormProvider>

                    </DialogContent>
                </DialogOverlay>
            </Dialog>
            {/* dialog for delete the organization */}
            <ConfirmDialog
                open={deleteModal.value}
                title="Delete Organization"
                content="Are you sure you want to delete this?"
                onClose={deleteModal.onFalse}
                onConfirm={onDelete}
            />
            <OrganizationTable
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />
        </div >
    )
}

export default Page