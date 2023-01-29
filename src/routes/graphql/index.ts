import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { Schema } from './query-schema';
import { graphql } from 'graphql';
import { patchData } from './example-data';

const schema = new Schema();
let flag = false;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      if (!flag) {
        await patchData(fastify.db);
        flag = true;
      }
      
      const res = await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
      });
      console.log(`Result: ${JSON.stringify(res)}`);
      reply.send(res);
    }
  );
};

export default plugin;
