var mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    reason: {
        type: String,
        require: true,
        trim: true
    },
    startDateOff: {
        type: String,
        require: true
    },
    endDateOff: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: "Submitted",
        trim: true,
    },
    fileUpload: {
        type: String,
    },
    businessUnit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessUnit",
    },
    requestType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RequestType",
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    },
    comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
}, {
    timestamps: true
});

RequestSchema.virtual("staff", {
    ref: "Staff",
    localField: "_id",
    foreignField: "posts",
});

RequestSchema.virtual("amount_requests", {
    ref: "BusinessUnit",
    localField: "_id",
    foreignField: "amountRequest",
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
