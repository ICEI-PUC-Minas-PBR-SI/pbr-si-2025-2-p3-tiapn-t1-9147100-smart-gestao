// models/Meta.js
// Metas financeiras por empresa (mensais, por categoria, etc.)

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MetaSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["revenue", "expense", "saving"], default: "saving" },
    targetAmount: { type: Number, required: true, min: 0 },
    currentAmount: { type: Number, default: 0, min: 0 },
    deadline: { type: Date },
  },
  { timestamps: true }
);

MetaSchema.index({ companyId: 1, deadline: 1 });

export default model("Meta", MetaSchema);
