// "use client"

// import Header from '@/app/common/header'
// import { Button } from '@/components/ui/button'
// import { useState } from 'react'
// import FormProvider, {
//     RHFSelectField,
//     RHFTextField
// } from '@/components/rhf'
// import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar'
// import { useForm } from 'react-hook-form'
// import * as Yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { cn } from '@/lib/utils'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue
// } from '@/components/ui/select'
// import { Card, CardHeader } from '@/components/ui/card'

// export const defaultValues = {
//     image: null,
//     name: '',
//     email: '',
//     phone: '',
//     region: '',
//     type: '',
//     category: '',
//     location: '',
//     city: '',
//     country: '',
//     description: '',
//     instagram: '',
//     facebook: '',
//     youtube: '',
//     linkedin: '',
//     commission: '',
//     businessId: '',
//     companyName: '',
//     accountName: '',
//     accountNumber: '',
//     oib: '',
//     address: '',
//     postalCode: '',
//     bankCity: '',
//     bankCountry: ''
// }

// export const tabOptions = [
//     { label: 'Basic Info', value: 'basicInfo' },
//     { label: 'Social Links', value: 'socialLinks' },
//     { label: 'Business Details', value: 'businessDetails' },
//     { label: 'Bank Details', value: 'bankDetails' }
// ]

// export const schema = Yup.object().shape({
//     image: Yup.mixed().nullable(),
//     name: Yup.string().required('Organization name is required'),
//     email: Yup.string().email('Invalid email'),
//     phone: Yup.string(),
//     region: Yup.string(),
//     type: Yup.string(),
//     category: Yup.string(),
//     location: Yup.string().required('Location is required'),
//     city: Yup.string(),
//     country: Yup.string(),
//     description: Yup.string(),
//     instagram: Yup.string().url('Invalid Instagram URL').nullable().notRequired(),
//     facebook: Yup.string().url('Invalid Facebook URL').nullable().notRequired(),
//     youtube: Yup.string().url('Invalid YouTube URL').nullable().notRequired(),
//     linkedin: Yup.string().url('Invalid LinkedIn URL').nullable().notRequired(),
//     commission: Yup.string(),
//     businessId: Yup.string(),
//     companyName: Yup.string(),
//     accountName: Yup.string(),
//     accountNumber: Yup.string(),
//     oib: Yup.string(),
//     address: Yup.string(),
//     postalCode: Yup.string(),
//     bankCity: Yup.string(),
//     bankCountry: Yup.string()
// })

// const Page = () => {

//     const [activeTab, setActiveTab] = useState('basicInfo')
//     const [isEdit, setIsEdit] = useState(false)

//     const methods = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: defaultValues
//     })

//     const onSubmit = (data: any) => {
//         console.log('Form Submitted:', data)
//     }

//     const handleNextTab = async () => {
//         if (activeTab === 'basicInfo') {
//             const isValid = await methods.trigger(['name', 'location'])
//             if (!isValid) return
//             setActiveTab('socialLinks')
//         } else if (activeTab === 'socialLinks') {
//             setActiveTab('businessDetails')
//         } else if (activeTab === 'businessDetails') {
//             setActiveTab('bankDetails')
//         }
//     }

//     return (
//         <div>
//             <Header
//                 links={[
//                     { name: 'Dashboard', href: '/super-admin' },
//                     { name: 'Organizations', href: '' }
//                 ]}
//             />
//            <div className='md:mx-10'>
//              <Card className=''>
//                 <CardHeader>
//                     {/* <section className="max-w-4xl w-full mx-auto px-4 py-6 bg-background "> */}
//                     <h2 className="text-xl font-semibold mb-4">
//                         {!isEdit ? 'Create Organization' : 'Edit Organization'}
//                     </h2>

//                     <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
//                         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                             <div className="w-full my-2 md:hidden block">
//                                 <Select value={activeTab} onValueChange={setActiveTab}>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select Tab" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {tabOptions.map((tab, index) => (
//                                             <SelectItem key={index} value={tab.value}>
//                                                 {tab.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-1 md:block hidden">
//                                 <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1 min-w-max">
//                                     {tabOptions.map((tab, index) => (
//                                         <TabsTrigger
//                                             key={index}
//                                             value={tab.value}
//                                             className={cn(
//                                                 'text-sm md:text-md font-semibold rounded-full px-4 py-2 transition-colors cursor-pointer'
//                                             )}
//                                         >
//                                             {tab.label}
//                                         </TabsTrigger>
//                                     ))}
//                                 </TabsList>
//                             </div>
//                         </Tabs>

//                         <div className="mt-4">
//                             {activeTab === 'basicInfo' && (
//                                 <div className="flex flex-col gap-4">
//                                     <RHFUploadAvatar name="image" label="Organization Image" />
//                                     <RHFTextField name="name" label="Organization Name" placeholder="Enter Organization Name" />
//                                     <div className="grid md:grid-cols-2 gap-4">
//                                         <RHFTextField name="email" label="Email" placeholder="Enter Email" />
//                                         <RHFTextField name="phone" label="Phone" placeholder="Enter Phone" />
//                                         <RHFSelectField name="region" label="Region" placeholder="Select Region" options={[]} />
//                                         <RHFSelectField name="type" label="Type" placeholder="Select Type" options={[]} />
//                                         <RHFSelectField name="category" label="Category" placeholder="Select Category" options={[]} />
//                                         <RHFTextField name="location" label="Location" placeholder="Enter Location" />
//                                         <RHFSelectField name="city" label="City" placeholder="Select City" options={[]} />
//                                         <RHFTextField name="country" label="Country" placeholder="Enter Country" />
//                                     </div>
//                                     <RHFTextField
//                                         name="description"
//                                         label="Description"
//                                         placeholder="Enter Description"
//                                         multiline
//                                         rows={4}
//                                     />
//                                 </div>
//                             )}

//                             {activeTab === 'socialLinks' && (
//                                 <div className="flex flex-col gap-4 mt-4">
//                                     <RHFTextField name="instagram" label="Instagram Link" placeholder="Enter Instagram Link" />
//                                     <RHFTextField name="facebook" label="Facebook Link" placeholder="Enter Facebook Link" />
//                                     <RHFTextField name="youtube" label="YouTube Link" placeholder="Enter YouTube Link" />
//                                     <RHFTextField name="linkedin" label="LinkedIn Link" placeholder="Enter LinkedIn Link" />
//                                 </div>
//                             )}

//                             {activeTab === 'businessDetails' && (
//                                 <div className="flex flex-col gap-4 mt-4">
//                                     <RHFSelectField name="commission" label="Commission" placeholder="Select Commission" options={[]} />
//                                     <RHFTextField name="businessId" label="Business ID" placeholder="Enter Business ID" />
//                                 </div>
//                             )}

//                             {activeTab === 'bankDetails' && (
//                                 <div className="flex flex-col gap-4 mt-4">
//                                     <RHFTextField name="companyName" label="Company Name" placeholder="Enter Company Name" />
//                                     <RHFTextField name="accountName" label="Account Name" placeholder="Enter Account Name" />
//                                     <RHFTextField name="accountNumber" label="Account Number" placeholder="Enter Account Number" />
//                                     <RHFTextField name="oib" label="OIB" placeholder="Enter OIB" />
//                                     <RHFTextField name="address" label="Address" placeholder="Enter Address" />
//                                     <RHFTextField name="postalCode" label="Postal Code" placeholder="Enter Postal Code" />
//                                     <RHFTextField name="bankCity" label="Bank City" placeholder="Enter Bank City" />
//                                     <RHFTextField name="bankCountry" label="Bank Country" placeholder="Enter Bank Country" />
//                                 </div>
//                             )}
//                         </div>

//                         <div className="flex justify-end mt-4 items-center gap-2">
//                             {activeTab !== 'basicInfo' && (
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => {
//                                         if (activeTab === 'socialLinks') setActiveTab('basicInfo')
//                                         else if (activeTab === 'businessDetails') setActiveTab('socialLinks')
//                                         else if (activeTab === 'bankDetails') setActiveTab('businessDetails')
//                                     }}
//                                 >
//                                     Back
//                                 </Button>
//                             )}
//                             {activeTab !== 'bankDetails' && (
//                                 <Button type="button" className="bg-blue-700 text-white" onClick={handleNextTab}>
//                                     Next
//                                 </Button>
//                             )}
//                             {activeTab === 'bankDetails' && (
//                                 <Button type="submit" className="bg-blue-700 text-white">
//                                     {!isEdit ? 'Add Organization' : 'Update Organization'}
//                                 </Button>
//                             )}
//                         </div>
//                     </FormProvider>
//                     {/* </section> */}
//                 </CardHeader>
//             </Card>
//            </div>
//         </div>
//     )
// }

// export default Page

"use client";

import Header from "@/app/common/header";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormProvider, { RHFSelectField, RHFTextField } from "@/components/rhf";
import RHFUploadAvatar from "@/components/rhf/rhf-upload-avatar";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const defaultValues = {
  image: null,
  name: "",
  email: "",
  phone: "",
  region: "",
  type: "",
  category: "",
  location: "",
  city: "",
  country: "",
  description: "",
  instagram: "",
  facebook: "",
  youtube: "",
  linkedin: "",
  commission: "",
  businessId: "",
  companyName: "",
  accountName: "",
  accountNumber: "",
  oib: "",
  address: "",
  postalCode: "",
  bankCity: "",
  bankCountry: "",
};

export const tabOptions = [
  { label: "Basic Info", value: "basicInfo" },
  { label: "Social Links", value: "socialLinks" },
  { label: "Business Details", value: "businessDetails" },
  { label: "Bank Details", value: "bankDetails" },
];

export const schema = Yup.object().shape({
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
  instagram: Yup.string().url("Invalid Instagram URL").nullable().notRequired(),
  facebook: Yup.string().url("Invalid Facebook URL").nullable().notRequired(),
  youtube: Yup.string().url("Invalid YouTube URL").nullable().notRequired(),
  linkedin: Yup.string().url("Invalid LinkedIn URL").nullable().notRequired(),
  commission: Yup.string(),
  businessId: Yup.string(),
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
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [isEdit, setIsEdit] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: any) => {
    console.log("Form Submitted:", data);
  };

  const handleNextTab = async () => {
    if (activeTab === "basicInfo") {
      const isValid = await methods.trigger(["name", "location"]);
      if (!isValid) return;
      setActiveTab("socialLinks");
    } else if (activeTab === "socialLinks") {
      setActiveTab("businessDetails");
    } else if (activeTab === "businessDetails") {
      setActiveTab("bankDetails");
    }
  };

  return (
    <div className="bg-muted/40 min-h-screen pb-12">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Organizations", href: "" },
        ]}
      />
      <div className=" max-w-5xl !mx-auto">
        <Card className="shadow-xl rounded-2xl border border-border  dark:bg-[#171717]">
          <CardContent className=" min-h-[86vh] max-h-[90vh] w-full overflow-y-auto flex flex-col ">
            <CardHeader>
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {!isEdit ? "Create Organization" : "Edit Organization"}
              </h2>

              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="w-full my-2 md:hidden block">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Tab" />
                      </SelectTrigger>
                      <SelectContent>
                        {tabOptions.map((tab, index) => (
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

                <div className="mt-6">
                  {activeTab === "basicInfo" && (
                    <div className="flex flex-col gap-6">
                      <RHFUploadAvatar
                        name="image"
                        label="Organization Image"
                      />
                      <RHFTextField
                        name="name"
                        label="Organization Name"
                        placeholder="Enter Organization Name"
                        className={`h-[40px] ${
                          methods.formState.errors.name ? "border-red-400" : ""
                        }`}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <RHFTextField
                          name="email"
                          label="Email"
                          placeholder="Enter Email"
                        />

                        <RHFTextField
                          name="phone"
                          label="Phone"
                          placeholder="Enter Phone"
                        />

                        <RHFSelectField
                          name="region"
                          label="Region"
                          placeholder="Select Region"
                          options={[
                            { label: "North America", value: "north-america" },
                            { label: "Europe", value: "europe" },
                            { label: "Asia", value: "asia" },
                          ]}
                        />
                        <RHFSelectField
                          name="type"
                          label="Type"
                          placeholder="Select Type"
                          options={[
                            { label: "Non-Profit", value: "non-profit" },
                            { label: "For-Profit", value: "for-profit" },
                            { label: "Government", value: "government" },
                          ]}
                        />
                        <RHFSelectField
                          name="category"
                          label="Category"
                          placeholder="Select Category"
                          options={[
                            { label: "Education", value: "education" },
                            { label: "Health", value: "health" },
                            { label: "Technology", value: "technology" },
                          ]}
                        />
                        <RHFTextField
                          name="location"
                          label="Location"
                          placeholder="Enter Location"
                          className={` ${
                            methods.formState.errors.location
                              ? "border-red-400"
                              : ""
                          }`}
                        />
                        <RHFSelectField
                          name="city"
                          label="City"
                          placeholder="Select City"
                          options={[]}
                        />
                        <RHFTextField
                          name="country"
                          label="Country"
                          placeholder="Enter Country"
                        />
                      </div>
                      <RHFTextField
                        name="description"
                        label="Description"
                        placeholder="Enter Description"
                        multiline
                        rows={4}
                      />
                    </div>
                  )}

                  {activeTab === "socialLinks" && (
                    <div className="flex flex-col gap-4 mt-4">
                      <RHFTextField
                        name="instagram"
                        label="Instagram Link"
                        placeholder="Enter Instagram Link"
                      />
                      <RHFTextField
                        name="facebook"
                        label="Facebook Link"
                        placeholder="Enter Facebook Link"
                      />
                      <RHFTextField
                        name="youtube"
                        label="YouTube Link"
                        placeholder="Enter YouTube Link"
                      />
                      <RHFTextField
                        name="linkedin"
                        label="LinkedIn Link"
                        placeholder="Enter LinkedIn Link"
                      />
                    </div>
                  )}

                  {activeTab === "businessDetails" && (
                    <div className="flex flex-col gap-4 mt-4">
                      <RHFSelectField
                        name="commission"
                        label="Commission"
                        placeholder="Select Commission"
                        options={[]}
                      />
                      <RHFTextField
                        name="businessId"
                        label="Business ID"
                        placeholder="Enter Business ID"
                      />
                    </div>
                  )}

                  {activeTab === "bankDetails" && (
                    <div className="flex flex-col gap-4 mt-4">
                      <RHFTextField
                        name="companyName"
                        label="Company Name"
                        placeholder="Enter Company Name"
                      />
                      <RHFTextField
                        name="accountName"
                        label="Account Name"
                        placeholder="Enter Account Name"
                      />
                      <RHFTextField
                        name="accountNumber"
                        label="Account Number"
                        placeholder="Enter Account Number"
                      />
                      <RHFTextField
                        name="oib"
                        label="OIB"
                        placeholder="Enter OIB"
                      />
                      <RHFTextField
                        name="address"
                        label="Address"
                        placeholder="Enter Address"
                      />
                      <RHFTextField
                        name="postalCode"
                        label="Postal Code"
                        placeholder="Enter Postal Code"
                      />
                      <RHFTextField
                        name="bankCity"
                        label="Bank City"
                        placeholder="Enter Bank City"
                      />
                      <RHFTextField
                        name="bankCountry"
                        label="Bank Country"
                        placeholder="Enter Bank Country"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6 items-center gap-3">
                  {activeTab !== "basicInfo" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (activeTab === "socialLinks")
                          setActiveTab("basicInfo");
                        else if (activeTab === "businessDetails")
                          setActiveTab("socialLinks");
                        else if (activeTab === "bankDetails")
                          setActiveTab("businessDetails");
                      }}
                    >
                      Back
                    </Button>
                  )}
                  {activeTab !== "bankDetails" && (
                    <Button
                      type="button"
                      className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                      onClick={handleNextTab}
                    >
                      Next
                    </Button>
                  )}
                  {activeTab === "bankDetails" && (
                    <Button
                      type="submit"
                      className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                    >
                      {!isEdit ? "Add Organization" : "Update Organization"}
                    </Button>
                  )}
                </div>
              </FormProvider>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
