import mongoose from "mongoose";

const userTemplateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
    auto: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  phoneCode: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  linkedin: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  specialization: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  pdfUrl: {
    type: String,
    required: false,
  },
  imageFile: {
    type: String,
    required: false,
  },
  terms: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserTemplate = mongoose.model("UserTemplate", userTemplateSchema);

export default UserTemplate;
