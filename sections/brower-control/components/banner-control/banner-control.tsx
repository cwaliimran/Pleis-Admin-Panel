'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CustomBadge from '@/components/ui/custom-badge';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteBannerControlMutation, useGetBannerControlQuery } from '@/store/Reducer/banner-control-api';
import { getErrorMessage } from '@/utils/api';
import { capitalizeFirstLetter } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Edit, ExternalLink, Plus, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import BannerModalV2 from './banner-modal-v2';
import BannerCardSkeleton from './banner-skelton';
import EmptyState from './empty-state';
import { Banner } from './types';

const BannerControl = () => {
  const { data: apiResponse, isLoading } = useGetBannerControlQuery({});

  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (apiResponse?.data) {
      const mapped: Banner[] = apiResponse.data.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item?.description || '',
        position: 'top',
        status: item.status,
        backgroundColor: '#6366f1',
        textColor: '#ffffff',
        image: item?.image || '',
        linkType: item.type.toLowerCase(),
        linkTarget: item.object?._id || null,
        linkTargetName: item.object?.basicInfo?.title || item.object?.name || item.objectModel || '',
        order: item.order,
        type: item.type,
        objectModel: item.objectModel,
        object: item.object,
      }));
      setBanners(mapped);
    }
  }, [apiResponse]);

  // ------- MODAL CONTROL ------- //
  const openModal = useBoolean(false);
  const editModal = useBoolean(false);
  const deleteModal = useBoolean();

  // const closeModal = () => {
  //   openModal.onFalse();
  //   editModal.onFalse();
  //   setEditingBanner(null);
  // };

  const openCreateModal = () => {
    setEditingBanner(null);
    openModal.onTrue();
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    editModal.onTrue();
    openModal.onTrue();
  };

  // ------- DELETE BANNER ------- //
  const [deleteBanner, { isLoading: deleteLoading }] = useDeleteBannerControlMutation();

  const handleDelete = useCallback(
    (id: string) => {
      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  const onDelete = useCallback(async () => {
    if (!selectedId) return;

    try {
      const res = await deleteBanner(selectedId).unwrap();

      if (res?.error) {
        const errorMessage = getErrorMessage(res.error);
        showError(errorMessage);
        return;
      }

      showSuccess(res?.message || 'Banner deleted');
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSelectedId(null);
      deleteModal.onFalse();
    }
  }, [selectedId, deleteBanner, deleteModal]);

  const handleNavigate = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banner Manager</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Create and manage your banners</p>
        </div>
        <Button onClick={openCreateModal} className="bg-primary hover:bg-primary cursor-pointer rounded-3xl py-2 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Banner
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <BannerCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Banner Grid */}
      {!isLoading && banners.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.id} className="group dark:bg-secondary bg-white py-0 shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="relative h-48 bg-gray-100">
                    {banner?.image ? (
                      <Image
                        src={banner?.image}
                        alt={banner?.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">No Image</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 px-4 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        {banner?.type && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {banner?.type === 'LoyaltyProgram' ? 'Loyalty Program' : banner.type}
                          </Badge>
                        )}
                        <CustomBadge variant={banner?.status === 'active' ? 'success' : banner?.status === 'inactive' ? 'error' : 'default'}>
                          {banner?.status}
                        </CustomBadge>
                      </div>

                      <h4 className="font-semibold text-gray-900 capitalize dark:text-white">{banner?.title}</h4>

                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {banner?.description.length <= 50
                          ? capitalizeFirstLetter(banner?.description)
                          : capitalizeFirstLetter(banner?.description?.slice(0, 40) + '...')}
                      </p>

                      {banner?.type === 'Other' && banner?.object && (
                        <div onClick={() => handleNavigate(banner.object)} className="flex cursor-pointer items-center space-x-2 text-sm">
                          <ExternalLink className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">Link</span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(banner)} className="hover:bg-blue-50 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(banner.id)} className="hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && banners.length === 0 && (
        <EmptyState
          icon={Upload}
          title="No banners yet"
          description="Create your first banner to get started"
          actionLabel="Create Your First Banner"
          actionIcon={Plus}
          onAction={openCreateModal}
        />
      )}

      <BannerModalV2 open={openModal.value} onClose={openModal.onFalse} isEdit={editModal.value} selectedData={editingBanner} />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Banner"
        content="Are you sure you want to delete this banner?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default BannerControl;
