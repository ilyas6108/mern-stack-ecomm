require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles:true
}));

app.use('/user',require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));

const URI = process.env.MONGODB_URL
mongoose.connect('mongodb://localhost:27017/react1',{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
},err =>{
    if(err) throw err;
    console.log('connected to Mongodb');
});

// app.get('/',(req, res)=>{
//     res.json({msg:'welcome'})
// });

if(process.env.NODE_ENV != 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'))
    })
}

const PORT = process.env.PORT ||5000
app.listen(PORT,()=>{
    console.log('server',PORT);
});