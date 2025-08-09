'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { UserTable } from '@/sections/users';
import { Plus } from 'lucide-react';
import UserModal from './UserModal';

const UserListView = ({ usertype }: { usertype: any }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  const CloseModal = () => {
    openModal.onFalse();
    editModal.onFalse();
  };

  const handleEdit = (id: string) => {
    console.log('id', id);
    openModal.onTrue();
    editModal.onTrue();
  };

  const handleDelete = (id: string) => {
    console.log('id', id);
    deleteModal.onTrue();
  };

  const onDelete = () => {
    deleteModal.onFalse();
  };

  return (
    <div>
      <div>
        <div className="flex w-full items-center justify-end">
          <Button
            className="cursor-pointer rounded-4xl bg-blue-700 py-2 text-white hover:bg-blue-800"
            onClick={openModal.onTrue}
          >
            <Plus />
            Create User
          </Button>
        </div>
      </div>

      <UserTable
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        pendingUser={false}
        userType={usertype}
      />

      <UserModal
        open={openModal.value}
        isEdit={editModal.value}
        onClose={CloseModal}
        onSubmit={onSubmit}
        userType={usertype}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete User"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default UserListView;
