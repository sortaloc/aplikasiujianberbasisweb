const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLScalarType
} = require('graphql');

const daftarUser = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id_user : { type: GraphQLInt },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    id_juser: { type: GraphQLInt },
    nm_juser: { type: GraphQLString },
    status_user : { type: GraphQLInt }
  })
});
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: new GraphQLList(daftarUser),
      resolve(parentValue, args) {
        return db('lap_user').select()
      }
    },
    getUser: {
      type: new GraphQLList(daftarUser),
      args : {
          id : {
              type : GraphQLString
          }
      },
      resolve(parentValue, args) {
        return db('lap_user').select().where('id_user',args.id)
      }
    },
    cekUser: {
      type: new GraphQLList(daftarUser),
      args : {
          username : {type : GraphQLString},
          password : {type : GraphQLString}
      },
      resolve(parentValue, args) {
        return db('lap_user')
            .select()
            .where({username : args.username,password : args.password})
      }
    },
  }
});
module.exports = new GraphQLSchema({
  query: RootQuery,
});
