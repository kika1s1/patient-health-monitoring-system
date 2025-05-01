import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      // This ID groups messages for a specific conversation.
      // Could be a dedicated Chat model's _id, or a compound key of sorted user IDs.
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    timestamp: { // This field is effectively replaced by Mongoose's default `createdAt`
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Ensure timestamp from schema is used if provided, otherwise createdAt
messageSchema.pre('save', function(next) {
  if (this.isNew && !this.timestamp) {
    this.timestamp = this.createdAt;
  }
  next();
});


const Message = mongoose.model('Message', messageSchema);

export default Message;
