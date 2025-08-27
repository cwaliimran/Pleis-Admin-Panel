import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFTextfieldWithSelect from '@/components/rhf/rhf-text-field-with-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRef } from 'react';

interface CreateVenueModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

const defaultValues = {
  name: '',
  venueType: '',
  organization: '',
  location: '',
  city: '',
  country: '',
};

const VenueTypeModal = ({
  open,
  onClose,
  editMode,
  methods,
  onSubmit,
  isLoading,
  // selectedVenueType,
}: CreateVenueModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    methods.reset(defaultValues);
    onClose();
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center bg-white md:w-lg">
          <DialogContent className="mx-auto max-h-[90vh] min-h-[86vh] overflow-y-auto dark:bg-[#171717]">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {editMode ? 'Edit Venue' : 'Create Venue'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {!editMode
                  ? 'Fill in the details below to create a new venue.'
                  : 'Update the venue information below.'}
              </DialogDescription>
            </DialogHeader>

            <FormProvider methods={methods} onSubmit={onSubmit}>
              <div className="mt-4 flex flex-col gap-4">
                <RHFTextField
                  name="name"
                  label="Venue Name"
                  placeholder="Enter Venue Name"
                  className={`${
                    methods.formState.errors.name ? 'border-red-400' : ''
                  }`}
                />

                <RHFTextfieldWithSelect
                  name="venueType"
                  label="Venue Type"
                  placeholder="Select Venue Type"
                  options={[
                    { value: 'event1', label: 'Event 1' },
                    { value: 'event2', label: 'Event 2' },
                    { value: 'event3', label: 'Event 3' },
                  ]}
                />
                <RHFTextfieldWithSelect
                  name="organization"
                  label="Organization"
                  placeholder="Select Organization"
                  options={[
                    { label: 'Organization A', value: 'org-a' },
                    { label: 'Organization B', value: 'org-b' },
                    { label: 'Organization C', value: 'org-c' },
                  ]}
                />

                <RHFTextField
                  name="location"
                  label="Location"
                  placeholder="Enter Location"
                />

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAvatarChange}
                    className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:text-gray-200"
                  >
                    Upload Floor Plan
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG or PNG. 1MB max.
                  </p>
                </div>

                <div className="w-full">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Map Preview
                  </label>
                  <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                    <iframe
                      title="Venue Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463.9634089519931!2d14.611164251664785!3d45.23098434778954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476363d3cb88c945%3A0x7b1900b8b651a903!2sObala!5e1!3m2!1sen!2s!4v1752833828572!5m2!1sen!2s"
                      className="h-full w-full border-0"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                  >
                    {editMode ? 'Update Venue' : 'Add Venue'}
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </>
  );
};

export default VenueTypeModal;
