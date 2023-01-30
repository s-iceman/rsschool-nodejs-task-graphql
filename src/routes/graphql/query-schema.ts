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


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: UserListType,
      resolve(post, args, context) {
        return context.db.users.findMany();
      }
    },
    profiles: {
      type: ProfileListType,
      resolve(post, args, context) {
        return context.db.profiles.findMany();
      }
    },
    posts: {
      type: PostListType,
      resolve(post, args, context) {
        return context.db.posts.findMany();
      }
    },
    memberTypes: {
      type: MemberListType,
      resolve(post, args, context) {
        return context.db.memberTypes.findMany();
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(post, args, context) {
        return context.db.users.findOne({key: 'id', equals: args.id});
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(post, args, context) {
        return context.db.posts.findOne({key: 'id', equals: args.id});
      }
    },
    profile: {
      type: ProfileType,
      args: { id: { type: GraphQLID } },
      resolve(post, args, context) {
        return context.db.profiles.findOne({key: 'id', equals: args.id});
      }
    },
    memberType: {
      type: MemberType,
      args: { id: { type: GraphQLID } },
      resolve(post, args, context) {
        return context.db.memberTypes.findOne({key: 'id', equals: args.id});
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