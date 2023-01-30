import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { 
  UserType, UserListType,
  MemberType, MemberListType,
  PostType, PostListType, 
  ProfileType, ProfileListType
} from './types';
import {
  getUsers, getPosts, getProfiles, getMemberTypes,
  getUserById, getPostById, getProfileById, getMemberTypeById
} from '../helpers/commands';


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: UserListType,
      resolve: async (post, args, context) => {
        return await getUsers(context);
      }
    },
    profiles: {
      type: ProfileListType,
      resolve: async (post, args, context) => {
        return await getProfiles(context);
      }
    },
    posts: {
      type: PostListType,
      resolve: async (post, args, context) => {
        return await getPosts(context);
      }
    },
    memberTypes: {
      type: MemberListType,
      resolve: async (post, args, context) => {
        return await getMemberTypes(context);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: async (post, args, context) => {
        try {
          return await getUserById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve: async (post, args, context) => {
        try {
          return await getPostById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
    profile: {
      type: ProfileType,
      args: { id: { type: GraphQLID } },
      resolve: async (post, args, context) => {
        try {
          return await getProfileById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
    memberType: {
      type: MemberType,
      args: { id: { type: GraphQLID } },
      resolve: async (post, args, context) => {
        try {
          return await getMemberTypeById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
  }
});

class Schema extends GraphQLSchema {
  constructor() {
    super({
      query: Query,
    });
  }
};


export {
  Schema
}