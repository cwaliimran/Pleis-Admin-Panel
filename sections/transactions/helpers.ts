export const getBadgeVariant = (type: string): 'success' | 'error' | 'warning' | 'default' => {
  switch (type) {
    case 'earn':
      return 'success';
    case 'redeem':
      return 'error';
    case 'adjustment':
      return 'warning';
    default:
      return 'default';
  }
};

export const getBadgeLabel = (type: string): string => {
  switch (type) {
    case 'earn':
      return 'Earned';
    case 'redeem':
      return 'Redeemed';
    case 'adjustment':
      return 'Adjusted';
    default:
      return 'N/A';
  }
};
