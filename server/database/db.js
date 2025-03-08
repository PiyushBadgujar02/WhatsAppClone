const mongoose = require('mongoose')

const dotenv = require('dotenv')


dotenv.config();

const user=process.env.DB_USER
const pass=process.env.DB_PASS

const connection = async ()=>{
    const url = `mongodb+srv://${user}:${pass}@clone-whatsapp.erbeh.mongodb.net/?retryWrites=true&w=majority&appName=clone-whatsapp`
    
    try {
        await mongoose.connect(url)
        console.log('connected successfully')
    } catch (error) {
        console.log('Error: ', error.message);
    }
}
module.exports=connection;
