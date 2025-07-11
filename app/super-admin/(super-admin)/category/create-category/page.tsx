"use client"
import Superadminheader from '@/app/common/superadminheader'
import CustomBreadCrums from '@/components/breadcrums/customBreadCrums'
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf'
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
    name: Yup.string().required('Category name is required'),
    type: Yup.string().required('Category type is required'),
    image: Yup.mixed().nullable()
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      type: '',
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
          heading: 'Create Category',
          links: [
            { title: 'Home', name: '/super-admin' },
            { title: 'Create Category', name: 'create-category' }
          ]
        }}
      />
      <Card className='md:mx-5 mx-2 mt-5 md:p-4 p-2'>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-12 gap-4 p-4'>
            <div className='md:col-span-4 col-span-12'>
              <RHFTextField
                name='name'
                label='Category Name'
                placeholder='Enter Name'
                className='w-full my-1 rounded-4xl py-4 px-3'
              />

              <RHFSelectField
                name='type'
                label='Category Type'
                placeholder='Select Type'
                options={[
                  { label: 'Product', value: 'product' },
                  { label: 'Service', value: 'service' },
                  { label: 'Digital', value: 'digital' }
                ]}
                className='w-full my-1 rounded-4xl py-4 px-3'
              />

              {/* Image Upload */}
              <div className='flex items-center justify-end'>
                <div className='md:w-[150px] w-[100px] md:h-[150px] h-[100px] relative mt-5 shadow  rounded overflow-hidden'>
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
