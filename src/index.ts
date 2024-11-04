import express from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql'

async function init() {
  const app = express()
  const PORT = Number(process.env.PORT) || 8000
  app.use(express.json())

  app.get('/',  (req, res) => {
    res.json('Hello World')
  })

  const gqlServer = await createApolloGraphqlServer()
  // Apply the ApolloServer instance to the Express app
  app.use('/graphql', expressMiddleware(gqlServer))

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

init()