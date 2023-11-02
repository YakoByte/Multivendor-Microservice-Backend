const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');

const StartServer = async() => {
    const app = express();

    await databaseConnection();
    await expressApp(app);
    
    app.get('/', (req,res) => {
        res.status(200).send({message: "Order microservices called........"})
    })


    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();