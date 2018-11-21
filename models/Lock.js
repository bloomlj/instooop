const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * @typedef {Object} lockSchema
 * @property {string} uid - ID of the lock
 * @property {string} name - Name of the lock
 * @property {string} description - Description of the lock
 */

/**
 * Creates new lockSchema
 * @class
 */
const lockSchema = new Schema({
  uid: { type: String, unique: true },
  name: String,
  description: String
}, { timestamps: true });

const Lock = mongoose.model('Lock', lockSchema);

module.exports = Lock;
