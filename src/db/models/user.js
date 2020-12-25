const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email : {
        type : mongoose.Schema.Types.String,
        required : true,
        unique: true,
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password : {
        type : mongoose.Schema.Types.String,
        required : true
    }
});

module.exports = mongoose.model('User', userSchema);