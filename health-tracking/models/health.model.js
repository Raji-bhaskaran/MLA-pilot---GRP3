const mongoose = require('mongoose');
const { Schema } = mongoose;

const healthSchema = new Schema(
  {
    username: { type: String, required: true },
    tiredness: {
      type: String,
      required: true,
      enum: ['Very tired', 'Tired', 'Okay', 'Pretty good', 'Feeling great']
    },
    stress: {
        type: String,
        required: true,
        enum: ['Very stressed', 'Stressed', 'Okay', 'Pretty good', 'Feeling great']
      },
    weight: { 
      type: Number, 
      required: true,
      validate: {
          validator: function(value) {
              return !isNaN(value);
          },
          message: 'Weight should be a number.'
        },
      min: [0, 'Weight should be positive or zero.']
    },
    height: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(value);
            },
            message: 'Height should be a number.'
          },
        min: [0, 'Height should be positive or zero.']
      },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Health = mongoose.model('Health', healthSchema);

module.exports = Health;