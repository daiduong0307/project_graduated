const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "RoleUser",
    },
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Message", messageSchema);