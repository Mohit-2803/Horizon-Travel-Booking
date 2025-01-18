import mongoose from "mongoose";  // Use import for ES Module syntax

const VerificationCode = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const VerificationCodeModel = mongoose.model("VerificationCode", VerificationCode);
export default VerificationCodeModel;  // Exporting as default
