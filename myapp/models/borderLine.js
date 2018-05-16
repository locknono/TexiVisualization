const mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const pointSchema = new Schema([Number])
const borderLineSchema = new Schema({
    _id: ObjectId,
    class: Number,
    path: [
        [Number]
    ]
});

var borderLineModel = mongoose.model('borderLine', borderLineSchema);
module.exports = borderLineModel;