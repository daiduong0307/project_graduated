const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://admin:admin@finalproject.ydqzwpc.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("Connection to DB ...."))
    .catch((err) => console.log(`Connect to Db failed. Error: ${err}`));

module.exports = mongoose