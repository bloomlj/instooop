const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * @typedef {Object} projectSchema
 * @property {string} uid - ID of the project
 * @property {string} name - Name of the project
 * @property {string} description - Description of the project
* @property {string} picture - Picture of the project
* @property {string} indexsystem - Picture of the project
*
 */

/**
 * Creates new projectSchema
 * @class
 */
const projectSchema = new Schema({
  uid: { type: String, unique: true },
  name: String,
  description: String,
  picture:String,
  materials: String,
  tools: String,
  setps: Array,
  tips: String
}, { timestamps: true });

const project = mongoose.model('project', projectSchema);

module.exports = project;
