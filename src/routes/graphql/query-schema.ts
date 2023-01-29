import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { MemberListType, PostListType, ProfileListType, UserListType } from './types';


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
    }
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