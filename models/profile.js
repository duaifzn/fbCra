const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    uuid: { type: String, default: null },
    realUrl: { type: String, default: null },
    name: { type: String, default: null },
    backgroundImageUrl: { type: String, default: null },
    profileImageUrl: { type: String, default: null },
    from: { type: String, default: null },
    residence: { type: String, default: null },
    friendValue: { type: String, default: null },
    realAccount: { type: Boolean, default: null },
  },
  { timestamps: true, collection: 'profile' }
);

module.exports = profileSchema;


