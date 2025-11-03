'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CustomBadge from '@/components/ui/custom-badge';

interface UserDetailsModalProps {
  user?: any;
  isOpen: boolean;
  onClose: () => void;
}

const PendingUserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="max-h-[90vh] max-w-4xl overflow-y-auto dark:bg-[#1c1c1e]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="dark:bg-secondary flex items-center gap-4 rounded-lg border bg-gray-50 p-4">
            <Avatar className="flex h-16 w-16 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
              {user?.basicInfo?.profileIcon && user?.basicInfo?.profileIcon !== 'noimage.png' ? (
                <AvatarImage src={user?.basicInfo?.profileIcon} alt="User" className="h-full w-full cursor-pointer object-cover" />
              ) : (
                <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{user?.basicInfo?.firstName?.[0]?.toUpperCase() || ''}</span>
              )}
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {user?.basicInfo?.firstName || '-'} {user?.basicInfo?.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.basicInfo?.email || '-'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.basicInfo?.phoneNumber?.code || ''}
                {user?.basicInfo?.phoneNumber?.number || ''}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge className="bg-secondary text-white capitalize dark:bg-white dark:text-black">{user?.accountState?.userType || ''}</Badge>
                <CustomBadge
                  variant={
                    user?.accountState?.status === 'active'
                      ? 'success'
                      : user?.accountState?.status === 'pending' || user?.accountState?.status === 'inactive'
                        ? 'error'
                        : 'default'
                  }
                >
                  {user?.accountState?.status || ''}
                </CustomBadge>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          {user.organization && (
            <div className="grid gap-4">
              <h4 className="border-b pb-2 text-lg font-semibold">Organization Information</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <Input id="organization" value={user?.basicInfo?.companyDetails?.name || ''} readOnly className="bg-gray-50 dark:bg-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" value={user.region || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="grid gap-4">
            <h4 className="border-b pb-2 text-lg font-semibold">Company Information</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" value={user?.basicInfo?.companyDetails?.name || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">VAT</Label>
                <Input id="vat" value={user?.basicInfo?.companyDetails?.oib || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  value={user?.basicInfo?.companyDetails?.bankAccountNumber || 'N/A'}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={user?.basicInfo?.companyDetails?.location?.postalCode || 'N/A'}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="representativeFullName">Representative Full Name</Label>
                <Input
                  id="representativeFullName"
                  value={user?.basicInfo?.companyDetails?.representativeName || 'N/A'}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={user?.basicInfo?.companyDetails?.location?.fullAddress || 'N/A'}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={user?.basicInfo?.companyDetails?.location?.country || 'N/A'}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={user?.basicInfo?.companyDetails?.location?.city || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="suppliers">List of Suppliers</Label>
                <div className="dark:bg-secondary rounded-md border bg-gray-50 px-3 py-1.5">
                  {user?.basicInfo?.companyDetails?.suppliers && user?.basicInfo?.companyDetails?.suppliers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user?.basicInfo?.companyDetails?.suppliers.map((supplier: any, index: number) => (
                        <Badge key={index} variant="outline">
                          {supplier?.title || 'N/A'}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-black dark:text-gray-400">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingUserDetailsModal;
