'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useAddStreakMutation, useUpdateStreakMutation } from '@/store/Reducer/streaks-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ============================================
// 1. TYPE DEFINITIONS
// ============================================
type StreakFormValues = {
  visits: number;
  points: number;
  status: 'active' | 'inactive';
};

type StreakModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  selectedCompany?: { value: string; label: string } | null;
};

// ============================================
// 2. SCHEMA VALIDATION
// ============================================
const schema = Yup.object().shape({
  visits: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Visit Interval (X) must be a number')
    .required('Visit Interval (X) is required')
    .min(1, 'Must be at least 1')
    .integer('Must be a whole number')
    .default(0),
  points: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Point Reward (Y) must be a number')
    .required('Point Reward (Y) is required')
    .min(1, 'Must be at least 1')
    .integer('Must be a whole number')
    .default(0),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as Yup.ObjectSchema<StreakFormValues>;

// ============================================
// 3. DEFAULT VALUES
// ============================================
const defaultValues: StreakFormValues = {
  visits: '' as any,
  points: '' as any,
  status: 'active',
};

// ============================================
// 4. MAIN COMPONENT
// ============================================
const StreaksModal = ({ open, onClose, isEdit = false, selectedData, selectedCompany }: StreakModalProps) => {
  const [addStreakRule, { isLoading: addStreakLoading }] = useAddStreakMutation();
  const [updateStreakRule, { isLoading: updateStreakLoading }] = useUpdateStreakMutation();

  // ============================================
  // 5. FORM INITIALIZATION
  // ============================================
  const methods = useForm<StreakFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  // ============================================
  // 6. OPTIONS
  // ============================================
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // ============================================
  // 7. EDIT MODE DATA POPULATION
  // ============================================
  useEffect(() => {
    if (open && isEdit && selectedData) {
      const mappedData: StreakFormValues = {
        visits: selectedData?.visits || ('' as any),
        points: selectedData?.points || ('' as any),
        status: selectedData?.status || 'active',
      };

      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  // ============================================
  // 8. SUBMIT HANDLER
  // ============================================
  const handleSubmit = async (formData: StreakFormValues) => {
    try {
      // Validate company is selected
      if (!selectedCompany?.value) {
        showError('Please select a company first');
        return;
      }

      // Build payload matching Postman format
      const payload: any = {
        visits: Number(formData.visits),
        points: Number(formData.points),
        companyOrganizer: selectedCompany.value,
      };

      // Add fields for edit mode
      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      // Call API
      const response = isEdit ? await updateStreakRule(payload).unwrap() : await addStreakRule(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Streak rule updated successfully' : 'Streak rule created successfully'));

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // ============================================
  // 9. CLOSE HANDLER
  // ============================================
  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // ============================================
  // 10. LOADING STATE
  // ============================================
  const isLoading = addStreakLoading || updateStreakLoading;

  // ============================================
  // 11. RENDER
  // ============================================
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[25vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Streak Rule' : 'Create Streak Rule'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                {/* Help Text */}
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  <p className="font-medium">Rule Format:</p>
                  <p className="mt-1">
                    Every <strong>X visits</strong>, reward user with <strong>Y points</strong>
                  </p>
                  <p className="mt-1 text-xs opacity-80">Example: Every 5 visits, reward 100 points</p>
                </div>

                {/* Form Fields */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="visits" label="Visit Interval (X)" placeholder="e.g., 5" type="number" min="1" />

                  <RHFTextField name="points" label="Point Reward (Y)" placeholder="e.g., 100" type="number" min="1" />
                </div>

                {/* Status - Only in edit mode */}
                {isEdit && (
                  <div className="mt-2">
                    <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
                  </div>
                )}

                {/* Preview */}
                <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Preview:</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Every <strong>{methods.watch('visits') || '___'}</strong> visits → Reward <strong>{methods.watch('points') || '___'}</strong>{' '}
                    points
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Rule' : 'Create Rule'}
                  </Button>
                )}
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default StreaksModal;

// 'use client';

// import ButtonLoading from '@/components/common/button-loading';
// import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
// import { useAddStreakMutation, useUpdateStreakMutation } from '@/store/Reducer/streaks-api';
// import { getErrorMessage } from '@/utils/api';
// import { showError, showSuccess } from '@/utils/toast';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import * as Yup from 'yup';

// // ============================================
// // 1. TYPE DEFINITIONS
// // ============================================
// type StreakFormValues = {
//   visits: number;
//   points: number;
//   status: 'active' | 'inactive';
// };

// type StreakModalProps = {
//   open: boolean;
//   onClose: () => void;
//   isEdit?: boolean;
//   selectedData?: any;
//   selectedCompany?: { value: string; label: string } | null;
// };

// // ============================================
// // 2. SCHEMA VALIDATION
// // ============================================
// const schema = Yup.object().shape({
//   visits: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
//     .typeError('Visit Interval (X) must be a number')
//     .required('Visit Interval (X) is required')
//     .min(1, 'Must be at least 1')
//     .integer('Must be a whole number')
//     .default(0),
//   points: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
//     .typeError('Point Reward (Y) must be a number')
//     .required('Point Reward (Y) is required')
//     .min(1, 'Must be at least 1')
//     .integer('Must be a whole number')
//     .default(0),
//   status: Yup.string()
//     .oneOf(['active', 'inactive'] as const)
//     .default('active'),
// }) as Yup.ObjectSchema<StreakFormValues>;

// // ============================================
// // 3. DEFAULT VALUES
// // ============================================
// const defaultValues: StreakFormValues = {
//   visits: 0,
//   points: 0,
//   status: 'active',
// };

// // ============================================
// // 4. MAIN COMPONENT
// // ============================================
// const StreaksModal = ({ open, onClose, isEdit = false, selectedData, selectedCompany }: StreakModalProps) => {
//   const [addStreakRule, { isLoading: addStreakLoading }] = useAddStreakMutation();
//   const [updateStreakRule, { isLoading: updateStreakLoading }] = useUpdateStreakMutation();

//   // ============================================
//   // 5. FORM INITIALIZATION
//   // ============================================
//   const methods = useForm<StreakFormValues>({
//     resolver: yupResolver(schema),
//     defaultValues,
//     mode: 'onChange',
//   });

//   const { reset, formState } = methods;
//   const isDirty = formState?.isDirty;

//   // ============================================
//   // 6. OPTIONS
//   // ============================================
//   const statusOptions = [
//     { value: 'active', label: 'Active' },
//     { value: 'inactive', label: 'Inactive' },
//   ];

//   // ============================================
//   // 7. EDIT MODE DATA POPULATION
//   // ============================================
//   useEffect(() => {
//     if (open && isEdit && selectedData) {
//       const mappedData: StreakFormValues = {
//         visits: selectedData?.visits || 0,
//         points: selectedData?.points || 0,
//         status: selectedData?.status || 'active',
//       };

//       reset(mappedData);
//     } else if (open && !isEdit) {
//       reset(defaultValues);
//     }
//   }, [open, isEdit, selectedData, reset]);

//   // ============================================
//   // 8. SUBMIT HANDLER
//   // ============================================
//   const handleSubmit = async (formData: StreakFormValues) => {
//     try {
//       // Validate company is selected
//       if (!selectedCompany?.value) {
//         showError('Please select a company first');
//         return;
//       }

//       // Build payload matching Postman format
//       const payload: any = {
//         visits: Number(formData.visits),
//         points: Number(formData.points),
//         companyOrganizer: selectedCompany.value,
//       };

//       // Add fields for edit mode
//       if (isEdit && selectedData) {
//         payload.status = formData.status;
//         payload.id = selectedData._id;
//       }

//       // Call API
//       const response = isEdit ? await updateStreakRule(payload).unwrap() : await addStreakRule(payload).unwrap();

//       if (!response) {
//         showError('No response from server. Please try again later.');
//         return;
//       }

//       if (response?.error) {
//         showError(getErrorMessage(response.error));
//         return;
//       }

//       showSuccess(response?.message || (isEdit ? 'Streak rule updated successfully' : 'Streak rule created successfully'));

//       methods.reset(defaultValues);
//       onClose();
//     } catch (error) {
//       const errorMessage = getErrorMessage(error);
//       showError(errorMessage);
//     }
//   };

//   // ============================================
//   // 9. CLOSE HANDLER
//   // ============================================
//   const handleClose = () => {
//     reset(defaultValues);
//     onClose();
//   };

//   // ============================================
//   // 10. LOADING STATE
//   // ============================================
//   const isLoading = addStreakLoading || updateStreakLoading;

//   // ============================================
//   // 11. RENDER
//   // ============================================
//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogOverlay className="bg-opacity-30 fixed inset-0">
//         <DialogContent
//           aria-describedby={undefined}
//           className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[25vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
//         >
//           <DialogHeader>
//             <DialogTitle>{isEdit ? 'Edit Streak Rule' : 'Create Streak Rule'}</DialogTitle>
//           </DialogHeader>

//           <div className="w-full">
//             <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
//               <div className="mt-6 flex w-full flex-col gap-4">
//                 {/* Help Text */}
//                 <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
//                   <p className="font-medium">Rule Format:</p>
//                   <p className="mt-1">
//                     Every <strong>X visits</strong>, reward user with <strong>Y points</strong>
//                   </p>
//                   <p className="mt-1 text-xs opacity-80">Example: Every 5 visits, reward 100 points</p>
//                 </div>

//                 {/* Form Fields */}
//                 <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
//                   <RHFTextField name="visits" label="Visit Interval (X)" placeholder="e.g., 5" type="number" min="1" />

//                   <RHFTextField name="points" label="Point Reward (Y)" placeholder="e.g., 100" type="number" min="1" />
//                 </div>

//                 {/* Status - Only in edit mode */}
//                 {isEdit && (
//                   <div className="mt-2">
//                     <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
//                   </div>
//                 )}

//                 {/* Preview */}
//                 <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
//                   <p className="font-medium text-gray-700 dark:text-gray-300">Preview:</p>
//                   <p className="mt-1 text-gray-600 dark:text-gray-400">
//                     Every <strong>{methods.watch('visits') || 0}</strong> visits → Reward <strong>{methods.watch('points') || 0}</strong> points
//                   </p>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="mt-6 flex items-center justify-center gap-3">
//                 <Button type="button" variant="outline" onClick={handleClose} className="px-6">
//                   Cancel
//                 </Button>

//                 {isLoading ? (
//                   <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
//                     <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
//                   </Button>
//                 ) : (
//                   <Button
//                     type="submit"
//                     className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
//                     disabled={isEdit ? !isDirty : false}
//                   >
//                     {isEdit ? 'Update Rule' : 'Create Rule'}
//                   </Button>
//                 )}
//               </div>
//             </FormProvider>
//           </div>
//         </DialogContent>
//       </DialogOverlay>
//     </Dialog>
//   );
// };

// export default StreaksModal;

// // 'use client';

// // import ButtonLoading from '@/components/common/button-loading';
// // import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
// // import { Button } from '@/components/ui/button';
// // import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
// // import { getErrorMessage } from '@/utils/api';
// // import { showError, showSuccess } from '@/utils/toast';
// // import { yupResolver } from '@hookform/resolvers/yup';
// // import { useEffect } from 'react';
// // import { useForm } from 'react-hook-form';
// // import * as Yup from 'yup';
// // import { MenuItemFormValues, MenuItemModalProps } from './types';
// // import { useAddStreakMutation, useUpdateStreakMutation } from '@/store/Reducer/streaks-api';

// // const defaultValues: MenuItemFormValues = {
// //   visits: '',
// //   points: '',
// //   status: 'active',
// // };

// // const schema = Yup.object().shape({
// //   visits: Yup.number().typeError('Visit Interval (X) must be a number').required('Visit Interval (X) is required'),
// //   points: Yup.number().typeError('Point Reward (Y) must be a number').required('Point Reward (Y) is required'),
// //   status: Yup.string().optional(),
// // });

// // const StreaksModal = ({ open, onClose, isEdit = false, selectedData, selectedCompany }: MenuItemModalProps) => {
// //   const methods = useForm<MenuItemFormValues>({
// //     resolver: yupResolver(schema as Yup.ObjectSchema<MenuItemFormValues>),
// //     defaultValues,
// //   });

// //   console.log('selectedData', selectedData);

// //   const { reset, formState } = methods;
// //   const isDirty = formState?.isDirty;

// //   const prepareFormData = (data: any): MenuItemFormValues => ({
// //     visits: data.visits?.toString() || '',
// //     points: data.points?.toString() || '',
// //     status: data.status || 'active',
// //   });

// //   useEffect(() => {
// //     if (open && isEdit && selectedData) {
// //       const formData = prepareFormData(selectedData);
// //       reset(formData);
// //     } else if (open && !isEdit) {
// //       reset(defaultValues);
// //     }
// //   }, [open, isEdit, selectedData, reset]);

// //   const [addStreakRule, { isLoading: addStreakLoading }] = useAddStreakMutation();
// //   const [updateStreakRule, { isLoading: updateStreakLoading }] = useUpdateStreakMutation();

// //   const handleSubmit = async (formData: any) => {
// //     try {
// //       const payload: any = {
// //         visits: Number(formData?.visits),
// //         points: Number(formData?.points),
// //         companyOrganizer: selectedCompany?.value || '',
// //       };

// //       if (isEdit && selectedData) {
// //         payload.status = formData?.status;
// //         payload.id = selectedData?._id;
// //       }

// //       const response = isEdit && selectedData ? await updateStreakRule(payload).unwrap() : await addStreakRule(payload).unwrap();

// //       if (!response) {
// //         showError('No response from server. Please try again later.');
// //         return;
// //       }

// //       if (response?.error) {
// //         showError(getErrorMessage(response.error));
// //         return;
// //       }

// //       showSuccess(response?.message || (isEdit ? 'Streak updated successfully' : 'Streak created successfully'));

// //       methods.reset(defaultValues);
// //       onClose();
// //     } catch (error) {
// //       const errorMessage = getErrorMessage(error);
// //       showError(errorMessage);
// //     }
// //   };

// //   const handleClose = () => {
// //     reset(defaultValues);
// //     onClose();
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={handleClose}>
// //       <DialogOverlay className="bg-opacity-30 fixed inset-0">
// //         <DialogContent
// //           aria-describedby={undefined}
// //           className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[25vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
// //         >
// //           <DialogHeader>
// //             <DialogTitle>{isEdit ? 'Edit Rule' : 'Create Rule'}</DialogTitle>
// //           </DialogHeader>
// //           <div className="mt-4 w-full">
// //             <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
// //               <div className="mt-0 flex w-full flex-col gap-4">
// //                 <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
// //                   <div>
// //                     <RHFTextField name="visits" label="Visit Interval (X)" placeholder="e.g., 5" />
// //                   </div>

// //                   <div>
// //                     <RHFTextField name="points" label="Point Reward (Y)" placeholder="e.g., 100" />
// //                   </div>

// //                   {isEdit && (
// //                     <RHFSelectField
// //                       name="status"
// //                       label="Select Status"
// //                       placeholder="Select Status"
// //                       className="w-full flex-1"
// //                       options={[
// //                         { value: 'active', label: 'Active' },
// //                         { value: 'inactive', label: 'Inactive' },
// //                       ]}
// //                     />
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="mt-4 flex items-center justify-end gap-2">
// //                 <div className="flex w-full items-center justify-center">
// //                   {addStreakLoading || updateStreakLoading ? (
// //                     <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
// //                       <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
// //                     </Button>
// //                   ) : (
// //                     <Button
// //                       type="submit"
// //                       className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
// //                       disabled={isEdit ? !isDirty : false}
// //                     >
// //                       {isEdit ? 'Update Rule' : 'Create Rule'}
// //                     </Button>
// //                   )}
// //                 </div>
// //               </div>
// //             </FormProvider>
// //           </div>
// //         </DialogContent>
// //       </DialogOverlay>
// //     </Dialog>
// //   );
// // };

// // export default StreaksModal;
