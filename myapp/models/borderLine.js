const mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const pointSchema = new Schema([Number])
const borderLineSchema = new Schema({
    class: Number,
    path: [
        [Number,Number]
    ]
},{ collection: 'borderLine'});

var borderLineModel = mongoose.model('borderLine', borderLineSchema);
module.exports = borderLineModel;