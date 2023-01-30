import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { validateUuid } from '../helpers/validators';
import { getProfiles, getProfileById, getUserById, getMemberTypeById } from '../helpers/commands';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await getProfiles(fastify);
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
      return await getProfileById(fastify, id);
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
        (await fastify.db.profiles.findOne({key: 'userId', equals: id}))
      ) {
        throw fastify.httpErrors.badRequest();
      }

      try {
        await getUserById(fastify, id);
        await getMemberTypeById(fastify, memberTypeId);
      } catch (err) {
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
      if (!id || typeof id !== 'string') {
        throw fastify.httpErrors.badRequest();
      }

      try {
        await getProfileById(fastify, id);
      } catch (err) {
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
      if (!id || typeof id !== 'string') {
        throw fastify.httpErrors.badRequest();
      }

      try {
        await getProfileById(fastify, id);
      } catch (err) {
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
