import EventList from '../event/event-list';

const UserEvents = ({ organizationData }: any) => {
  return (
    <>
      <EventList userType="super-admin" organization={organizationData?._id} />
    </>
  );
};

export default UserEvents;
