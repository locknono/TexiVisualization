const mongoose =require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const pointSchema = new Schema([Number])
const borderLineSchema = new Schema({
 class: Number,
 path:{
     type:[[Number]],
 }
});

var borderLine = mongoose.model('borderLine', borderLineSchema);
module.exports = borderLine;

