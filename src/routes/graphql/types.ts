import { 
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt
} from 'graphql';
import { getMemberTypeById, getPostsByUserId, getProfileByUserId } from '../helpers/commands';


const SubscribersType = new GraphQLList(GraphQLString);

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString }!,
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: SubscribersType },
  }),
});

const UserListType = new GraphQLList(UserType);

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeInfo: {
      type: MemberType,
      resolve: async (obj, args, context) => {
        return await getMemberTypeById(context, obj.memberTypeId);
      } 
    }
  }),
});

const ProfileListType = new GraphQLList(ProfileType);


const FullUserType: any = new GraphQLObjectType({
  name: 'FullUserType',
  fields: () => ({
    userData: { type: UserType },
    profiles: {
      type: ProfileListType,
      resolve: async (obj, args, context) => {
        return await getProfileByUserId(context, obj.userData.id);
      }
    },
    posts: {
      type: PostListType,
      resolve: async (obj, args, context) => {
        return await getPostsByUserId(context, obj.userData.id);
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (obj, args, context) => {
        return obj.userSubscribedTo;
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (obj, args, context) => {
        return obj.subscribedToUser;
      }
    }
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString }
  })
});

const PostListType = new GraphQLList(PostType);

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    monthPostsLimit: {type: GraphQLInt},
  })
});

const MemberListType = new GraphQLList(MemberType);

export {
  UserType,
  UserListType,
  ProfileType,
  ProfileListType,
  PostType,
  PostListType,
  MemberType,
  MemberListType,
  FullUserType
}