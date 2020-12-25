const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    title : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    price : {
        type : mongoose.Schema.Types.Number,
        required : true
    },
    brand : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    cpu : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    gpu : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    memory : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    storage : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    quantity : {
        type : mongoose.Schema.Types.Number,
        required : true
    },
    image : {
        type : mongoose.Schema.Types.Buffer
    }
});

module.exports = mongoose.model('Laptop',laptopSchema);