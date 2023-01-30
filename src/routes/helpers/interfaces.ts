import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../utils/DB/entities/DBUsers';


interface ExtendedUser {
  userData: UserEntity;
  profiles: ProfileEntity[];
  posts: PostEntity[];
  memberTypes: MemberTypeEntity[];
  userSubscribedTo: UserEntity[];
};

export {
  ExtendedUser
}