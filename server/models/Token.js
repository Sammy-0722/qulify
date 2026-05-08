const mongoose = require('mongoose');
const tokenschema = new mongoose.Schema({
    tokenNo: Number,
    name: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: ""
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    status: {
        type: String,
        default: "Waiting"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    counter: String,
});