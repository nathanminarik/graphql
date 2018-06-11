const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

const UserType = new GraphQLObjectType({
  // name property is required and will always be a string describing the Type we are defining
  // Almost always what the Type is named e.g. UserType = 'User'
  name: 'User',
  // Fields is the second required property. It is an object that tells graphql about the different properties that a type has
  // They keys equal the properties
  fields: {
    id: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    } 
  }
});

// The root query is an entry point into our data for graphql
// It is needed to tell graphql about our graph
// It allows graphql toi jump and land on a node in our graph.
const RootQuery = new GraphQLObjectType ({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      // Arguments required for the root query (in this case the user)
      args: {
        id: {
          type: GraphQLString
        }
      },
      // Resolve function tries to find the user in the database and find the actual data.
      // Everything else in the file tells us what our data looks like. 
      // Resolve actually goes and gets it.
      // Parent value is very rarely used.
      // Args are what we declare just above.
      resolve (parentValue, args) {

      }
    }
  }
});