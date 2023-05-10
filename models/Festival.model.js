const { Schema, model } = require("mongoose");

const festivalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description : {
        type: String,
        required: true,
      },
    genre: {
        type: String,
        required: true,
      },
    season: {
        type: String,
        required: true,
      },
    location: {
        type: String,
        required: true,
      },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Festival = model("Festival", festivalSchema);

module.exports = Festival;
