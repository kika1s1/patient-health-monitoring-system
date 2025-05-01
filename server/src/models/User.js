import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ 'doctor', 'admin'],
      default: 'doctor',
    },
    avatarUrl: {
      type: String,
      default:"https://randomuser.me/api/portraits/lego/1.jpg"
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);


const User = mongoose.model('User', userSchema);

export default User;
