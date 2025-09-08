// ------------------ EXAMPLE USAGE ------------------

// try {
//   const response = await addCategory(data).unwrap();
//   enqueueSnackbar(getSuccessMessage(response), {
//     variant: 'success',
//     autoHideDuration: 2000,
//   });

//   reset();
//   refetch();
//   onClose();
// } catch (error: any) {
//   const errorMessage = getErrorMessage(error);   <------ This is where the utility is used
//   enqueueSnackbar(errorMessage, {
//     variant: 'error',
//     autoHideDuration: 2000,
//   });
//   console.log('Failed to add category:', error);
// }

export const getErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.data?.errors?.[0]?.message ||
    error?.message ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    'An unexpected error occurred'
  );
};
