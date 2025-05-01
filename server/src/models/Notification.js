import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['new_message', 'appointment_reminder', 'vital_alert', 'system_update', 'new_feature'], // Added more common types
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    link: { // Optional link to navigate to, e.g., /messages/contactId or /appointments/appointmentId
      type: String,
      trim: true,
    },
    timestamp: { // This field is effectively replaced by Mongoose's default `createdAt`
      type: Date,
      default: Date.now,
      index: true,
    },
    sender: { // Optional: Information about who/what triggered the notification
      id: { type: mongoose.Schema.Types.Mixed }, // Could be a UserId, DeviceId, or SystemId
      name: { type: String, trim: true }, // e.g., "Dr. Smith", "ECG Monitor", "System"
      avatar: { type: String, trim: true }, // Optional avatar for the sender
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Ensure timestamp from schema is used if provided, otherwise createdAt
notificationSchema.pre('save', function(next) {
  if (this.isNew && !this.timestamp) {
    this.timestamp = this.createdAt;
  }
  next();
});


const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
