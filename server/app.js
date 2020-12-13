const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = requlre('./schema/schema');

const app = express();

// middleware
app.use('/graphql', graphqlHTTP({
    schema
}));

app.listen(4000,() => {
    console.log('listening for requests on port 4000...')
});