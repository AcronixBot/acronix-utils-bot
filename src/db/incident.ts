import { Schema, model, Document } from 'mongoose';

export enum Status {
    INVESTIGATING = "Investigating",
    MONITORING = "Monitoring",
    UPDATE = "Update",
    RESOLVED = "Resolved"
}


let schema = new Schema({
    messageId: String,
    status: String, //string should one of status
    title: String,
    investigating: {
        default:null,
        type:Number
    },
    monitoring: {
        default:null,
        type:Number
    },
    update: {
        default:null,
        type:Number
    },
    resolved: {
        default:null,
        type:Number
    },

})


export default model('Incident', schema)
