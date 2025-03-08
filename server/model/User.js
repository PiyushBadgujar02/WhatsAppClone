const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    iss:{
        type:String
    },
    azp:{
        type:String
    },
    aud:{
        type:String
    },
    sub:{
        type:String,
        required: true
    },
    email:{
        type:String
    },
    email_verified:{
        type:Boolean
    },
    nbf:{
        type:Number
    },
    name:{
        type:String,
        required: true
    },
    picture:{
        type:String
    },
    given_name:{
        type:String
    },
    family_name:{
        type:String
    },
    iat:{
        type:Number
    },
    exp:{
        type:Number
    },
    jti:{
        type:String
    }

    
})
module.exports = mongoose.model('user',userSchema);