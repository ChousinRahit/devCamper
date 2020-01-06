const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geoCoder');

const BootCampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Not more than 50 chars ']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'desc'],
      maxlength: [500, 'Not more than 500 chars']
    },
    phone: {
      type: String,
      maxlength: [20, 'no more than 20 numbers']
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'please use a valid URL with HTTP or HTTPS'
      ]
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'please add a valid email'
      ]
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    location: {
      //Geo json type
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
      ]
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating Must be at least 1'],
      max: [10, 'Rating cant be more than 10']
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpeg'
    },
    housing: {
      type: Boolean,
      default: false
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    jobGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Create bootcamp slug from the name
BootCampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geo code & create location field
BootCampSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  // Do npt save address in DB
  this.address = undefined;
  next();
});

// Reverse populate with virtuals
BootCampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
});

// Cascde deleteing of courses with the bootcamp
BootCampSchema.pre('remove', async function(next) {
  await this.model('Course').deleteMany({ bootcamp: this._id });
  console.log('Cascading delete');
  next();
});

module.exports = mongoose.model('Bootcamp', BootCampSchema);
