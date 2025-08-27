'use client';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import CreateVenueModal from '@/components/modals/CreateVenueModal';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import VenueTable from '@/sections/venue-old/venueTable';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface VenueData {
  name: string;
  venueType: string;
  organization: string;
  location: string;
  city: string;
  country: string;
}

const VenueList = () => {
  const openModal = useBoolean();
  const deleteModal = useBoolean();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<VenueData | null>(null);

  const handleEdit = (id: string) => {
    console.log('id', id);
    setEditData({
      name: 'Sample Venue',
      venueType: 'event1',
      organization: 'org-a',
      location: 'Sample Location',
      city: 'Sample City',
      country: 'Sample Country',
    });
    setIsEdit(true);
    openModal.onTrue();
  };

  const handleDelete = (id: string) => {
    console.log('id', id);
    deleteModal.onTrue();
  };

  const onDelete = () => {
    deleteModal.onFalse();
  };

  const handleCloseModal = () => {
    setIsEdit(false);
    setEditData(null);
    openModal.onFalse();
  };

  return (
    <div>
      <div className="flex w-full items-center justify-end">
        <Button
          onClick={openModal.onTrue}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
        >
          <Plus className="" />
          Create Venue
        </Button>
      </div>

      {/* ------------- VENUE TABLE ------------- */}
      <VenueTable handleDelete={handleDelete} handleEdit={handleEdit} />

      <CreateVenueModal
        open={openModal.value}
        onClose={handleCloseModal}
        isEdit={isEdit}
        editData={editData}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Venue"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default VenueList;
