/*
  This library contains business-logic for dealing with comments. Most of these
  functions are called by the /comment REST API endpoints.
*/

import CommentEntity from '../entities/comment.js'

import wlogger from '../adapters/wlogger.js'

class CommentLib {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Comment Use Cases library.'
      )
    }

    // Encapsulate dependencies
    this.CommentEntity = new CommentEntity()
    this.CommentModel = this.adapters.localdb.Comments

    // Bind all methods to the class instance.
    this.createComment = this.createComment.bind(this)
    this.getAllComments = this.getAllComments.bind(this)
    this.getComment = this.getComment.bind(this)
    this.updateComment = this.updateComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this.getCommentsByParentId = this.getCommentsByParentId.bind(this)
  }

  // Create a new post model and add it to the Mongo database.
  async createComment (commentObj) {
    try {
      // Input Validation

      const commentEntity = this.CommentEntity.validate(commentObj)
      const comment = new this.CommentModel(commentEntity)
      comment.createdAt = new Date()

      await comment.save()

      return comment.toJSON()
    } catch (err) {
      wlogger.error('Error in lib/comments.js/createComment()', err)
      throw err
    }
  }

  // Returns an array of all comment models in the Mongo database.
  async getAllComments () {
    try {
      // Get all comment models.
      const comments = await this.CommentModel.find({})

      return comments
    } catch (err) {
      wlogger.error('Error in lib/comments.js/getAllComments()')
      throw err
    }
  }

  // Get the model for a specific comment.
  async getComment (params) {
    try {
      const { id } = params

      const comment = await this.CommentModel.findById(id)

      // Throw a 404 error if the user isn't found.
      if (!comment) {
        const err = new Error('Comment not found')
        err.status = 404
        throw err
      }

      return comment
    } catch (err) {
      // console.log('Error in getComment: ', err)

      if (err.status === 404) throw err

      // Return 422 for any other error
      err.status = 422
      err.message = 'Unprocessable Entity'
      throw err
    }
  }

  async updateComment (existingComment, newData) {
    try {
      if (newData.parentId) {
        throw new Error("Property 'parentId' is not allowed to be updated!")
      }
      if (newData.parentType) {
        throw new Error("Property 'parentType' is not allowed to be updated!")
      }
      if (newData.commentContent && typeof newData.commentContent !== 'string') {
        throw new Error("Property 'commentContent' must be a string!")
      }
      if (newData.likes && !Array.isArray(newData.likes)) {
        throw new Error("Property 'likes' must be an array!")
      }
      Object.assign(existingComment, newData)
      existingComment.updatedAt = new Date()

      // Save the changes to the database.
      await existingComment.save()

      return existingComment
    } catch (err) {
      wlogger.error('Error in lib/comments.js/updateComment()')
      throw err
    }
  }

  async deleteComment (comment) {
    try {
      await comment.remove()
    } catch (err) {
      wlogger.error('Error in lib/comments.js/deleteComment()')
      throw err
    }
  }

  // get comments by parent id ( post or comment )
  async getCommentsByParentId (parentId) {
    try {
      if (!parentId || typeof parentId !== 'string') {
        throw new Error("Property 'parentId' must be a string!")
      }
      const comments = await this.CommentModel.find({ parentId }).populate('ownerId')

      // sort by created at , newest to oldest
      comments.sort((a, b) => b.createdAt - a.createdAt)
      return comments
    } catch (err) {
      wlogger.error('Error in lib/comments.js/getCommentsByParentId()')
      throw err
    }
  }
}

export default CommentLib
