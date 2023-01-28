import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { validateUuid } from '../validators';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.params.id;
      const res = await fastify.db.profiles.findOne({key: 'id', equals: id});
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
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.body.userId;
      const memberTypeId = request.body.memberTypeId;
      if (
        !validateUuid(id) || 
        !(await fastify.db.users.findOne({key: 'id', equals: id})) ||
        !(await fastify.db.memberTypes.findOne({key: 'id', equals: memberTypeId})) ||
        (await fastify.db.profiles.findOne({key: 'userId', equals: id}))
      ) {
        throw fastify.httpErrors.badRequest();
      }
      try {
        return await fastify.db.profiles.create(request.body);
      } catch (err) {
        throw fastify.httpErrors.notFound();
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
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.params.id;
      if (
        !id || typeof id !== 'string' ||
        !(await fastify.db.profiles.findOne({key: 'id', equals: id}))
      ) {
        throw fastify.httpErrors.badRequest();
      }
      try {
        return await fastify.db.profiles.delete(id);
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.params.id;
      if (
        !id || typeof id !== 'string' ||
        !(await fastify.db.profiles.findOne({key: 'id', equals: id}))
      ) {
        throw fastify.httpErrors.badRequest();
      }
      try {
        return await fastify.db.profiles.change(id, request.body);
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );
};

export default plugin;
