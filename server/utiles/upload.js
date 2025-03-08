
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')

const dotenv = require('dotenv')


dotenv.config();

const user=process.env.DB_USER
const pass=process.env.DB_PASS


// kha store krvana h
const url = 'mongodb://yourhost:27017/database';


// const storage = new GridFsStorage({
//     url:`mongodb+srv://${user}:${pass}@clone-whatsapp.erbeh.mongodb.net/?retryWrites=true&w=majority&appName=clone-whatsapp`,
//     options:{useUnifiedTopology:true,useNewUrlParser:true},
//     file: (req, file) => {
//         const match = ['image/jpeg','image/jpg','image/png'];
//         if(match.indexOf(file.mimetype)===-1){
//             return `${Date.now()}-file-${file.originalname}`
//         }
//         return {
//             bucketName: 'photos',
//             filename: `${Date.now()}-file-${file.originalname}`
//           };
//       }
// })


const storage = new GridFsStorage({
    url: `mongodb+srv://${user}:${pass}@clone-whatsapp.erbeh.mongodb.net/?retryWrites=true&w=majority&appName=clone-whatsapp`,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpg"];

        if(match.indexOf(file.memeType) === -1) 
            return`${Date.now()}-blog-${file.originalname}`;

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        }
    }
});
// export default multer({storage});

let upload = multer({ storage: storage,file:storage.file})
module.exports = upload