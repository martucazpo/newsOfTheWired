var mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  name: String,
  comment: String,
});

NoteSchema.plugin(mongoose_delete);

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
