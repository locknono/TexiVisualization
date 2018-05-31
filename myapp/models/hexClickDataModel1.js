const mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const hexClickDataSchema1 = new Schema({
    row: Number,
    col: Number,
    n:Number,
    con: [Number],
    off: [Number]
}, {
    collection: 'hexClickData1'
});

var hexClickDataModel1 = mongoose.model('hexClickData1', hexClickDataSchema1);

module.exports = hexClickDataModel1;