const graphql = require('graphql');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// dummy data
var books = [
    {name: 'Name of the Wind', genre: 'Fantasy' , id: '1'},
    {name: 'The final Empire', genre: 'Fantasy' , id: '2'},
    {name: 'The Long Earth', genre: 'Sci-Fi' , id: '3'}
];


// Schema setup
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
    })
})

// initiation of the graph query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book: {
            type: BookType,
            args:{ id:{ type: GraphQLString }},
            resolve(parent, args){
                // code to get data from db / other source

            }
        }
    }
})


//
// book(id: '18239'){
//     name
//     genre
// }


module.exports = new GraphQLSchema({
    query: RootQuery
})