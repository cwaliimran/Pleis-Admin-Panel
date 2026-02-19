'use client';

import FormProvider from '@/components/rhf';
import { Card, CardContent } from '@/components/ui/card';
import VenueTypeModalV2 from '@/sections/venue/venueTypeModal';
import ProgressHeader from './progress-header';
import StepOne from './step-one';
import StepThree from './step-three';
import StepTwo from './step-two';
import type { CreateEventViewProps } from './types';
import { useEventForm } from './use-event-form';

const CreateEventView = ({ title = 'Create', userType }: CreateEventViewProps) => {
  const {
    step,
    setStep,
    isEditMode,
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
    toggleRecurringDay,
    isStepValid,
    onSubmit,
    handleSkipTicketing,
    handleUpdateSingle,
    handleUpdateAll,
    router,
    recurring,
    recurringDays,
    recurringEnd,
    parentEventId,
    updateSingleLoading,
    updateAllLoading,
  } = useEventForm({ userType });

  const maxSteps = isEditMode ? 2 : 3;

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col items-center bg-[#f8f6f7] py-4 dark:bg-black">
        <div className="mb-2 flex w-full justify-end"></div>

        <div className="w-full md:mx-auto md:max-w-5xl">
          <Card className="dark:bg-secondary shadow-sm">
            <CardContent className="dark:bg-secondary p-2 md:p-8">
              {/* Hide progress header in edit mode OR show only 2 steps */}
              <ProgressHeader step={step} title={title} totalSteps={maxSteps} isEditMode={isEditMode} />

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
                    toggleRecurringDay={toggleRecurringDay}
                    setStep={setStep}
                    isStepValid={isStepValid}
                    isEditMode={isEditMode}
                    loading={loading}
                    isUpdatingEvent={isUpdatingEvent}
                    parentEventId={parentEventId}
                    handleUpdateSingle={handleUpdateSingle}
                    handleUpdateAll={handleUpdateAll}
                    updateSingleLoading={updateSingleLoading}
                    updateAllLoading={updateAllLoading}
                  />
                )}

                {/* Only show Step 3 in CREATE mode */}
                {step === 3 && !isEditMode && (
                  <StepThree
                    methods={methods}
                    watch={watch}
                    setValue={setValue}
                    loading={loading}
                    isAddingEvent={isAddingEvent}
                    isUpdatingEvent={isUpdatingEvent}
                    router={router}
                    setStep={setStep}
                    onSubmit={onSubmit}
                    handleSkipTicketing={handleSkipTicketing}
                  />
                )}
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>

      {venueModal && (
        <VenueTypeModalV2 open={venueModal} onClose={() => setVenueModal(false)} isEditMode={false} selectedVenueData={null} selectedId={null} />
      )}
    </div>
  );
};

export default CreateEventView;
