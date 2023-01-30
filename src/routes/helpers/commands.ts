import { FastifyInstance } from 'fastify';
import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../utils/DB/entities/DBUsers';


const getUsers = async (fastify: FastifyInstance): Promise<UserEntity[]> => {
  return await fastify.db.users.findMany();
};

const getUserById = async (fastify: FastifyInstance, id: string): Promise<UserEntity> => {
  const res = await fastify.db.users.findOne({key: 'id', equals: id});
  if (!res) {
    throw fastify.httpErrors.notFound();
  }
  return res;
}

const getPosts = async (fastify: FastifyInstance): Promise<PostEntity[]> => {
  return await fastify.db.posts.findMany();
};

const getPostById = async (fastify: FastifyInstance, id: any): Promise<PostEntity> => {
  const res = await fastify.db.posts.findOne({key: 'id', equals: id});
  if (!res) {
    throw fastify.httpErrors.notFound();
  }
  return res;
};

const getProfiles = async (fastify: FastifyInstance): Promise<ProfileEntity[]> => {
  return await fastify.db.profiles.findMany();
};

const getProfileById = async (fastify: FastifyInstance, id: any): Promise<ProfileEntity> => {
  const res = await fastify.db.profiles.findOne({key: 'id', equals: id});
  if (!res) {
    throw fastify.httpErrors.notFound();
  }
  return res;
}

const getMemberTypes = async (fastify: FastifyInstance): Promise<MemberTypeEntity[]> => {
  return await fastify.db.memberTypes.findMany();
};

const getMemberTypeById = async (fastify: FastifyInstance, id: any): Promise<MemberTypeEntity> => {
  const res = await fastify.db.memberTypes.findOne({key: 'id', equals: id});
  if (!res) {
    throw fastify.httpErrors.notFound();
  }
  return res;
}

export {
  getUsers,
  getPosts,
  getProfiles,
  getMemberTypes,
  getUserById,
  getPostById,
  getProfileById,
  getMemberTypeById,
}
