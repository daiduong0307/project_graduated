var mongoose = require("mongoose");

const requestTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true

    },
    description: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
});

const Topic = mongoose.model("RequestType", requestTypeSchema);

module.exports = Topic;
