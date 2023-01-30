import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { 
  UserType, UserListType,
  MemberType, MemberListType,
  PostType, PostListType, 
  ProfileType, ProfileListType, FullUserType
} from './types';
import {
  getUsers, getPosts, getProfiles, getMemberTypes,
  getUserById, getPostById, getProfileById, getMemberTypeById,
  getUserInfoById
} from '../helpers/commands';


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getUsers: {
      type: UserListType,
      resolve: async (obj, args, context) => {
        return await getUsers(context);
      }
    },
    getProfiles: {
      type: ProfileListType,
      resolve: async (obj, args, context) => {
        return await getProfiles(context);
      }
    },
    getPosts: {
      type: PostListType,
      resolve: async (obj, args, context) => {
        return await getPosts(context);
      }
    },
    getMemberTypes: {
      type: MemberListType,
      resolve: async (obj, args, context) => {
        return await getMemberTypes(context);
      }
    },
    getUserById: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: async (obj, args, context) => {
        try {
          return await getUserById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
    getPostById: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve: async (obj, args, context) => {
        try {
          return await getPostById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
    getProfileById: {
      type: ProfileType,
      args: { id: { type: GraphQLID } },
      resolve: async (obj, args, context) => {
        try {
          return await getProfileById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
    getMemberTypeById: {
      type: MemberType,
      args: { id: { type: GraphQLID } },
      resolve: async (obj, args, context) => {
        try {
          return await getMemberTypeById(context, args.id);
        } catch (err) {
          return null;
        }
      }
    },
    getAllUsersInfo: {
      type: new GraphQLList(FullUserType),
      resolve: async (obj, args, context) => {
        const users = await getUsers(context);
        const res: any = [];
        for (const user of users) {
          res.push(await getUserInfoById(context, user.id));
        }
        return res;
      }
    },
    getAllUserInfoById: {
      type: FullUserType,
      args: { id: { type: GraphQLID } },
      resolve: async (obj, args, context) => {
        const id = args.id;
        return await getUserInfoById(context, id);
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