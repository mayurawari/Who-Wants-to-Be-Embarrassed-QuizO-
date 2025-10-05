import { model, Schema } from "mongoose";

//Sample Data

// {
//     "id": 10,
//     "question": "What is H2O commonly known as?",
//     "options": ["Oxygen", "Hydrogen", "Water", "Carbon Dioxide"],
//     "correctOptionIndex": 2,
//     "hint": "It's essential for life and covers most of Earth's surface."
// }

const questionSchema = new Schema({
    id: {type: Number},
    question : {type:String,required:true},
    options : {type : [String],required:true},
    correctOptionIndex:{type:Number,required:true},
    hint:{type:String,required:true}
},{ collection: "Questions" })

const questionModel = model('Questions',questionSchema);

export default questionModel;