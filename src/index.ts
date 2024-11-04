import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';


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
      }
    `, // GraphQL Schema
    resolvers: {
      Query: {
        hello: () => 'Hello World',
        say: (_, { name }) => `Hello ${name}`
      }
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