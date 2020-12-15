const graphql = require('graphql');
const _ = require('lodash');
const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

// dummy data
var books = [
    {name: 'Biochemistory', genre: 'Chemistry' , id: '1', authorId: '1', standardId: ['1']},
    {name: 'Greek History', genre: 'History' , id: '2', authorId: '2', standardId: ['7']},
    {name: 'Cadiac System', genre: 'Biology' , id: '3', authorId: '3', standardId: ['2','5']},
    {name: 'NCEA level 3 Mathematics', genre: 'Mathematics' , id: '4', standardId: '1', standardId: ['4','8']},
    {name: 'Introduction to Biology', genre: 'Biology' , id: '5', authorId: '2', standardId: ['2','5']},
    {name: 'Foundation of Clasical Physics', genre: 'Physics' , id: '6', authorId: '1', standardId: ['6']},
    {name: 'Introduction to Physiology', genre: 'Biology' , id: '7', authorId: '2', standardId: ['12','5']}
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1'},
    { name: 'Brandon Sanderson', age: 42, id: '2'},
    { name: 'Terry Pratcheet', age: 66, id: '3'}
];

var standards = [
    {name:"AS Chemistry 7003", qualification: 'CIE', id:'1'},
    {name:"AS Biology 7503", qualification: 'CIE', id:'2'},
    {name:"IGCSE Physics 5003", qualification: 'CIE', id:'3'},
    {name:"AS Maths 9100", qualification: 'CIE', id:'4'},
    {name:"NCEA level 2, Biology 5244", qualification: 'NCEA', id:'5'},
    {name:"NCEA level 2, Physics 5244", qualification: 'NCEA', id:'6'},
    {name:"NCEA level 1, History 5244", qualification: 'NCEA', id:'7'},
    {name:"NCEA level 3, Calculus 5244", qualification: 'NCEA', id:'8'}
]


// Schema setup
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, {id: parent.authorId})
            }
        },
        standard: {
            type: new GraphQLList(StandardType),
            resolve(parent, args){
                const criteria = parent.standardId
                const filtered = standards.filter((obj) => {
                    return criteria.indexOf(obj.id) >= 0;
                   });
                return filtered
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, { authorId: parent.id});
            }
        }
    })
})

const StandardType = new GraphQLObjectType({
    name: 'Standard',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        qualification: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, book.standardId.includes(parent.id));
                // return _.map(books, book => {
                //     book.standardId = _.filter(books, book.standardId.includes(parent.id));
                //     return book;
                // });

                return books.filter(book => book.standardId.includes(parent.id))
            }
        }
    })
})

// initiation of the graph query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book: {
            type: BookType,
            args:{ id:{ type: GraphQLID }},
            resolve(parent, args){
                // code to get data from db / other source
                return _.find(books, {id : args.id });
            }
        },
        author: {
            type: AuthorType,
            args: {id:{type: GraphQLID}},
            resolve(parent,args){
                return _.find(authors, {id: args.id});
            }
        },
        standard: {
            type: StandardType,
            args: {id:{type: GraphQLID}},
            resolve(parent,args){
                return _.find(standards, {id: args.id});
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return books;
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return authors;
            }
        },
        standards: {
            type: new GraphQLList(StandardType),
            resolve(parent,args){
                return standards;
            }
        },
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