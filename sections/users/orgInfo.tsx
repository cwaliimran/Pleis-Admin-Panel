import OrgGallery from '@/components/common/organization-img';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useBoolean } from '@/hooks/useBoolean';
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ellipsis, MapPin, Pencil, Shirt, UserPlus, UsersRound } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import AddOtherDetailsModal from '../organization-section/add-other-details-modal';
import VenueTypeModalV2 from '../venue/venueTypeModal';

const OrgInfo = ({ organizationData }: any) => {
  const totalDays = 30;
  const remainingDays = 5;
  const progressPercent = ((totalDays - remainingDays) / totalDays) * 100;

  const openModal = useBoolean();
  const openVenueModal = useBoolean();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };

  const CloseVenueModal = () => {
    methods.reset(defaultValues);
    openVenueModal.onFalse();
  };

  return (
    <>
      <div className="flex w-full justify-end">
        <Pencil width={22} className="mr-2 cursor-pointer text-gray-500 transition-colors hover:text-gray-700" onClick={openModal.onTrue} />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5">
          <Card className="dark:bg-secondary shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">DESCRIPTION</h1>
              <p className="mt-2 capitalize">{organizationData?.otherInfo?.description || ''}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="text-md rounded-full border border-gray-400 bg-white px-4 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white">
                  {organizationData?.otherInfo?.minAge || ''}
                </Badge>

                <Badge className="text-md rounded-full border border-gray-400 bg-white px-4 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white">
                  <Shirt className="mr-2 h-5! w-5!" />-
                </Badge>

                <Badge className="text-md rounded-full border border-gray-400 bg-white px-4 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white">
                  <UserPlus className="mr-2 h-5! w-5!" />0
                </Badge>
              </div>
            </CardHeader>
          </Card>
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-slate-500">VENUE</h1>
                <Button variant="default" className="cursor-pointer rounded-full" onClick={openVenueModal.onTrue}>
                  Add Venue
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {/* <PartyPopper /> */}
                <p className="mt-2 text-lg capitalize">{organizationData?.venue?.title || '-'}</p>
              </div>
            </CardHeader>
          </Card>
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">CATEGORIES</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {(organizationData as any)?.otherInfo?.categories?.map((item: any, index: number) => (
                  <Badge
                    key={index}
                    className="text-md rounded-full border border-gray-400 bg-white px-4 py-1 font-medium text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white"
                  >
                    {item?.title}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <h1 className="font-semibold text-slate-500">TAGS</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {(organizationData as any)?.otherInfo?.tags?.map((item: any, index: number) => (
                  <Badge
                    key={index}
                    className="text-md rounded-full border border-gray-400 bg-white px-4 py-1 font-medium text-gray-400 capitalize transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:hover:text-white"
                  >
                    {item?.title}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
          <Card className="dark:bg-secondary mt-4 shadow-lg">
            <CardHeader>
              <div className="item-center flex justify-between">
                <Badge className="text-md rounded-full bg-gray-100 px-4 py-1 font-medium text-black dark:bg-white">{/* Active */}-</Badge>
                <Ellipsis className="h-4 w-4 cursor-pointer" />
              </div>
              <div className="mt-2 flex items-start justify-between gap-4">
                {/* Left Image */}
                <Image src="/images/bannerImage.png" alt="Promotion" className="h-20 w-20 rounded-[10px] object-cover" width={20} height={20} />

                {/* Right Content */}
                <div className="flex flex-1 flex-col">
                  {/* Top Row: Label + Days Left */}
                  <div className="mb-1 flex w-full items-center justify-between">
                    <h1 className="font-semibold text-slate-500">PROMOTION</h1>
                    <h1 className="font-semibold whitespace-nowrap text-green-500"></h1>- Days left
                  </div>

                  {/* Title */}
                  <h1 className="text-xl font-medium">-</h1>
                  <p className="mt-1 text-slate-500">-</p>
                </div>
              </div>
            </CardHeader>
            <hr />
            <CardContent>
              <div className="flex">
                <div className="flex">
                  <UsersRound className="h-5 w-5 text-slate-500" />
                  <p className="ml-2 font-normal text-slate-500">
                    Max Points <span className="font-bold">-</span>
                  </p>
                </div>
                <div className="ml-3 flex md:ml-7">
                  <UsersRound className="h-5 w-5 text-slate-500" />
                  <p className="ml-2 font-normal text-slate-500">
                    Max Points <span className="font-bold">-</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h1 className="font-semibold text-slate-500">REWARD AVAILABILITY</h1>
                <h1 className="text-slate-500">0/0</h1>
              </div>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div className="flex flex-1 flex-col">
                  <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-5 grid grid-cols-12 gap-4">
            <div className="col-span-12 w-full rounded-full border-2 border-gray-300 bg-white text-center shadow-lg hover:bg-gray-100 md:col-span-6 dark:bg-black">
              <Badge className="text-md cursor-pointer bg-transparent px-4 py-1 font-semibold text-black dark:text-slate-200">New Promotion</Badge>
            </div>
            <div className="col-span-12 w-full rounded-full border-2 border-gray-300 bg-white text-center shadow-lg hover:bg-gray-100 md:col-span-6 dark:bg-black">
              <Badge className="text-md cursor-pointer bg-transparent px-4 py-1 font-semibold text-black dark:text-slate-200">New Notification</Badge>
            </div>
          </div>
          <div className="col-span-12 mt-4 w-full rounded-full border-2 border-gray-300 bg-white text-center shadow-lg hover:bg-gray-100 dark:bg-black">
            <Badge className="text-md cursor-pointer bg-transparent px-4 py-1 font-semibold text-black dark:text-gray-200">Join Loyalty</Badge>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7">
          <Card className="dark:bg-secondary shadow-lg">
            <CardHeader className="flex w-full flex-col gap-2">
              <h1 className="font-semibold text-slate-500">LOCATION PIN</h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="capitalize">{organizationData?.venue?.title || '-'}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <MapPin />
                <span>{organizationData?.location?.fullAddress || '-'}</span>
              </div>
              <div className="mt-3 w-full">
                <div className="h-[250px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                  {organizationData?.location?.coordinates?.length === 2 ? (
                    <iframe
                      title="Venue Location Map"
                      src={`https://www.google.com/maps?q=${organizationData?.location?.coordinates[1]},${organizationData?.location?.coordinates[0]}&hl=es;z=14&output=embed`}
                      className="h-full w-full border-0"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">No location selected</div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="dark:bg-secondary mt-5 shadow-lg">
            <CardHeader className="gap-4">
              <h1 className="font-semibold text-slate-500">GALLERY</h1>
              <OrgGallery organizationData={organizationData} />
            </CardHeader>
          </Card>
        </div>
      </div>

      {openVenueModal.value && (
        <VenueTypeModalV2 open={openVenueModal.value} onClose={CloseVenueModal} isEditMode={false} selectedVenueData={null} selectedId={null} />
      )}

      <AddOtherDetailsModal open={openModal.value} onClose={CloseModal} newOrganization={organizationData} />
    </>
  );
};

export default OrgInfo;
