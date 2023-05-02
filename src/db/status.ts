import { Schema, model } from 'mongoose';

let schema = new Schema({
    guildID:{
        default:null,
        type:String
    },
    messageID:{
        default:null,
        type:String
    },
})


export default model('BotStatus', schema)
