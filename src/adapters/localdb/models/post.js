/*
  Post data model
*/

// Global npm libraries
import mongoose from 'mongoose'

const Post = new mongoose.Schema({
  ownerId: { type: String, ref: 'user' },
  createdAt: { type: Date },
  postContent: { type: String },
  likes: { type: Array, default: [] },
  updatedAt: { type: Date },
  mediaUrls: { type: Array, default: [] }
})

export default mongoose.model('post', Post)
