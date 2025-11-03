'use client';

import FormProvider from '@/components/rhf';
import { Card, CardContent } from '@/components/ui/card';
import VenueTypeModal from '@/components/common/create-venue-modal';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import ProgressHeader from './progress-header';
import { useEventForm } from './use-event-form';
import type { CreateEventViewProps } from './types';

const CreateEventView = ({ title = 'Create', userType }: CreateEventViewProps) => {
  const {
    step,
    setStep,
    // version,
    // setVersion,
    showPartnerOrganizer,
    setShowPartnerOrganizer,
    file,
    setFile,
    venueModal,
    setVenueModal,
    loading,
    methods,
    watch,
    setValue,
    organizations,
    orgLoading,
    venues,
    venuesLoading,
    categoriesData,
    categoriesLoading,
    tagsd,
    tagsLoading,
    isAddingEvent,
    isUpdatingEvent,
    removePartnerOrganizer,
    toggleRecurringDay,
    isStepValid,
    onSubmit,
    router,
    recurring,
    recurringDays,
    recurringEnd,
    eventType,
  } = useEventForm(userType);

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col items-center bg-[#f8f6f7] py-4 dark:bg-black">
        <div className="mb-2 flex w-full justify-end"></div>

        <div className="w-full md:mx-auto md:max-w-5xl">
          <Card className="dark:bg-secondary shadow-sm">
            <CardContent className="dark:bg-secondary p-2 md:p-8">
              <ProgressHeader step={step} title={title} />

              <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                {step === 1 && (
                  <StepOne
                    methods={methods}
                    watch={watch}
                    setValue={setValue}
                    organizations={organizations}
                    orgLoading={orgLoading}
                    venues={venues}
                    venuesLoading={venuesLoading}
                    categoriesData={categoriesData}
                    categoriesLoading={categoriesLoading}
                    tagsd={tagsd}
                    tagsLoading={tagsLoading}
                    file={file}
                    setFile={setFile}
                    showPartnerOrganizer={showPartnerOrganizer}
                    setShowPartnerOrganizer={setShowPartnerOrganizer}
                    removePartnerOrganizer={removePartnerOrganizer}
                    setVenueModal={setVenueModal}
                    router={router}
                    setStep={setStep}
                    isStepValid={isStepValid}
                  />
                )}

                {step === 2 && (
                  <StepTwo
                    methods={methods}
                    watch={watch}
                    setValue={setValue}
                    recurring={recurring}
                    recurringDays={recurringDays}
                    recurringEnd={recurringEnd}
                    eventType={eventType}
                    toggleRecurringDay={toggleRecurringDay}
                    setStep={setStep}
                    isStepValid={isStepValid}
                  />
                )}

                {step === 3 && (
                  <StepThree
                    methods={methods}
                    watch={watch}
                    setValue={setValue}
                    loading={loading}
                    isAddingEvent={isAddingEvent}
                    isUpdatingEvent={isUpdatingEvent}
                    router={router}
                    setStep={setStep}
                  />
                )}
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>

      <VenueTypeModal open={venueModal} onClose={() => setVenueModal(false)} />
    </div>
  );
};

export default CreateEventView;
