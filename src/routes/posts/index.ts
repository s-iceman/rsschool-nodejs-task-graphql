import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { validateUuid } from '../helpers/validators';
import { getPosts, getPostById, getUserById } from '../helpers/commands';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return await getPosts(fastify);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const id = request.params.id;
      if (!id) {
        throw fastify.httpErrors.badRequest();
      }
      return await getPostById(fastify, id);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const userId = request.body.userId;
      const title = request.body.title;
      const content = request.body.content;
      if (!userId || !title || !content || typeof title !== 'string' || typeof content !== 'string') {
        throw fastify.httpErrors.badRequest();
      }

      try {
        await getUserById(fastify, userId);
      } catch (err) {
        throw fastify.httpErrors.badRequest();
      }

      const res = await fastify.db.posts.create({title, content, userId});
      if (!res) {
        throw fastify.httpErrors.notFound();
      }
      return res;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const id = request.params.id;
      if (!validateUuid(id)) {
        throw fastify.httpErrors.badRequest();
      }

      try {
        await getPostById(fastify, id);
      } catch (err) {
        throw fastify.httpErrors.badRequest();
      }

      try {
        return await fastify.db.posts.delete(id);
      } catch (err) {
        throw fastify.httpErrors.notFound();
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const id = request.params.id;
      if (!id || typeof id !== 'string') {
        throw fastify.httpErrors.badRequest();
      }

      try {
        await getPostById(fastify, id);
      } catch (err) {
        throw fastify.httpErrors.badRequest();
      }

      const res = await fastify.db.posts.change(id, request.body);
      if (!res) {
        throw fastify.httpErrors.notFound();
      }
      return res;
    }
  );
};

export default plugin;