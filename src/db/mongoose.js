const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL2,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false,
    useCreateIndex: true
}).then((result) => {
    console.log('Connected to database');
}).catch((err) => {
    console.log(err);
});

