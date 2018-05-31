const mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const hexClickDataSchema0 = new Schema({
    row: Number,
    col: Number,
    n:Number,
    con: [Number],
    off: [Number]
}, {
    collection: 'hexClickData0'
});

var hexClickDataModel0 = mongoose.model('hexClickData0', hexClickDataSchema0);

module.exports = hexClickDataModel0;