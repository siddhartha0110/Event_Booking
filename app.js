const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-vpwls.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MONGO CONNECTION SUCCESSFULL"))
    .catch(err => console.log(err));

//GraphQL doesn't use different routes like REST API
//Instead it exposes all the required queries to Frontend
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});