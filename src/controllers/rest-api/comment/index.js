/*
  REST API library for /comment route.
*/

// Public npm libraries.
import Router from 'koa-router'

// Local libraries.
import CommentRESTControllerLib from './controller.js'

import Validators from '../middleware/validators.js'

import config from '../../../../config/index.js'

class CommentRouter {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Comment REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Comment REST Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Encapsulate dependencies.
    this.config = config
    this.commentRESTController = new CommentRESTControllerLib(dependencies)
    this.validators = new Validators()

    // Instantiate the router and set the base route.
    const baseUrl = '/comment'
    this.router = new Router({ prefix: baseUrl })

    // Bind all subfunctions to the class instance.
    this.createComment = this.createComment.bind(this)
    this.getAll = this.getAll.bind(this)
    this.getComment = this.getComment.bind(this)
    this.updateComment = this.updateComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this.getCommentsByParentId = this.getCommentsByParentId.bind(this)
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    this.router.post('/', this.createComment)
    this.router.get('/', this.getAll)
    this.router.get('/:id', this.getComment)
    this.router.put('/:id', this.updateComment)
    this.router.delete('/:id', this.deleteComment)
    this.router.get('/parent/:id', this.getCommentsByParentId)

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }

  async createComment (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.commentRESTController.createComment(ctx, next)
    return true
  }

  async getAll (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.commentRESTController.getComments(ctx, next)
  }

  async getComment (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.commentRESTController.getComment(ctx, next)
  }

  async updateComment (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.commentRESTController.getComment(ctx, next)
    await this.commentRESTController.updateComment(ctx, next)
  }

  async deleteComment (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.commentRESTController.getComment(ctx, next)
    await this.commentRESTController.deleteComment(ctx, next)
  }

  async getCommentsByParentId (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.commentRESTController.getCommentsByParentId(ctx, next)
  }
}

export default CommentRouter
