import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { validateUuid } from '../validators';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get(
    '/',
    async function (request, reply): Promise<UserEntity[]> {
      return await fastify.db.users.findMany();
    }
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;
      if (!userId) {
        throw fastify.httpErrors.badRequest();
      }
      const res = await fastify.db.users.findOne({key: 'id', equals: userId});
      if (!res) {
        throw fastify.httpErrors.notFound();
      }
      return res;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
      return await fastify.db.users.create(request.body);
      } catch (err) {
        throw fastify.httpErrors.notFound;
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      if (!validateUuid(id)) {
        throw fastify.httpErrors.badRequest();
      }
      try {
        const posts = await fastify.db.posts.findMany({key: 'userId', equals: id});
        for (const post of posts) {
          await fastify.db.posts.delete(post.id);
        }

        const profile = await fastify.db.profiles.findOne({key: 'userId', equals: id});
        if (profile) {
          await fastify.db.profiles.delete(profile.id);
        }

        const users = await fastify.db.users.findMany();
        for (const user of users) {
          if (user.subscribedToUserIds.length > 0) {
            const idx = user.subscribedToUserIds.indexOf(id);
            if (idx !== -1) {
              user.subscribedToUserIds.splice(idx, 1);
              await fastify.db.users.change(user.id, {subscribedToUserIds: user.subscribedToUserIds});
            }
          }
        }

        return await fastify.db.users.delete(id);
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      const userId = request.body.userId;
      if (!validateUuid(id) || !validateUuid(userId)) {
        throw fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({key: 'id', equals: userId});
      const subscribers = user?.subscribedToUserIds || [];
      try {
        subscribers.push(id);

        return await fastify.db.users.change(userId, {subscribedToUserIds: subscribers});
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      const userId = request.body.userId;
      if (!validateUuid(id) || !validateUuid(userId)) {
        throw fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({key: 'id', equals: userId});
      const subscribers = user?.subscribedToUserIds || [];
      const idx = subscribers.indexOf(id);
      if (idx === -1) {
        throw fastify.httpErrors.badRequest();
      }
      subscribers.splice(idx, 1);
      try {
        return await fastify.db.users.change(userId, {subscribedToUserIds: subscribers});
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      if (!validateUuid(id)) {
        throw fastify.httpErrors.badRequest();
      }
      try {
        return await fastify.db.users.change(id, request.body);
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );
};

export default plugin;