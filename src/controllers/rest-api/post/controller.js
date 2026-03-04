/*
  REST API Controller library for the /post route
*/

import wlogger from '../../../adapters/wlogger.js'

class PostRESTControllerLib {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /post REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /post REST Controller.'
      )
    }

    // Encapsulate dependencies
    this.PostModel = this.adapters.localdb.Posts

    // Bind all subfunctions to the class instance.
    this.createPost = this.createPost.bind(this)
    this.getPosts = this.getPosts.bind(this)
    this.getPost = this.getPost.bind(this)
    this.updatePost = this.updatePost.bind(this)
    this.deletePost = this.deletePost.bind(this)
    this.getHydratedPosts = this.getHydratedPosts.bind(this)
    this.getHydratedPost = this.getHydratedPost.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  /**
   * @api {post} /post Create a new post
   * @apiPermission user
   * @apiName CreatePost
   * @apiGroup REST Post
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "post": { "ownerId": "56bd1da600a526986cf65c80", "postContent": "This is a test post" } }' localhost:5010/post
   *
   * @apiParam {Object} post          Post object (required)
   * @apiParam {String} post.ownerId Owner id
   * @apiParam {Date} post.createdAt Created at
   * @apiParam {String} post.postContent Post content
   *
   * @apiSuccess {Object}   posts           Post object
   * @apiSuccess {ObjectId} posts._id       Post id
   * @apiSuccess {String}   post.ownerId    Owner id
   * @apiSuccess {Date}     post.createdAt  Created at
   * @apiSuccess {String}   post.postContent Post content
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "post": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "postContent": "This is a test post"
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
  async createPost (ctx) {
    try {
      const postObj = ctx.request.body.post

      const post = await this.useCases.post.createPost(postObj)

      ctx.body = { post }
    } catch (err) {
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /post Get all posts
   * @apiPermission user
   * @apiName GetPosts
   * @apiGroup REST Post
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5000/post
   *
   * @apiSuccess {Object[]} posts           Array of post objects
   * @apiSuccess {ObjectId} posts._id       Post id
   * @apiSuccess {String}   post.ownerId    Owner id
   * @apiSuccess {Date}     post.createdAt  Created at
   * @apiSuccess {String}   post.postContent Post content
   * @apiSuccess {Array}    post.likes      Likes
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
  *       "posts": [{
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "postContent": "This is a test post"
   *          "likes": ["56bd1da600a526986cf65c80"]
   *       }]
   *     }
   *
   * @apiUse TokenError
   */
  async getPosts (ctx) {
    try {
      const posts = await this.useCases.post.getAllPosts()

      ctx.body = { posts }
    } catch (err) {
      wlogger.error('Error in post/controller.js/getPosts(): ', err)
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /post/:id Get post by id
   * @apiPermission user
   * @apiName GetPost
   * @apiGroup REST Post
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5010/post/56bd1da600a526986cf65c80
   *
   * @apiSuccess {Object}   posts           Post object
   * @apiSuccess {ObjectId} posts._id       Post id
   * @apiSuccess {String}   post.ownerId    Owner id
   * @apiSuccess {Date}     post.createdAt  Created at
   * @apiSuccess {String}   post.postContent Post content
   * @apiSuccess {Array}    post.likes      Likes
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "post": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "postContent": "This is a test post"
   *          "likes": ["56bd1da600a526986cf65c80"]
   *       }
   *     }
   *
   * @apiUse TokenError
   */
  async getPost (ctx, next) {
    try {
      const post = await this.useCases.post.getPost(ctx.params)

      ctx.body = {
        post
      }
    } catch (err) {
      this.handleError(ctx, err)
    }

    if (next) {
      return next()
    }
  }

  /**
   * @api {put} /post/:id Update a post
   * @apiPermission user
   * @apiName UpdatePost
   * @apiGroup REST Post
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "post": { "postContent": "Cool new post content" } }' localhost:5000/post/56bd1da600a526986cf65c80
   *
   * @apiParam {Object} post          Post object (required)
   * @apiParam {String} post.postContent Post content
   * @apiParam {Array} post.likes Likes
   *
   * @apiSuccess {Object}   posts           Post object
   * @apiSuccess {ObjectId} posts._id       Post id
   * @apiSuccess {String}   post.ownerId    Owner id
   * @apiSuccess {Date}     post.createdAt  Created at
   * @apiSuccess {String}   post.postContent Updated post content
   * @apiSuccess {Array}    post.likes      Updated likes
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "post": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "postContent": "Cool new post content"
   *          "likes": ["56bd1da600a526986cf65c80"]
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
  async updatePost (ctx) {
    try {
      const existingPost = ctx.body.post
      const newData = ctx.request.body.post

      const post = await this.useCases.post.updatePost(existingPost, newData)

      ctx.body = {
        post
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  /**
    * @api {delete} /post/:id Delete a post
   * @apiPermission user
   * @apiName DeletePost
   * @apiGroup REST Post
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5000/post/56bd1da600a526986cf65c80
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
  async deletePost (ctx) {
    try {
      const post = ctx.body.post

      // await post.remove()
      await this.useCases.post.deletePost(post)

      ctx.status = 200
      ctx.body = {
        success: true
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /post/hydrated Get all hydrated posts
   * @apiPermission user
   * @apiName GetHydratedPosts
   * @apiGroup REST Post
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5010/post/hydrated
   *
   * @apiSuccess {Object}   post           Post object
   * @apiSuccess {ObjectId} post._id       Post id
   * @apiSuccess {String}   post.ownerId    Owner id
   * @apiSuccess {Date}     post.createdAt  Created at
   * @apiSuccess {String}   post.postContent Post content
   * @apiSuccess {Array}    post.likes      Likes
   * @apiSuccess {Number}   post.totalComments Total comments count
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "post": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "postContent": "This is a test post"
   *          "likes": ["56bd1da600a526986cf65c80"]
   *          "totalComments": 1
   *       }
   *     }
   *
   * @apiUse TokenError
   */
  async getHydratedPosts (ctx) {
    try {
      const posts = await this.useCases.post.getHydratedPosts()
      ctx.body = { posts }
    } catch (err) {
      this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /post/hydrated/:id Get a single hydrated post
   * @apiPermission user
   * @apiName GetHydratedPost
   * @apiGroup REST Post
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5010/post/hydrated/56bd1da600a526986cf65c80
   *
   * @apiSuccess {Object}   post           Post object
   * @apiSuccess {ObjectId} post._id       Post id
   * @apiSuccess {String}   post.ownerId    Owner id
   * @apiSuccess {Date}     post.createdAt  Created at
   * @apiSuccess {String}   post.postContent Post content
   * @apiSuccess {Array}    post.likes      Likes
   * @apiSuccess {Number}   post.totalComments Total comments count
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "post": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "ownerId": "56bd1da600a526986cf65c80"
   *          "createdAt": "2025-01-01"
   *          "postContent": "This is a test post"
   *          "likes": ["56bd1da600a526986cf65c80"]
   *          "totalComments": 1
   *       }
   *     }
   *
   * @apiUse TokenError
   */
  async getHydratedPost (ctx) {
    try {
      const post = await this.useCases.post.getHydratedPost(ctx.params.id)
      ctx.body = { post }
    } catch (err) {
      this.handleError(ctx, err)
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

export default PostRESTControllerLib
