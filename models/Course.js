const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a coure title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tution cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
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

// Static method to get avg of course tution
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  console.log('Calculating avg cost...'.blue);
  console.log('Bid', bootcampId);

  const result = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  try {
    if (result.length > 0) {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageCost: Math.ceil(result[0].averageCost / 10) * 10
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post('save', function(next) {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function(next) {
  this.constructor.getAverageCost(this.bootcamp);
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
