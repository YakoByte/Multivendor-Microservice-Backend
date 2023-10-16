const express = require('express');
const { PORT } = require('./config');
const gateway = require('./gateway');

const StartServer = async () => {
  const app = express();

  app.get('/', (req, res) => {
    res.status(200).send({ message: "Microservices called........" });
  });

  // Use the reverse proxy server defined in the gateway module
  app.use('/user', gateway.user);
  app.use('/product', gateway.product);
  app.use('/order', gateway.order);
  app.use('/transaction', gateway.transaction);
  app.use('/support', gateway.support);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  }).on('error', (err) => {
    console.log(err);
    process.exit(1);
  });
}

StartServer();