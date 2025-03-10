const express = require('express');
const User = require('../model/User');
const Conversation = require('../model/Conversation');
const Message = require('../model/Message');
const multer = require('multer');
const grid = require('gridfs-stream')

const { GridFsStorage } = require('multer-gridfs-storage')

const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');


dotenv.config();

const user=process.env.DB_USER
const pass=process.env.DB_PASS


// kha store krvana h


const storage = new GridFsStorage({
    url: `mongodb+srv://${user}:${pass}@clone-whatsapp.erbeh.mongodb.net/?retryWrites=true&w=majority&appName=clone-whatsapp`,
    options: { useNewUrlParser: true },
    file: (request, file) =>{
        const match = ["image/png", "image/jpg"];

        if(match.indexOf(file.memeType) === -1) 
            return`${Date.now()}-blog-${file.originalname}`;

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        }
    }
});

const upload = multer({storage:storage})



let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
});

const router = express.Router();

router.post('/add',async (req,res)=>{
    try{
        let exist = await User.findOne({sub:req.body.sub})
        if(exist){
            res.status(200).json({ "error": "User already exists"});
            return;
        }   
        const newUser = new User(req.body)
        await newUser.save();
        res.status(200).json(req.body);
    }
    catch(error){
        res.status(500).json(error.message);
    }
    })

router.get('/users',async (req,res)=>{
        try{
            let allusers = await User.find({})
            res.status(200).json(allusers);
        }
        catch(error){
            res.status(500).json(error.message);
        }
        })

router.post('/conversation/add',async (req,res)=>{
    try{
        let senderId = req.body.senderId;
        let receiverId = req.body.receiverId;   
        const exist = await Conversation.findOne({members:{$all:[receiverId,senderId]}})
        if(exist){
            res.status(200).json('Conversations alread exists');
            return;
        }
        const newconversations = new Conversation({
            members:[receiverId,senderId]
        })
        await newconversations.save();
        res.status(200).json('New Conversations generated');

    }
    catch(error){
        res.status(500).json(error.message);
    }
})


router.post('/conversation/get',async (req,res)=>{
    try{
        let senderId = req.body.senderId;
        let receiverId = req.body.receiverId;   
        const Conversations = await Conversation.findOne({members:{$all:[receiverId,senderId]}})
        return res.status(200).json(Conversations)

    }
    catch(error){
        res.status(500).json(error.message);
    }
})
        
      

router.post('/message/add',async (req,res)=>{
    try{
        const newMessage = new Message(req.body);
        await newMessage.save()
        await Conversation.findByIdAndUpdate(req.body.conversationId, { message: req.body.text });

        res.status(200).json('Message save sucessfully');

    }
    catch(error){
        res.status(500).json(error.message);
    }
})


router.get('/message/get/:id',async (req,res)=>{
    try{
        const messages = await Message.find({conversationId:req.params.id})
        res.status(200).json(messages)
        return;
    }
    catch(error){
        res.status(500).json(error.message);
    }
})


router.post('/file/upload',upload.single('file'),async (req,res)=>{
    try{
        
        if(!req.file){
            return res.status(400).json('file not found ');
        }

        // const imgurl=`http://localhost:8080/files/${req.file.filename}`;
        const imgurl=`https://whats-app-clone-psi-roan.vercel.app/files/${req.file.filename}`;

        
    
        return res.status(200).json(imgurl);
    }catch(error){
        console.log(error)
        res.status(500).json(error.message);
    }
})



router.get('/files/:filename',async (req,res)=>{
    try{
        const file = await gfs.files.findOne({filename:req.params.filename})
        const readstream = gridfsBucket.openDownloadStream(file._id);
        readstream.pipe(res);
    }catch(error){
        res.status(500).json(error.message);
    }
})
module.exports = router