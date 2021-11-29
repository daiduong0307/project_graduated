var mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({

    comment: {
        type: String,
        require: true,
        trim: true
    },
    manager_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Articles",
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;