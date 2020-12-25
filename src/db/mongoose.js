const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Data',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false,
    useCreateIndex: true
}).then((result) => {
    console.log('Connected to database');
}).catch((err) => {
    console.log(err);
});

