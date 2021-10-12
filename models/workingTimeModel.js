var mongoose = require("mongoose");

const dateWorkingSchema = new mongoose.Schema({
    date: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    request_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request",
        },
    ],
    staff_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        },
    ],
    requestType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RequestType",
    }
},
    {
        timestamps: true
    });

const DateWorking = mongoose.model("DateWorking", dateWorkingSchema);

module.exports = DateWorking;
