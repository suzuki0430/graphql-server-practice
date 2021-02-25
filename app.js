const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');

const cors = require('cors');

const app = express();

mongoose.connect(
  '', //接続コード
  { useNewUrlParser: true }
);
mongoose.connection.once('open', () => {
  console.log('we are connected.');
});

app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

app.listen(4000, () => {
  console.log('Listening for requests on my awesome port 4000');
});
