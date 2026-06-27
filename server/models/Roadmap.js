const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    progress: {
      type: Number,
      default: 0,
    },
    steps: [
      {
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
module.exports = Roadmap;
