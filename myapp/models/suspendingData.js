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

const hexClickDataSchema = new Schema({
    row: Number,
    col:Number,
    on:[Number],
    off:[Number]    
},{ collection: 'hexClickData'});

var suspendingDataModel = mongoose.model('suspendingData', suspendingDataSchema);

var hexClickDataModel = mongoose.model('hexClickData', hexClickDataSchema);

module.exports = hexClickDataModel;
module.exports = suspendingDataModel;