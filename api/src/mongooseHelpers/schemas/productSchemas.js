const mongoose = require("mongoose");

const manufactureNotesSchema = new mongoose.Schema({
  sectionName: String,
  country: String,
  release: String,
  warranty: String,
})

const specificationsSchema = new mongoose.Schema({
  sectionName: String,
  color: String,
  mass: String,
  processor: String,
  screenSize: String,
})

const AdditionalInformationSchema = new mongoose.Schema({
  sectionName: String,
  delay: String
})


module.exports.productSchema = new mongoose.Schema({
  shelf: String,
  name: String,
  description: String,
  price: Number,
  img: String,
  starsCount: Number,
  manufactureNotes: manufactureNotesSchema,
  specification: specificationsSchema,
  additionalInformation: AdditionalInformationSchema
});





