import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { getMemberTypes, getMemberTypeById } from '../helpers/commands';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<MemberTypeEntity[]> {
    return await getMemberTypes(fastify);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const id = request.params.id;
      if (!id) {
        throw fastify.httpErrors.badRequest();
      }
      return await getMemberTypeById(fastify, id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const id = request.params.id;
      if (!id || typeof id !== 'string') {
        throw fastify.httpErrors.badRequest();
      }

      try {
        await getMemberTypeById(fastify, id);
      } catch (err) {
        throw fastify.httpErrors.badRequest();
      }

      try {
        return await fastify.db.memberTypes.change(id, request.body);
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );
};

export default plugin;
