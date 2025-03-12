const express = require('express');
const request = require('request');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

//MongoDB connection
const connectDb = async() => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/', {
            dbName: 'myPortfolioDatabase',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to myPortfolioDatabase database successfully.');
    }

    catch(error){
        console.log(error);
        process.exit(1);
    }
}

connectDb();

const phoneSchema = new mongoose.Schema({
    phone: { type: String, required: true },
  });
  
  const PhoneNumber = mongoose.model("PhoneNumber", phoneSchema);

app.post('/api/register', async(req,res) => {
    try{
        const {phone} = req.body;

        if(!phone){
            return res.status(400).json({error: 'Phone number is required.'});
        }

        const existingPhone = await PhoneNumber.findOne({phone});
        if(existingPhone){
            return res.status(400).json({error: 'Artist already exists!'});
        }

        const newPhone = new PhoneNumber({phone});
        await newPhone.save();
        res.json({message: 'Phone number saved successfully'});
    }

    catch(error){
        res.status(500).json({error: 'Server error'});
    }
})

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});