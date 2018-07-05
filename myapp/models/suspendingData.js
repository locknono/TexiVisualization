const mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
const suspendingDataSchema = new Schema({
    class: Number,
    workOn:[Number],
    workOff:[Number],
    endOn:[Number],
    endOff:[Number]
},{ collection: 'clickData'});

var suspendingDataModel = mongoose.model('suspendingData', suspendingDataSchema);

module.exports = suspendingDataModel;