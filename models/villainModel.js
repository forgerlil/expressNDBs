import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const villainSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },
  description: {
    type: String,
    required: true
  },
  personalDeadliness: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  influence: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  isRecovering: {
    type: Boolean,
    default: false
  },
  image: String
});

export default model('Villain', villainSchema);