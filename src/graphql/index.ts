import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { User } from "./user";

async function createApolloGraphqlServer() {
  // Create a new ApolloServer instance
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
      },
      type Mutation {
        ${User.mutations}
      }
    `, // GraphQL Schema
    resolvers: {
      Query: {
        ...User.resolvers.queries
      },
      Mutation: {
        ...User.resolvers.mutations
      },
    }, // GraphQL Resolvers
  })
  await gqlServer.start()
  return gqlServer
}

export default createApolloGraphqlServer