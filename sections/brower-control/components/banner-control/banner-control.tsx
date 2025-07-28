"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Edit, Trash2, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Banner {
  id: string;
  title: string;
  description?: string;
  position: "top" | "inline" | "bottom";
  status: "live" | "scheduled" | "draft";
  clicks?: number;
  scheduledDate?: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
  linkType?: "loyalty" | "event" | "organizer";
  linkTarget?: string;
  linkTargetName?: string;
}

// Mock data for dropdowns
const mockData = {
  loyalty: [
    { id: "1", name: "VIP Rewards Program" },
    { id: "2", name: "Gold Member Benefits" },
    { id: "3", name: "Platinum Club" },
  ],
  event: [
    { id: "1", name: "Summer Music Festival" },
    { id: "2", name: "Tech Conference 2024" },
    { id: "3", name: "Food & Wine Expo" },
    { id: "4", name: "Art Gallery Opening" },
  ],
  organizer: [
    { id: "1", name: "Event Masters Inc." },
    { id: "2", name: "Creative Productions" },
    { id: "3", name: "Elite Event Planning" },
  ],
};

const BannerControl = () => {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "1",
      title: "Pride Parade 2024",
      description: "Join us for the biggest celebration of the year",
      position: "top",
      status: "live",
      clicks: 1200,
      backgroundColor: "#6366f1",
      textColor: "#ffffff",
      image: "/placeholder.svg?height=200&width=400&text=Pride+Parade+2024",
      linkType: "event",
      linkTarget: "1",
      linkTargetName: "Summer Music Festival",
    },
    {
      id: "2",
      title: "Tech Conference",
      description: "Discover the latest in technology and innovation",
      position: "inline",
      status: "scheduled",
      scheduledDate: "Tomorrow",
      backgroundColor: "#3b82f6",
      textColor: "#ffffff",
      image: "/placeholder.svg?height=200&width=400&text=Tech+Conference+2024",
      linkType: "organizer",
      linkTarget: "2",
      linkTargetName: "Creative Productions",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    linkType: "" as Banner["linkType"] | "",
    linkTarget: "",
    linkTargetName: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      linkType: "",
      linkTarget: "",
      linkTargetName: "",
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

  const handleLinkTypeChange = (linkType: Banner["linkType"]) => {
    setFormData({
      ...formData,
      linkType,
      linkTarget: "",
      linkTargetName: "",
    });
  };

  const handleLinkTargetChange = (targetId: string) => {
    const targetName = formData.linkType
      ? mockData[formData.linkType].find((item) => item.id === targetId)
          ?.name || ""
      : "";
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
      description: "",
      position: "top",
      status: "draft",
      backgroundColor: "#6366f1",
      textColor: "#ffffff",
      image:
        formData.image ||
        "/placeholder.svg?height=200&width=400&text=" +
          encodeURIComponent(formData.title),
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
      image: banner.image || "",
      linkType: banner.linkType || "",
      linkTarget: banner.linkTarget || "",
      linkTargetName: banner.linkTargetName || "",
    });
    setIsEditModalOpen(true);
  };

  const BannerForm = ({
    onSubmit,
    submitText,
  }: {
    onSubmit: () => void;
    submitText: string;
  }) => (
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
            <div className="w-16 h-16 rounded-lg overflow-hidden border">
              <img
                src={formData.image || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="linkType">Link Type</Label>
            <Select
              value={formData.linkType}
              onValueChange={(value: string) =>
                handleLinkTypeChange(value as Banner["linkType"])
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
            <div className="space-y-2 w-full">
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
    <div className="p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banner Manager</h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">Create and manage your banners</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary">
              <Plus />
              Create Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg dark:bg-secondary">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {banners.map((banner) => (
          <Card
            key={banner.id}
            className="group hover:shadow-xl transition-all duration-300 py-0 shadow-lg bg-white dark:bg-secondary"
          >
            <CardContent className="p-0">
              {/* Banner Preview */}
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="h-48 relative bg-gray-100">
                  <img
                    // src={ banner.image || "/placeholder.svg?height=200&width=400&text=" + encodeURIComponent(banner.title)}
                    src="https://www.eventbrite.co.uk/blog/wp-content/uploads/2022/06/How-to-Promote-Your-Gigs-768x512.jpg"
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Banner Details */}
              <div className="px-4 py-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="space-y-2">
                      {banner.linkType && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {banner.linkType}
                        </Badge>
                      )}

                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {banner.title}
                      </h4>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      {banner.linkTargetName && (
                        <div className="flex items-center cursor-pointer space-x-2">
                          <ExternalLink className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-600">
                            Links to: {banner.linkTargetName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(banner)}
                      className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No banners yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first banner to get started
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Banner
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg dark:bg-secondary">
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
