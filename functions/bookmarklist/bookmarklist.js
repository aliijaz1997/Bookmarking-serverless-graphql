const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;
const typeDefs = gql`
  type Query {
    BookMarkList: [BookMarkDetails!]
    }
  type BookMarkDetails {
    id: ID!
    url: String!
    bookmarkname : String!
  }
  type Mutation {
    addNewBookmark(bookmarkname: String!, url: String!): BookMarkDetails
  }
`

const resolvers = {
  Query: {
    BookMarkList: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET});
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("bookmark"))),
            q.Lambda(x => q.Get(x))
          )
        );
        console.log(result)
        return result.data.map(bookmark => {
          return {
          id : bookmark.ts,
          url : bookmark.data.url,
          bookmarkname : bookmark.data.bookmarkname
          }
        })
      } catch (error) {
        console.log(`Error is ${error}` );
      }
    }
  },
  Mutation: {
    addNewBookmark: async (_, {bookmarkname, url}) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        var result = await client.query(
          q.Create(
            q.Collection('bookmarkcollection'),
            { data : {
              url,
              bookmarkname
            } },
          )
        );
        console.log(result.ref.data)
        return result.ref.data;
      } catch (error) {
        console.log(`Error is ${error}` );
      }
    }
  }
  
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
