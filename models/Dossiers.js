const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating  a Dozzier Schema
const DossierSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    details:{
        type:String,
        required: true
    },
    user:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('dossiers',DossierSchema);