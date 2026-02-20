'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useBoolean } from '@/hooks/useBoolean';
// import { useGetAllCompanyVenueQuery } from '@/store/Reducer/helpers-api';
import { useUpdateOrganizationMutation } from '@/store/Reducer/organization';
import { useGetVenuesByCompanyQuery } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Camera, Pencil } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { UserInfo } from '../users';
import OrganizationModal from './create-edit-organization-modal';

const defaultValues = {
  image: null,
  name: '',
  instagram: '',
  facebook: '',
  youtube: '',
  linkedin: '',
};

const CreateOrganizationPage = ({ userType }: { userType: string }) => {
  const openModal = useBoolean();
  const [updateOrganization] = useUpdateOrganizationMutation();

  const [newOrganization, setNewOrganization] = useState<any>();
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [coverImageUploading, setCoverImageUploading] = useState(false);

  // SUPER ADMIN VENUE API
  const { data: venueData } = useGetVenuesByCompanyQuery(
    {
      page: 0,
      status: undefined,
      limit: 100,
      organization: newOrganization?._id || '',
    },
    {
      skip: userType === 'organizer' || !newOrganization?._id,
    }
  );

  console.log('Venue Data:', venueData?.data);

  // ORGANIZER VENUE API
  // const { data: OrgVenues } = useGetAllCompanyVenueQuery(
  //   {
  //     page: 0,
  //     search: '',
  //     limit: '100',
  //     organization: newOrganization?._id || '',
  //   },
  //   {
  //     skip: userType === 'super-admin' || !newOrganization?._id,
  //   }
  // );

  // console.log('Org Venues:', OrgVenues?.data);

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };

  const schema = Yup.object().shape({
    image: Yup.mixed().nullable(),
    name: Yup.string().required('Organization Name is required').trim().min(2, 'Organization Name must be at least 2 characters'),
    instagram: Yup.string().nullable().optional(),
    facebook: Yup.string().nullable().optional(),
    youtube: Yup.string().nullable().optional(),
    linkedin: Yup.string().nullable().optional(),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  // Handle cover image upload
  const handleCoverImageUpload = async (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      showError('Only JPEG, PNG, or GIF images are allowed.');
      return;
    }

    if (file.size > maxSize) {
      showError('Image size must be less than 5MB.');
      return;
    }

    let uploadedFileKey: string | null = null;
    try {
      setCoverImageUploading(true);
      uploadedFileKey = await uploadFileToAzure(file);

      const payload = {
        basicInfo: {
          media: {
            cover: uploadedFileKey || null,
          },
        },
      };

      const response = await updateOrganization({
        id: newOrganization?._id,
        ...payload,
      }).unwrap();

      if (response?.data) {
        setNewOrganization(response?.data);
        showSuccess('Cover image updated successfully');
      }

      if (response?.error) {
        throw new Error(getErrorMessage(response.error));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to upload cover image:', errorMessage);
      showError(errorMessage);

      if (uploadedFileKey) {
        console.log('Rolling back uploaded cover image:', uploadedFileKey);
        await deleteFileFromAzure(uploadedFileKey);
      }
    } finally {
      setCoverImageUploading(false);
    }
  };

  const showToast = () => {
    showError('Please create an organization first!');
  };

  const handleSuccess = (org: any) => {
    setNewOrganization(org);

    if (org?.creator) {
      setOrgId(org?._id);
      setCreatorId(org?.creator);
    }
    CloseModal();
  };

  return (
    <div className="mt-5 h-full bg-[#f8f6f7] md:mt-10 dark:bg-black">
      <div className="grid grid-cols-12">
        {/* --------------- UPPER SECTION --------------- */}
        <div className="col-span-12 lg:col-span-12">
          <Card className="dark:bg-secondary overflow-hidden p-4 shadow-md">
            <div className="relative w-full">
              <div className="relative h-72 rounded-lg bg-cover bg-center">
                {newOrganization?.basicInfo?.media?.cover &&
                newOrganization?.basicInfo?.media?.cover !== noImageUrl &&
                newOrganization?.basicInfo?.media?.cover !== noImageUrlDev ? (
                  <Image src={newOrganization?.basicInfo?.media?.cover} alt="Cover Image" fill className="rounded-lg object-cover" priority />
                ) : (
                  <Image src="/images/blank-img.png" alt="Cover Image" fill className="rounded-lg object-cover" priority />
                )}

                {coverImageUploading && (
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                    <ButtonLoading title="Uploading" />
                  </div>
                )}
              </div>

              {newOrganization === undefined ? (
                <label
                  htmlFor="banner-upload"
                  className="absolute top-4 right-4 flex cursor-not-allowed items-center justify-center rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Edit cover image"
                  onClick={showToast}
                >
                  <Camera className="h-5 w-5 text-gray-500" />
                </label>
              ) : (
                <label
                  htmlFor="banner-upload"
                  className={`absolute top-4 right-4 flex items-center justify-center rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  aria-label="Edit cover image"
                >
                  <Camera className="h-5 w-5 cursor-pointer text-gray-500 hover:text-blue-700" />
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && newOrganization?._id) {
                        handleCoverImageUpload(file);
                      } else if (!newOrganization?._id) {
                        showError('Please create an organization first.');
                      }
                    }}
                  />
                </label>
              )}

              <div className="absolute bottom-[-30] left-5">
                {newOrganization?.basicInfo?.media?.logo &&
                newOrganization?.basicInfo?.media?.logo !== noImageUrl &&
                newOrganization?.basicInfo?.media?.logo !== noImageUrlDev ? (
                  <Image
                    src={newOrganization?.basicInfo?.media?.logo}
                    alt="User Avatar"
                    priority
                    className="z-10 h-20 w-20 rounded-full bg-white object-cover shadow-lg md:h-30 md:w-30"
                    width={100}
                    height={100}
                  />
                ) : (
                  <Image
                    src="/images/blank-profile2.png"
                    alt="User Avatar"
                    priority
                    className="z-10 h-20 w-20 rounded-full bg-white shadow-lg md:h-30 md:w-30"
                    width={100}
                    height={100}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Pencil width={22} className="cursor-pointer text-gray-500 transition-colors hover:text-gray-700" onClick={openModal.onTrue} />
            </div>

            <div className="mt-2 items-center gap-2 pt-0 md:mt-0 md:flex">
              <h1 className="mt-0 pt-0 text-2xl font-bold capitalize md:ml-2 md:text-3xl">
                {newOrganization ? newOrganization?.basicInfo?.name : 'Organization Name'}
              </h1>
              <Badge className={`mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black md:mt-0`}>Basic</Badge>
            </div>

            <Badge className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}>0 Subscriptions</Badge>

            <div className="flex items-center gap-2">
              <Badge className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}>0% Commission</Badge>
              <Badge className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}>0 Boost</Badge>
            </div>
            <div className="mt-4 -mb-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-end"></div>
          </Card>

          <div className="mt-4 rounded-lg">
            <UserInfo
              newOrganization={newOrganization}
              setNewOrganization={setNewOrganization}
              venueList={venueData?.data || []}
              creatorId={creatorId || ''}
              orgId={orgId}
            />
          </div>
        </div>
      </div>

      <OrganizationModal open={openModal.value} onClose={CloseModal} organization={newOrganization} onSuccess={handleSuccess} userType={userType} />
    </div>
  );
};

export default CreateOrganizationPage;
