/*
  REST API Controller library for the /comment route
*/

import wlogger from '../../../adapters/wlogger.js'

class CommentRESTControllerLib {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /comment REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /comment REST Controller.'
      )
    }

    // Encapsulate dependencies
    this.CommentModel = this.adapters.localdb.Comments

    // Bind all subfunctions to the class instance.
    this.createComment = this.createComment.bind(this)
    this.getComments = this.getComments.bind(this)
    this.getComment = this.getComment.bind(this)
    this.updateComment = this.updateComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this.getCommentsByParentId = this.getCommentsByParentId.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  /**
    * @api {post} /comment Create a new comment
   * @apiPermission user
   * @apiName CreateComment
   * @apiGroup REST Comment
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "comment": { "ownerId": "56bd1da600a526986cf65c80", "commentContent": "This is a test comment", "parentId": "56bd1da600a526986cf65c80", "parentType": "post" } }' localhost:5010/comment
   *
   * @apiParam {Object} comment          Comment object (required)
   * @apiParam {String} comment.ownerId Owner id
   * @apiParam {Date} comment.createdAt Created at
   * @apiParam {String} comment.commentContent Comment content
   * @apiParam {String} comment.parentId Parent id
   * @apiParam {String} comment.parentType Parent type
   *
   * @apiSuccess {Object}   comment           Comment object
   * @apiSuccess {ObjectId} comment._id       Comment id
   * @apiSuccess {String}   comment.ownerId    Owner id
   * @apiSuccess {Date}     comment.createdAt  Created at
   * @apiSuccess {String}   comment.commentContent Comment content
   * @apiSuccess {String}   comment.parentId Parent id
   * @apiSuccess {String}   comment.parentType Parent type
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "comment": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "commentContent": "This is a test comment"
   *          "parentId": "56bd1da600a526986cf65c80"
   *          "parentType": "post",
   *          "likes": []

   *       }
   *     }
   *
   * @apiError UnprocessableEntity Missing required parameters or invalid data types
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async createComment (ctx) {
    try {
      const commentObj = ctx.request.body.comment

      const comment = await this.useCases.comment.createComment(commentObj)

      ctx.body = { comment }
    } catch (err) {
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /comment Get all comments
   * @apiPermission user
   * @apiName GetComments
   * @apiGroup REST Comment
   *
   * @apiExample Example usage:
    * curl -H "Content-Type: application/json" -X GET localhost:5010/comment
   *
   * @apiSuccess {Object[]} comments           Array of comment objects
   * @apiSuccess {ObjectId} comments._id       Comment id
   * @apiSuccess {String}   comments.ownerId    Owner id
   * @apiSuccess {Date}     comments.createdAt  Created at
   * @apiSuccess {String}   comments.commentContent Comment content
   * @apiSuccess {String}   comments.parentId Parent id
   * @apiSuccess {String}   comments.parentType Parent type
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
  *       "comments": [{
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "commentContent": "This is a test comment"
   *          "parentId": "56bd1da600a526986cf65c80"
   *          "parentType": "post"
   *       }]
   *     }
   *
   * @apiUse TokenError
   */
  async getComments (ctx) {
    try {
      const comments = await this.useCases.comment.getAllComments()

      ctx.body = { comments }
    } catch (err) {
      wlogger.error('Error in comment/controller.js/getComments(): ', err)
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /comment/:id Get comment by id
   * @apiPermission user
   * @apiName GetComment
   * @apiGroup REST Comment
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5010/comment/56bd1da600a526986cf65c80
   *
   * @apiSuccess {Object}   comments           Comment object
   * @apiSuccess {ObjectId} comments._id       Comment id
   * @apiSuccess {String}   comments.ownerId    Owner id
   * @apiSuccess {Date}     comments.createdAt  Created at
   * @apiSuccess {String}   comments.commentContent Comment content
   * @apiSuccess {String}   comments.parentId Parent id
   * @apiSuccess {String}   comments.parentType Parent type
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "comment": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "commentContent": "This is a test comment"
   *          "parentId": "56bd1da600a526986cf65c80"
   *          "parentType": "post"
   *       }
   *     }
   *
   * @apiUse TokenError
   */
  async getComment (ctx, next) {
    try {
      const comment = await this.useCases.comment.getComment(ctx.params)

      ctx.body = {
        comment
      }
    } catch (err) {
      this.handleError(ctx, err)
    }

    if (next) {
      return next()
    }
  }

  /**
   * @api {put} /comment/:id Update a comment
   * @apiPermission user
   * @apiName UpdateComment
    * @apiGroup REST Comment
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "comment": { "commentContent": "Cool new comment content" } }' localhost:5010/comment/56bd1da600a526986cf65c80
   *
   * @apiParam {Object} comment          Comment object (required)
   * @apiParam {String} comment.commentContent Comment content
   * @apiParam {String} comment.parentId Parent id
   * @apiParam {String} comment.parentType Parent type
   *
   * @apiSuccess {Object}   comments           Comment object
   * @apiSuccess {ObjectId} comments._id       Comment id
   * @apiSuccess {String}   comments.ownerId    Owner id
    * @apiSuccess {Date}     comments.createdAt  Created at
   * @apiSuccess {String}   comments.commentContent Updated comment content
   * @apiSuccess {String}   comments.parentId Updated parent id
   * @apiSuccess {String}   comments.parentType Updated parent type
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "comment": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "commentContent": "Cool new comment content"
   *          "parentId": "56bd1da600a526986cf65c80"
   *          "parentType": "post"
   *       }
   *     }
   *
   * @apiError UnprocessableEntity Missing required parameters or invalid data types
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   *
   * @apiUse TokenError
   */
  async updateComment (ctx) {
    try {
      const existingComment = ctx.body.comment
      const newData = ctx.request.body.comment

      const comment = await this.useCases.comment.updateComment(existingComment, newData)

      ctx.body = {
        comment
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  /**
    * @api {delete} /comment/:id Delete a comment
   * @apiPermission user
   * @apiName DeleteComment
   * @apiGroup REST Comment
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5010/comment/56bd1da600a526986cf65c80
   *
   * @apiSuccess {StatusCode} 200
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true
   *     }
   *
   * @apiUse TokenError
   */
  async deleteComment (ctx) {
    try {
      const comment = ctx.body.comment

      // await comment.remove()
      await this.useCases.comment.deleteComment(comment)

      ctx.status = 200
      ctx.body = {
        comment
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /comment/parent/:id Get comments by parent id
   * @apiPermission user
   * @apiName GetCommentsByParentId
   * @apiGroup REST Comment
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -X GET localhost:5010/comment/parent/56bd1da600a526986cf65c80
   *
   * @apiSuccess {Object[]} comments           Array of comment objects
   * @apiSuccess {ObjectId} comments._id       Comment id
   * @apiSuccess {String}   comments.ownerId    Owner id
   * @apiSuccess {Date}     comments.createdAt  Created at
   * @apiSuccess {String}   comments.commentContent Comment content
   * @apiSuccess {String}   comments.parentId Parent id
   * @apiSuccess {String}   comments.parentType Parent type
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "comments": [{
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "commentContent": "This is a test comment"
   *          "parentId": "56bd1da600a526986cf65c80"
   *          "parentType": "post"
   *       }]
   *     }
   *
   * @apiUse TokenError
   * @apiError UnprocessableEntity Missing required parameters or invalid data types
   */
  async getCommentsByParentId (ctx) {
    try {
      const comments = await this.useCases.comment.getCommentsByParentId(ctx.params.id)
      ctx.body = { comments }
    } catch (err) {
      this.handleError(ctx, err, 422)
    }
  }

  // DRY error handler
  handleError (ctx, err) {
    // If an HTTP status is specified by the buisiness logic, use that.
    if (err.status) {
      if (err.message) {
        ctx.throw(err.status, err.message)
      } else {
        ctx.throw(err.status)
      }
    } else {
      // By default use a 422 error if the HTTP status is not specified.
      ctx.throw(422, err.message)
    }
  }
}

export default CommentRESTControllerLib
