const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

// The order of definition is important. 
// We must have the company type above the user type
// To avoid this we will take advantage of closures and convert the field objects to a function.
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // To avoid a circular reference of type association (user and company reference each other)
  // We convert the fields object to a function that returns an object.
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      // Since we want all the users we need to tell graphQl that we want a list.
      type: new GraphQLList(UserType),
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(({ data }) => data);
      }
    }
  })
});


const UserType = new GraphQLObjectType({
  // name property is required and will always be a string describing the Type we are defining
  // Almost always what the Type is named e.g. UserType = 'User'
  name: 'User',
  // Fields is the second required property. It is an object that tells graphql about the different properties that a type has
  // They keys equal the properties
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // We treat assotiations between types (companies and users in this instance)
    // the exact same way as if it were another field
    // Company is different from the user object since we have companyId as the field in the actual data
    // We therefore need to use the resolve function to populate the data.
    company: {
      type: CompanyType,
      resolve (parentValue, args) {
        // parentValue is the user returned which we can use to get the company id off the object for the query.
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(({ data }) => data);
      }
    }
  })
});

// The root query is an entry point into our data for graphql
// It is needed to tell graphql about our graph
// It allows graphql toi jump and land on a node in our graph.
const RootQuery = new GraphQLObjectType ({
  name: 'RootQueryType',
  // The fields property for root query references the node that we want to jump to
  // and the type of that field.

  // The fields also allow us to directly reference a type.
  // So if we want to directly access a company, we also need a company field.
  fields: {
    user: {
      type: UserType,
      // Arguments required for the root query (in this case the id of the user)
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
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(({data}) => data);
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(({data}) => data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
})


// Sample query
// We can name a query with the keyword query {name}, i.e.
// query fetchCompany {
//   company(id: "1") {
//     name,
//     description,
//     users {
//       firstName,
//       age,
//       company {
//         description
//       }
//     }
//   }
// }