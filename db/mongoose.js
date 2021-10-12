const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("Connection to DB ...."))
    .catch((err) => console.log(`Connect to Db failed. Error: ${err}`));

module.exports = mongoose