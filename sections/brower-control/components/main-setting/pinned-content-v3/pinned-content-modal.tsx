'use client';

import React, { useEffect, useMemo } from 'react';
import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import { useAddPinnedContentMutation, 
  // useGetEventBaseVenuTypeQuery,
   useGetOrganizationsBaseVenueTypeQuery,
   useUpdatePinnedContentMutation } from '@/store/Reducer/pinned-content-api';
import { useGetTagsQuery } from '@/store/Reducer/tags';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { useGetVenueTypesQuery } from '@/store/Reducer/venueType';
// import { Skeleton } from '@/components/ui/skeleton';
import RHFMultiSelectField from '@/components/rhf/RHFMultiSelectField';

type Option = { value: string; label: string };

const defaultValues = {
  linkType: '',
  selectedObject: '',
  contentType: '',
  // content: [],
  status: 'active',
};

const schema = Yup.object().shape({
  linkType: Yup.string().required('Link type is required'),
  selectedObject: Yup.string().required('Please select an option'),
  contentType: Yup.string().required('Content type is required'),
  // content: Yup.array().required('Content is required'),
  status: Yup.string().required('Status is required'),
});

interface BannerModalV2Props {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any; // keep any if shape varies; replace with strong type if available
}

const BannerModalV2: React.FC<BannerModalV2Props> = ({ open, onClose, isEdit = false, selectedData }) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  const { watch, reset, formState, setValue } = methods;
  const isDirty = formState?.isDirty;
  const linkType = watch('linkType');

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({
    page: 0,
    limit: 10000,
  });

  const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery({
    page: 0,
    limit: 10000,
  });

  // const { data: venueData, isLoading: venueLoading } = useGetVenuesQuery({
  const { data: venueData, isLoading: venueLoading } = useGetVenueTypesQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const categoryOptions: Option[] = useMemo(
    () =>
      (categoriesData?.data || []).map((v: any) => ({
        value: String(v?._id ?? ''),
        label: v?.title ?? 'No Title',
      })),
    [categoriesData]
  );

  const tagOptions: Option[] = useMemo(
    () =>
      (tagsData?.data || []).map((v: any) => ({
        value: String(v?._id ?? ''),
        label: v?.title ?? 'No Name',
      })),
    [tagsData]
  );

  const venueOptions: Option[] = useMemo(
    () =>
      (venueData?.data || []).map((v: any) => ({
        value: String(v?._id ?? ''),
        label: v?.title ?? 'No Name',
      })),
    [venueData]
  );

  const [addCategory, { isLoading: addCategoryLoading }] = useAddPinnedContentMutation();

  const [updateCategory, { isLoading: updateCategoryLoading }] = useUpdatePinnedContentMutation();

  // const { data: eventsData, isLoading: eventLoading, isFetching: eventFetching } = useGetEventBaseVenuTypeQuery({ id: watch("selectedObject") },
  //   {
  //     skip:
  //       linkType !== "VenueTypes" ||
  //       !watch("selectedObject") ||
  //       watch("contentType") !== "event",
  //     refetchOnMountOrArgChange: true

  //   });

  // const { data: organizationsData, isLoading: organizationLoading, isFetching: organizationFetching } = useGetOrganizationsBaseVenueTypeQuery({ id: watch("selectedObject") },
  //   {
  //     skip:
  //       linkType !== "VenueTypes" ||
  //       !watch("selectedObject") ||
  //       watch("contentType") !== "organization",
  //     refetchOnMountOrArgChange: true

  //   });

  // handle user-driven link type change
  const handleLinkTypeChange = (value: string) => {
    // Set link type and clear selectedObject silently (no validation yet)
    setValue('linkType', value, { shouldValidate: false, shouldDirty: true });

    setValue('selectedObject', '', {
      shouldValidate: false,
      shouldDirty: false,
    });
  };

  // Prepare form data for editing
  const prepareFormData = (data: any) => {
    console.log("data",data);
    const formData: any = {
      linkType: data?.type || '',
      contentType: data?.contentType || '',
      status: data?.status || 'active',
    };

    // object may be nested; support string id or object._id
    const objectId = typeof data?.object === 'string' ? data.object : (data?.object?._id?.toString?.() ?? '');

    formData.selectedObject = objectId;
    return formData;
  };

  // When modal opens for edit -> set form values (including selectedObject)
  useEffect(() => {
    if (open && isEdit && selectedData) {
      const formData = prepareFormData(selectedData);
      // reset will set linkType and selectedObject as provided
      reset(formData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
    // we intentionally omit setValue/watch here; reset will update form state
  }, [open, isEdit, selectedData, reset]);

  // NOTE: removed the effect that cleared selectedObject when linkType changed.
  // That effect was clearing prefilled selectedObject after reset(formData).
  // We keep clearing selectedObject only in handleLinkTypeChange (user action).

  // HANDLE SUBMIT
  const handleSubmit = async (formData: any) => {
    try {
      const payload: any = {
        filterType: formData.linkType,
        filter: formData.selectedObject,
        contentType: formData.contentType,
      };

      // Add status and id for edit mode
      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      const response = isEdit && selectedData ? await updateCategory(payload).unwrap() : await addCategory(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Pinned content updated successfully' : 'Pinned content created successfully'));

      reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // Get options based on link type
  const getDynamicOptions = (): Option[] => {
    switch (linkType) {
      case 'Categories':
      return categoryOptions;
      case 'Tags':
        return tagOptions;
      case 'VenueTypes':
        return venueOptions;
      default:
        return [];
    }
  };

  const getDynamicLabel = () => {
    switch (linkType) {
      case 'Categories':
      return 'Select Category';
      case 'Tags':
        return 'Select Tag';
      case 'VenueTypes':
        return 'Select Venue Type';
      default:
        return 'Select Option';
    }
  };

  const isLoadingOptions = () => {
    switch (linkType) {
      case 'Categories':
        return categoriesLoading;
      case 'Tags':
        return tagsLoading;
      case 'VenueTypes':
        return venueLoading;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Pinned Content' : 'Create Pinned Content'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
                  {/* Link Type */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="linkType">
                      Select Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={linkType} onValueChange={handleLinkTypeChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select link type" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-secondary">
                        <SelectItem value="Categories">Categories</SelectItem>
                        <SelectItem value="Tags">Tags</SelectItem>
                        <SelectItem value="VenueTypes">Venue Types</SelectItem>
                      </SelectContent>
                    </Select>
                    {formState.errors.linkType && <p className="text-sm text-red-500">{formState.errors.linkType.message as string}</p>}
                  </div>

                  {/* Dynamic Dropdown */}
                  {linkType && (
                    <div className="col-span-2">
                      <RHFCustomDropdown
                        name="selectedObject"
                        label={getDynamicLabel()}
                        placeholder={`Select ${getDynamicLabel()}`}
                        options={getDynamicOptions()}
                        isLoading={isLoadingOptions()}
                        showNone={false}
                      />
                    </div>
                  )}


                  {/* Status Field (Only for Edit) */}
                  {isEdit && (
                    <div className="col-span-2">
                      <RHFSelectField
                        name="status"
                        label="Select Status"
                        placeholder="Select Status"
                        className="w-full flex-1"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                      />
                    </div>
                  )}

                  {watch("selectedObject") && (
                    <div className="col-span-2">
                      <RHFSelectField
                        name="contentType"
                        label="Select Content Type"
                        placeholder="Select Content Type"
                        className="w-full flex-1"
                        options={[
                          { value: 'Event', label: 'Event' },
                          { value: 'Organizations', label: 'Organizations' },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* {watch("contentType") === "event" && (

                eventLoading || eventFetching ?
                  <div className="mt-2 w-full space-y-2">
                    <Skeleton className="ml-1 h-3 w-20 rounded-4xl border-gray-200 px-5" />
                    <Skeleton className="h-8 rounded-4xl border-gray-200 px-5" />
                  </div>
                  : (
                    <div className="col-span-2 mt-3">
                      <Label >Select Events</Label>
                      <RHFMultiSelectField
                        name="content"
                        placeholder="Choose Event"
                        options={eventsData?.data?.map((val: any) => ({
                          value: val?._id,
                          label: val?.basicInfo?.title,
                        }))}
                        className="h-[40px] mt-2 cursor-pointer  border-gray-200 px-5 text-left text-[14px] focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                      />
                    </div>
                  )
              )
              }

              {watch("contentType") === "organizations" && (

                organizationLoading || organizationFetching ?
                  <div className="mt-2 w-full space-y-2">
                    <Skeleton className="ml-1 h-3 w-20 rounded-4xl border-gray-200 px-5" />
                    <Skeleton className="h-8 rounded-4xl border-gray-200 px-5" />
                  </div>
                  : (
                    <div className="col-span-2 mt-3">
                      <Label >Select Organizations</Label>
                      <RHFMultiSelectField
                        name="content"
                        placeholder="Choose Organizations"
                        options={organizationsData?.data?.map((val: any) => ({
                          value: val?._id,
                          label: val?.basicInfo?.name,
                        }))}
                        className="h-[40px] mt-2 cursor-pointer  border-gray-200 px-5 text-left text-[14px] focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                      />
                    </div>
                  )
              )
              } */}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center gap-3">
                  <Button type="button" variant="outline" onClick={handleClose} className="px-6 py-2">
                    Cancel
                  </Button>
                  {addCategoryLoading || updateCategoryLoading ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 py-2 text-white">
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-6 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update' : 'Create'}
                    </Button>
                  )}
                </div>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default BannerModalV2;

// 'use client';

// import ButtonLoading from '@/components/common/button-loading';
// import FormProvider, { RHFSelectField } from '@/components/rhf';
// import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogOverlay,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// import {
//   useAddPinnedContentMutation,
//   useUpdatePinnedContentMutation,
// } from '@/store/Reducer/pinned-content-api';
// import { useGetVenuesQuery } from '@/store/Reducer/sample';
// import { useGetTagsQuery } from '@/store/Reducer/tags';
// import { getErrorMessage } from '@/utils/api';
// import { showError, showSuccess } from '@/utils/toast';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import * as Yup from 'yup';

// const defaultValues = {
//   linkType: '',
//   selectedObject: '',
//   status: 'active',
// };

// const schema = Yup.object().shape({
//   linkType: Yup.string().required('Link type is required'),
//   selectedObject: Yup.string().required('Please select an option'),
//   status: Yup.string().required('Status is required'),
// });

// const BannerModalV2 = ({
//   open,
//   onClose,
//   isEdit = false,
//   selectedData,
// }: any) => {
//   const methods = useForm({
//     resolver: yupResolver(schema),
//     defaultValues,
//   });

//   const { watch, reset, formState, setValue } = methods;
//   const isDirty = formState?.isDirty;
//   const linkType = watch('linkType');

//   const { data: categoriesData, isLoading: categoriesLoading } =
//     useGetCategoriesQuery({
//       page: 0,
//       limit: 10000,
//     });

//   const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery({
//     page: 0,
//     limit: 10000,
//   });

//   const { data: venueData, isLoading: venueLoading } = useGetVenuesQuery({
//     page: 0,
//     search: '',
//     limit: '10000',
//     status: '',
//     date: undefined,
//   });

//   const categoryOptions = (categoriesData?.data || []).map((v: any) => ({
//     value: v?._id.toString(),
//     label: v?.title || 'No Title',
//   }));

//   const tagOptions = (tagsData?.data || []).map((v: any) => ({
//     value: v?._id.toString(),
//     label: v?.title || 'No Name',
//   }));

//   const venueOptions = (venueData?.data || []).map((v: any) => ({
//     value: v?._id.toString(),
//     label: v?.title || 'No Name',
//   }));

//   const [addCategory, { isLoading: addCategoryLoading }] =
//     useAddPinnedContentMutation();

//   const [updateCategory, { isLoading: updateCategoryLoading }] =
//     useUpdatePinnedContentMutation();

//   // Handle link type change
//   const handleLinkTypeChange = (value: string) => {
//     setValue('linkType', value, { shouldDirty: true, shouldValidate: true });
//     setValue('selectedObject', '', { shouldDirty: true });
//   };

//   // Prepare form data for editing
//   const prepareFormData = (data: any) => {
//     const formData: any = {
//       linkType: data?.type || '',
//       status: data?.status || 'active',
//     };

//     let objectId = '';
//     objectId = data?.object?._id?.toString() || '';

//     formData.selectedObject = objectId;

//     return formData;
//   };

//   useEffect(() => {
//     if (open && isEdit && selectedData) {
//       const formData = prepareFormData(selectedData);
//       reset(formData);
//     } else if (open && !isEdit) {
//       reset(defaultValues);
//     }
//   }, [open, isEdit, selectedData, reset]);

//   // Reset selectedObject when linkType changes
//   useEffect(() => {
//     if (linkType) {
//       setValue('selectedObject', '', { shouldDirty: true });
//     }
//   }, [linkType, setValue]);

//   // HANDLE SUBMIT
//   const handleSubmit = async (formData: any) => {
//     try {
//       const payload: any = {
//         type: formData.linkType,
//         object: formData.selectedObject,
//       };

//       // Add status and id for edit mode
//       if (isEdit && selectedData) {
//         payload.status = formData.status;
//         payload.id = selectedData._id;
//       }

//       const response =
//         isEdit && selectedData
//           ? await updateCategory(payload).unwrap()
//           : await addCategory(payload).unwrap();

//       if (response?.error) {
//         showError(getErrorMessage(response.error));
//         return;
//       }

//       showSuccess(
//         response?.message ||
//           (isEdit
//             ? 'Pinned content updated successfully'
//             : 'Pinned content created successfully')
//       );

//       methods.reset(defaultValues);
//       onClose();
//     } catch (error) {
//       const errorMessage = getErrorMessage(error);
//       showError(errorMessage);
//     }
//   };

//   const handleClose = () => {
//     reset(defaultValues);
//     onClose();
//   };

//   // Get options based on link type
//   const getDynamicOptions = () => {
//     switch (linkType) {
//       case 'Categories':
//         return categoryOptions;
//       case 'Tags':
//         return tagOptions;
//       case 'Venues':
//         return venueOptions;
//       default:
//         return [];
//     }
//   };

//   const getDynamicLabel = () => {
//     switch (linkType) {
//       case 'Categories':
//         return 'Select Category';
//       case 'Tags':
//         return 'Select Tag';
//       case 'Venues':
//         return 'Select Venue';
//       default:
//         return 'Select Option';
//     }
//   };

//   const isLoadingOptions = () => {
//     switch (linkType) {
//       case 'Categories':
//         return categoriesLoading;
//       case 'Tags':
//         return tagsLoading;
//       case 'Venues':
//         return venueLoading;
//       default:
//         return false;
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogOverlay className="bg-opacity-30 fixed inset-0">
//         <DialogContent
//           aria-describedby={undefined}
//           className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]"
//         >
//           <DialogHeader>
//             <DialogTitle>
//               {isEdit ? 'Edit Pinned Content' : 'Create Pinned Content'}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="mt-4 w-full">
//             <FormProvider
//               methods={methods}
//               onSubmit={methods.handleSubmit(handleSubmit)}
//             >
//               <div className="mt-0 flex w-full flex-col gap-4">
//                 <div className="grid w-full grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
//                   {/* Link Type */}
//                   <div className="col-span-2 space-y-2">
//                     <Label htmlFor="linkType">
//                       Select Type <span className="text-red-500">*</span>
//                     </Label>
//                     <Select
//                       value={linkType}
//                       onValueChange={handleLinkTypeChange}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select link type" />
//                       </SelectTrigger>
//                       <SelectContent className="dark:bg-secondary">
//                         <SelectItem value="Categories">Categories</SelectItem>
//                         <SelectItem value="Tags">Tags</SelectItem>
//                         <SelectItem value="Venues">Venues</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     {formState.errors.linkType && (
//                       <p className="text-sm text-red-500">
//                         {formState.errors.linkType.message as string}
//                       </p>
//                     )}
//                   </div>

//                   {/* Dynamic Dropdown */}
//                   {linkType && (
//                     <div className="col-span-2">
//                       <RHFCustomDropdown
//                         name="selectedObject"
//                         label={getDynamicLabel()}
//                         placeholder={`Select ${getDynamicLabel()}`}
//                         options={getDynamicOptions()}
//                         isLoading={isLoadingOptions()}
//                         showNone={false}
//                       />
//                     </div>
//                   )}

//                   {/* Status Field (Only for Edit) */}
//                   {isEdit && (
//                     <div className="col-span-2">
//                       <RHFSelectField
//                         name="status"
//                         label="Select Status"
//                         placeholder="Select Status"
//                         className="w-full flex-1"
//                         options={[
//                           { value: 'active', label: 'Active' },
//                           { value: 'inactive', label: 'Inactive' },
//                         ]}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="mt-6 flex items-center justify-end gap-2">
//                 <div className="flex w-full items-center justify-center gap-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleClose}
//                     className="px-6 py-2"
//                   >
//                     Cancel
//                   </Button>
//                   {addCategoryLoading || updateCategoryLoading ? (
//                     <Button
//                       type="button"
//                       disabled
//                       className="bg-primary hover:bg-primary cursor-not-allowed px-6 py-2 text-white"
//                     >
//                       <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
//                     </Button>
//                   ) : (
//                     <Button
//                       type="submit"
//                       className="bg-primary hover:bg-primary-dark cursor-pointer px-6 py-2 text-white"
//                       disabled={isEdit ? !isDirty : false}
//                     >
//                       {isEdit ? 'Update' : 'Create'}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </FormProvider>
//           </div>
//         </DialogContent>
//       </DialogOverlay>
//     </Dialog>
//   );
// };

// export default BannerModalV2;
