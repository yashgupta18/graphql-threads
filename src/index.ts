import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';


async function init() {
  const app = express()
  const PORT = Number(process.env.PORT) || 8000
  app.use(express.json())
  // Create a new ApolloServer instance
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      },
      type Mutation {
        createUser(firstName:String!, lastName: String!, email: String!, password: String! ): Boolean
      }
    `, // GraphQL Schema
    resolvers: {
      Query: {
        hello: () => 'Hello World',
        say: (_, { name }) => `Hello ${name}`
      },
      Mutation: {
        createUser: async (_,
          {
            firstName,
            lastName,
            email,
            password
          }:{
              firstName: string,
              lastName: string,
              email: string,
              password: string
            }) => {
            await prismaClient.user.create({
              data: {
                firstName,
                lastName,
                email,
                password,
                salt: 'random_salt',
              }
            })
            return true
          }
      },
    }, // GraphQL Resolvers
  })

  await gqlServer.start()

  app.get('/', (req, res) => {
    res.json('Hello World')
  })

  // Apply the ApolloServer instance to the Express app
  app.use('/graphql', expressMiddleware(gqlServer))

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

init()