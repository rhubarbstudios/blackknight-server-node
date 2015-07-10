let mongoose = require('bluebird').promisifyAll(require('mongoose'));

let VisitorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: {
      unique: true
    }
  },
  company: {
    type: String
  },
  photoUrl: {
    type: String
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  needsApproval: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Visitor', VisitorSchema);
