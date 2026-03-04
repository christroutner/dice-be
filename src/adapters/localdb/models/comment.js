/*
  Comment data model
*/

// Global npm libraries
import mongoose from 'mongoose'

const Comment = new mongoose.Schema({
  ownerId: { type: String, ref: 'user' },
  createdAt: { type: Date },
  commentContent: { type: String },
  updatedAt: { type: Date },
  likes: { type: Array, default: [] },
  parentId: { type: String, required: true }, // 'post id' ,'comment id' ,.
  parentType: { type: String, required: true } // 'post' ,'comment' ,...
})

export default mongoose.model('comment', Comment)
