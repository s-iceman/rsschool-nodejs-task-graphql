import { 
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt
} from 'graphql';


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
  }),
});

const ProfileListType = new GraphQLList(ProfileType);


const ExtendedUserType = new GraphQLObjectType({
  name: 'ExtendedUserType',
  fields: () => ({
    userData: { type: UserType },
    profiles: { type: ProfileListType },
    posts: { type: PostListType },
    memberTypes: { type: MemberListType }
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
  ExtendedUserType,
  UserListType,
  ProfileType,
  ProfileListType,
  PostType,
  PostListType,
  MemberType,
  MemberListType
}