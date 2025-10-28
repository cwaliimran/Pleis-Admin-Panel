'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CustomBadge from '@/components/ui/custom-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetBannerControlQuery } from '@/store/Reducer/banner-control-api';
import { Edit, ExternalLink, Plus, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';

interface Banner {
  id: string;
  title: string;
  description?: string;
  position: 'top' | 'inline' | 'bottom';
  status: 'active' | 'inactive' | 'draft';
  clicks?: number;
  scheduledDate?: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
  linkType?: 'loyalty' | 'event' | 'organizer';
  linkTarget?: string;
  linkTargetName?: string;
}

// Mock data for dropdowns
const mockData = {
  loyalty: [
    { id: '1', name: 'VIP Rewards Program' },
    { id: '2', name: 'Gold Member Benefits' },
    { id: '3', name: 'Platinum Club' },
  ],
  event: [
    { id: '1', name: 'Summer Music Festival' },
    { id: '2', name: 'Tech Conference 2024' },
    { id: '3', name: 'Food & Wine Expo' },
    { id: '4', name: 'Art Gallery Opening' },
  ],
  organizer: [
    { id: '1', name: 'Event Masters Inc.' },
    { id: '2', name: 'Creative Productions' },
    { id: '3', name: 'Elite Event Planning' },
  ],
};

const BannerControl = () => {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Pride Parade 2024',
      description: 'Join us for the biggest celebration of the year',
      position: 'top',
      status: 'active',
      clicks: 1200,
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      image: '/placeholder.svg?height=200&width=400&text=Pride+Parade+2024',
      linkType: 'event',
      linkTarget: '1',
      linkTargetName: 'Summer Music Festival',
    },
    {
      id: '2',
      title: 'Tech Conference',
      description: 'Discover the latest in technology and innovation',
      position: 'inline',
      status: 'inactive',
      scheduledDate: 'Tomorrow',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      image: '/placeholder.svg?height=200&width=400&text=Tech+Conference+2024',
      linkType: 'organizer',
      linkTarget: '2',
      linkTargetName: 'Creative Productions',
    },
  ]);

  const { data: apiData } = useGetBannerControlQuery({});
  console.log('apiData', apiData?.data);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    status: '',
    image: '',
    linkType: '' as Banner['linkType'] | '',
    linkTarget: '',
    linkTargetName: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      status: '',
      image: '',
      linkType: '',
      linkTarget: '',
      linkTargetName: '',
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkTypeChange = (linkType: Banner['linkType']) => {
    setFormData({
      ...formData,
      linkType,
      linkTarget: '',
      linkTargetName: '',
    });
  };

  const handleStatusChange = (status: Banner['status']) => {
    setFormData({ ...formData, status });
  };

  const handleLinkTargetChange = (targetId: string) => {
    const targetName = formData.linkType
      ? mockData[formData.linkType].find((item) => item.id === targetId)
          ?.name || ''
      : '';
    setFormData({
      ...formData,
      linkTarget: targetId,
      linkTargetName: targetName,
    });
  };

  const handleCreateBanner = () => {
    const newBanner: Banner = {
      id: Date.now().toString(),
      title: formData.title,
      description: '',
      position: 'top',
      status: 'draft',
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      image: formData.image || '/placeholder.svg?height=200&width=400&text=' + encodeURIComponent(formData.title),
      linkType: formData.linkType || undefined,
      linkTarget: formData.linkTarget,
      linkTargetName: formData.linkTargetName,
    };
    setBanners([...banners, newBanner]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditBanner = () => {
    if (!editingBanner) return;

    const updatedBanners = banners.map((banner) =>
      banner.id === editingBanner.id
        ? {
            ...banner,
            title: formData.title,
            image: formData.image,
            linkType: formData.linkType || undefined,
            linkTarget: formData.linkTarget,
            linkTargetName: formData.linkTargetName,
          }
        : banner
    );
    setBanners(updatedBanners);
    setIsEditModalOpen(false);
    setEditingBanner(null);
    resetForm();
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      status: banner.status,
      image: banner.image || '',
      linkType: banner.linkType || '',
      linkTarget: banner.linkTarget || '',
      linkTargetName: banner.linkTargetName || '',
    });
    setIsEditModalOpen(true);
  };

  const BannerForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Banner Name</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter banner name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Banner Image</Label>
        <div className="flex items-center space-x-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1"
          />
          {formData.image && (
            <div className="h-16 w-16 overflow-hidden rounded-lg border">
              {/* <img
                src={formData.image || '/placeholder.svg'}
                alt="Preview"
                className="h-full w-full object-cover"
              /> */}

              <Image
                src={formData.image || '/placeholder.svg'}
                alt={formData.title}
                className="h-full w-full object-cover"
                height={300}
                width={300}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="w-full space-y-2">
            <Label htmlFor="linkType">Link Type</Label>
            <Select
              value={formData.linkType}
              onValueChange={(value: string) =>
                handleLinkTypeChange(value as Banner['linkType'])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value="loyalty">Loyalty Program</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="organizer">Organizer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.linkType && (
            <div className="w-full space-y-2">
              <Label htmlFor="linkTarget">Select {formData.linkType}</Label>
              <Select
                value={formData.linkTarget}
                onValueChange={handleLinkTargetChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${formData.linkType}`} />
                </SelectTrigger>
                <SelectContent className="dark:bg-secondary">
                  {mockData[formData.linkType].map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="w-full space-y-2">
            <Label htmlFor="linkType">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: string) =>
                handleStatusChange(value as Banner['status'])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button className="cursor-pointer" onClick={onSubmit}>
          {submitText}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Banner Manager
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Create and manage your banners
          </p>
        </div>
        <Dialog
          open={isCreateModalOpen}
          onOpenChange={(open) => {
            setIsCreateModalOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white">
              <Plus />
              Create Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-secondary max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Banner</DialogTitle>
            </DialogHeader>
            <BannerForm
              onSubmit={handleCreateBanner}
              submitText="Create Banner"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {banners.map((banner) => (
          <Card
            key={banner.id}
            className="group dark:bg-secondary bg-white py-0 shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <CardContent className="p-0">
              {/* Banner Preview */}
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src="https://cdn.shopify.com/s/files/1/0704/6378/2946/files/MacBook_Pro_16__-_3.jpg?v=1755502657"
                    alt={banner.title}
                    className="h-full w-full object-cover"
                    height={300}
                    width={300}
                  />
                </div>
              </div>

              {/* Banner Details */}
              <div className="space-y-4 px-4 py-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {banner.linkType && (
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {banner.linkType}
                          </Badge>
                        )}

                        <CustomBadge
                          variant={
                            banner.status === 'active'
                              ? 'success'
                              : banner.status === 'inactive'
                                ? 'error'
                                : 'default'
                          }
                        >
                          {banner.status}
                        </CustomBadge>
                      </div>

                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {banner.title}
                      </h4>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      {banner.linkTargetName && (
                        <div className="flex cursor-pointer items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">
                            Links to: {banner.linkTargetName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(banner)}
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No banners yet
          </h3>
          <p className="mb-4 text-gray-600">
            Create your first banner to get started
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Banner
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setEditingBanner(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="dark:bg-secondary max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          <BannerForm onSubmit={handleEditBanner} submitText="Update Banner" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerControl;
