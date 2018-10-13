const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
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
    // We treat associations between types (companies and users in this instance)
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
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(({data}) => data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  // The fields of a mutation describe what the mutation will do
  fields: {
    addUser: {
      // The type refers to the type of data that resolve function will eventually return.
      // Sometimes a collection of data you're operating on and the type you return might not be the same.
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve (parentValue, { firstName, age }) {
        console.log(arguments[1]);
        return axios.post('http://localhost:3000/users', { firstName, age })
          .then(({ data }) => data);
      }
    },
    deleteUser: {
      // We always have to say we will get something back.
      // Even though in this instance nothing will be returned because JSON server doesn't allow for that.
      // There is no way to tell graphQl to nor expect anything back.
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(({data}) => data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      // Since graphQL will only add the keys if they are present in the args object the user provides 
      resolve (parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(({data}) => data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});


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
//   },
//   if we want to have two company queries we can name them:
//   apple: company(id: "1") {
//     name,
//     description
//   },
//     google: company(id: "2") {
//     name,
//     description
//   }
// }

// to avoid repeating the fields in the repeated companies.
// We can wrte a fragment.
// By adding the on {name} it allows graphQL to type check and make sure
// that we're trying to pull out.

// query {
//   apple: company(id: "1") {
//     ...companyDetails
//   }
//   google: company(id: "2") {
//     ...companyDetails
//   }
// }

// fragment companyDetails on Company {
//   id
//   name
//   description
// }

// // We must ask for some properties for what's returned from the resolve function.
// mutation {
//   addUser(firstName: "Steven", age: 26) {
//     id,
//     age,
//     firstName
//   }
// }