import Blogs from '../components/Blogs';
import { UserType } from '../types/UserTypes';

const UserBlogsTab = ({ user }: { user: UserType }) => {
  return (
    <Blogs isUser={true} />
  );
};

export default UserBlogsTab;
