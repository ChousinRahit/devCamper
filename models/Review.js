const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for a review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add a description']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add number of weeks']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    require: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true
  }
});

// Static method to get avg rating for a bootcamp
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  const result = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (result.length > 0) {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageRating: result[0].averageRating
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Call getAverageCost before remove
ReviewSchema.pre('remove', function(next) {
  this.constructor.getAverageRating(this.bootcamp);
  next();
});

// Call getAverageCost after save
ReviewSchema.post('save', function(next) {
  this.constructor.getAverageRating(this.bootcamp);
});

const Review = (module.exports = mongoose.model('Review', ReviewSchema));
