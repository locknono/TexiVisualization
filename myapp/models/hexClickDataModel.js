const mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const hexClickDataSchema = new Schema({
    row: Number,
    col: Number,
    con: [Number],
    off: [Number]
}, {
    collection: 'hexClickData'
});

var hexClickDataModel = mongoose.model('hexClickData', hexClickDataSchema);

module.exports = hexClickDataModel;