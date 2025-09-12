import { AppLoading } from '@/components/atoms/app-loading';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import ButtonLoading from '@/components/common/button-loading';
import SocialLinks from '@/components/common/social-links';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useBoolean } from '@/hooks/useBoolean';
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import {
  useDeleteOrganizationMutation,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
} from '@/store/Reducer/organization';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Camera, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivePromontion,
  BusinessInfo,
  TotalFollowers,
  UserCalender,
} from '.';
import OrganizationModal from '../organization-section/create-edit-organization-modal';
import { tabsData, userData } from './data';
import UserInfo from './orgInfo';
import Useranalytics from './organalytics';
import UserCard from './userCard';
import UserEvents from './userEvents';
import UserLoyalty from './userLoyalty';
import UserNotifications from './userNotifications';

interface IdType {
  id?: any;
  userType?: string;
}

const OrganizationDetailPage = ({ id: organizationId, userType }: IdType) => {
  const router = useRouter();
  const openModal = useBoolean();
  const deleteModal = useBoolean();

  const [coverImageUploading, setCoverImageUploading] = useState(false);

  const { data, isLoading, refetch } = useGetOrganizationByIdQuery({
    id: organizationId?.id,
  });

  const [updateOrganization] = useUpdateOrganizationMutation();

  const [deleteOrganization, { isLoading: deleteOrganizationLoading }] =
    useDeleteOrganizationMutation();

  const organizationData = data?.data;
  // console.log('organizationData', organizationData);

  const [active, setActive] = useState('info');
  // const [activeTab, setActiveTab] = useState('basicInfo');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [newOrganization, setNewOrganization] = useState<any>();

  // console.log('newOrganization', newOrganization);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };

  // const handleNextTab = async () => {
  //   if (activeTab === 'basicInfo') {
  //     const isValid = await methods.trigger(['name', 'location']);
  //     if (!isValid) {
  //       return;
  //     }
  //     setActiveTab('socialLinks');
  //   } else if (activeTab === 'socialLinks') {
  //     setActiveTab('businessDetails');
  //   } else if (activeTab === 'businessDetails') {
  //     setActiveTab('bankDetails');
  //   }
  // };

  // Handle cover image upload
  const handleCoverImageUpload = async (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      showError('Only JPEG, PNG, WEBP, or GIF images are allowed.');
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
        id: organizationData?._id,
        ...payload,
      }).unwrap();

      if (response?.message) {
        showSuccess(response?.message || 'Cover image updated successfully');
      }

      if (response?.error) {
        throw new Error(getErrorMessage(response.error));
      }

      refetch();
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

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // DELETE ORGANIZATION
  const onDelete = async () => {
    try {
      const response = await deleteOrganization(selectedId).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (response?.message) {
        showSuccess(response?.message || 'Organization deleted successfully');
      }

      setSelectedId(null);
      deleteModal.onFalse();

      // router.push('/super-admin/organization/organization-list');
      router.push(`/${userType}/organization/organization-list`);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete organization:', errorMessage);
      showError(errorMessage);
    }
  };

  const handleSuccess = (org: any) => {
    setNewOrganization(org);
    CloseModal();
    refetch();
  };

  return (
    <>
      {isLoading ? (
        <AppLoading />
      ) : (
        <div className="mt-10 h-full pb-12">
          <div className="grid grid-cols-12 gap-7">
            <div className="col-span-12 lg:col-span-12 xl:col-span-9">
              <Card className="dark:bg-secondary overflow-hidden p-4 shadow-md md:pb-0">
                <div className="relative w-full">
                  <div className="relative h-72 rounded-lg bg-cover bg-center">
                    {organizationData?.basicInfo?.mediaInfo?.cover?.url &&
                    organizationData?.basicInfo?.mediaInfo?.cover?.url !==
                      noImageUrl &&
                    organizationData?.basicInfo?.mediaInfo?.cover?.url !==
                      noImageUrlDev ? (
                      <Image
                        src={
                          newOrganization?.basicInfo?.mediaInfo?.cover?.url ||
                          organizationData?.basicInfo?.mediaInfo?.cover?.url
                        }
                        alt="Cover Image"
                        fill
                        className="rounded-lg object-cover"
                        priority
                      />
                    ) : (
                      <Image
                        src="/images/blank-img.png"
                        alt="Cover Image"
                        fill
                        className="rounded-lg object-cover"
                        priority
                      />
                    )}

                    {coverImageUploading && (
                      <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                        <ButtonLoading title="Uploading..." />
                      </div>
                    )}
                  </div>

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
                        if (file && organizationData?._id) {
                          handleCoverImageUpload(file);
                        } else if (!organizationData?._id) {
                          showError(
                            'Organization must be created before uploading a cover image.'
                          );
                        }
                      }}
                    />
                  </label>

                  <div className="absolute bottom-[-30] left-5">
                    {organizationData?.basicInfo?.mediaInfo?.logo?.url &&
                    organizationData?.basicInfo?.mediaInfo?.logo?.url !==
                      noImageUrl &&
                    organizationData?.basicInfo?.mediaInfo?.logo?.url !==
                      noImageUrlDev ? (
                      <Image
                        src={organizationData?.basicInfo?.mediaInfo?.logo?.url}
                        alt="User Avatar"
                        priority
                        className="z-10 h-20 w-20 rounded-full bg-white shadow-lg md:h-30 md:w-30"
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
                  <Pencil
                    className="cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
                    onClick={openModal.onTrue}
                  />
                  <Trash2
                    className="ml-4 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
                    onClick={() => handleDelete(organizationData?._id)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="mt-0 ml-2 pt-0 text-2xl font-bold capitalize md:text-3xl">
                    {organizationData?.basicInfo?.name || '-'}
                  </h1>
                  <Badge
                    className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}
                  >
                    -
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}
                  >
                    0 Subscriptions
                  </Badge>
                  <Badge
                    className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}
                  >
                    Hide
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}
                  >
                    0% Commission
                  </Badge>
                  <Badge
                    className={`rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-black`}
                  >
                    0 Boost
                  </Badge>
                </div>

                <div className="mt-4 flex flex-col-reverse gap-4 md:items-end md:justify-between lg:flex-row">
                  <Tabs
                    value={active}
                    onValueChange={setActive}
                    className="w-full"
                  >
                    <div className="scrollbar-hide overflow-x-auto whitespace-nowrap">
                      <TabsList className="inline-flex items-end rounded-full bg-transparent">
                        {tabsData.map((tab: any) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className={`relative cursor-pointer rounded-full border-none px-4 py-2 text-sm font-semibold !shadow-none transition-all dark:!bg-transparent ${
                              active === tab.value
                                ? 'after:absolute after:bottom-0 after:left-1/2 after:h-[4px] after:w-3/4 after:-translate-x-1/2 after:rounded-full after:bg-[#71717A] after:content-[""]'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                  </Tabs>

                  <SocialLinks organizationData={organizationData} />
                </div>
              </Card>

              <div className="mt-4 rounded-lg">
                {active === 'info' && (
                  <UserInfo organizationData={organizationData} />
                )}

                {active === 'events' && (
                  <UserEvents organizationData={organizationData} />
                )}

                {active === 'loyalty' && <UserLoyalty />}

                {active === 'analytics' && <Useranalytics />}

                {active === 'notifications' && <UserNotifications />}

                {active === 'calendar' && <UserCalender />}
              </div>
            </div>

            {/* Sidebar or Additional Panel */}
            <div className="col-span-12 space-y-3 md:space-y-2 xl:col-span-3">
              {userData.map((user: any) => (
                <UserCard item={user} key={user._id} />
              ))}
              <TotalFollowers />

              <ActivePromontion />

              <BusinessInfo />
            </div>
          </div>

          <OrganizationModal
            open={openModal.value}
            onClose={CloseModal}
            organization={organizationData}
            onSuccess={handleSuccess}
            userType={userType}
          />

          <ConfirmDialog
            open={deleteModal.value}
            title="Delete Organization"
            content="Are you sure you want to delete this organization?"
            onClose={() => {
              deleteModal.onFalse();
              setSelectedId(null);
            }}
            onConfirm={onDelete}
            isLoading={deleteOrganizationLoading}
          />
        </div>
      )}
    </>
  );
};

export default OrganizationDetailPage;
