import OrgGallery from '@/components/common/organization-img';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { useBoolean } from '@/hooks/useBoolean';
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import { useGetVenuesByCompanyQuery } from '@/store/Reducer/venue';
import { yupResolver } from '@hookform/resolvers/yup';
import { MapPin, Pencil, Shirt, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import AddOtherDetailsModal from '../organization-section/add-other-details-modal';
import VenueTypeModalV2 from '../venue/venueTypeModal';

const OrgInfo = ({ organizationData }: any) => {
  const { data: venueData } = useGetVenuesByCompanyQuery(
    {
      page: 0,
      status: undefined,
      limit: 100,
      companyOrganizer: organizationData?.creator?._id || '',
    },
    {
      skip: !organizationData?.creator?._id,
    }
  );

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
              <p className="mt-2">{organizationData?.otherInfo?.description || ''}</p>
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
              <div className="flex items-center gap-2">
                <p className="mt-1 text-lg capitalize">{organizationData?.venue?.title || '-'}</p>
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
        <VenueTypeModalV2
          open={openVenueModal.value}
          onClose={CloseVenueModal}
          isEditMode={false}
          selectedVenueData={null}
          selectedId={null}
          orgId={organizationData?._id || null}
        />
      )}

      <AddOtherDetailsModal open={openModal.value} onClose={CloseModal} newOrganization={organizationData} venueList={venueData?.data || []} />
    </>
  );
};

export default OrgInfo;
