/*
  REST API library for /post route.
*/

// Public npm libraries.
import Router from 'koa-router'

// Local libraries.
import PostRESTControllerLib from './controller.js'

import Validators from '../middleware/validators.js'

import config from '../../../../config/index.js'

class PostRouter {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Post REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Post REST Controller.'
      )
    }

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Encapsulate dependencies.
    this.config = config
    this.postRESTController = new PostRESTControllerLib(dependencies)
    this.validators = new Validators()

    // Instantiate the router and set the base route.
    const baseUrl = '/post'
    this.router = new Router({ prefix: baseUrl })

    // Bind all subfunctions to the class instance.
    this.createPost = this.createPost.bind(this)
    this.getAll = this.getAll.bind(this)
    this.getPost = this.getPost.bind(this)
    this.updatePost = this.updatePost.bind(this)
    this.deletePost = this.deletePost.bind(this)
    this.getHydratedPosts = this.getHydratedPosts.bind(this)
    this.getHydratedPost = this.getHydratedPost.bind(this)
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    this.router.post('/', this.createPost)
    this.router.get('/', this.getAll)
    this.router.get('/hydrated', this.getHydratedPosts)
    this.router.get('/hydrated/:id', this.getHydratedPost)
    this.router.get('/:id', this.getPost)
    this.router.put('/:id', this.updatePost)
    this.router.delete('/:id', this.deletePost)
    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }

  async createPost (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.postRESTController.createPost(ctx, next)
    return true
  }

  async getAll (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.postRESTController.getPosts(ctx, next)
  }

  async getPost (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.postRESTController.getPost(ctx, next)
  }

  async updatePost (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.postRESTController.getPost(ctx, next)
    await this.postRESTController.updatePost(ctx, next)
  }

  async deletePost (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.postRESTController.getPost(ctx, next)
    await this.postRESTController.deletePost(ctx, next)
  }

  async getHydratedPosts (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.postRESTController.getHydratedPosts(ctx, next)
  }

  async getHydratedPost (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.postRESTController.getHydratedPost(ctx, next)
  }
}

export default PostRouter
