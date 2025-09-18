"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CustomBadge from "../ui/custom-badge";

interface UserItem {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  organization?: string;
  phone?: string;
  totalPoints?: number;
  totalRevenue?: number;
  region?: string;
  // Additional fields from the form
  companyName?: string;
  oib?: string;
  bankAccountNumber?: string;
  postalCode?: string;
  representativeFullName?: string;
  address?: string;
  country?: string;
  city?: string;
  suppliers?: string[];
}

interface UserDetailsModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <Avatar className="w-16 h-16 rounded-xl">
              <AvatarImage
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.phone}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-secondary capitalize dark:bg-white text-white dark:text-black">
                  {user.role}
                </Badge>
                
                  variant={
                    user.status === "active"
                      ? "success"
                      : user.status === "pending" || user.status === "inactive"
                      ? "error"
                      : "default"
                  }<CustomBadge
                >
                  {user.status}
                </CustomBadge>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          {user.organization && (
            <div className="grid gap-4">
              <h4 className="text-lg font-semibold border-b pb-2">
                Organization Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <Input
                    id="organization"
                    value={user.organization}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={user.region || "N/A"}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="grid gap-4">
            <h4 className="text-lg font-semibold border-b pb-2">
              Company Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={user.companyName || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oib">OIB</Label>
                <Input
                  id="oib"
                  value={user.oib || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  value={user.bankAccountNumber || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={user.postalCode || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="representativeFullName">
                  Representative Full Name
                </Label>
                <Input
                  id="representativeFullName"
                  value={user.representativeFullName || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={user.address || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={user.country || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={user.city || "N/A"}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="suppliers">List of Suppliers</Label>
                <div className="px-3 py-1.5 border rounded-md bg-gray-50 dark:bg-gray-800">
                  {user.suppliers && user.suppliers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.suppliers.map((supplier, index) => (
                        <Badge key={index} variant="outline">
                          {supplier}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-black text-sm dark:text-gray-400">
                      N/A
                    </span>
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

export default UserDetailsModal;
