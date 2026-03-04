/*
  REST API library for the /files route.
*/

// Public npm libraries.
import Router from 'koa-router'
import { koaBody } from 'koa-body'

// Local libraries.
import FilesRESTControllerLib from './controller.js'
import Validators from '../middleware/validators.js'

// let _this

class FilesRouter {
  constructor (localConfig = {}) {
    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Encapsulate dependencies.
    this.filesRESTController = new FilesRESTControllerLib(dependencies)
    this.validators = new Validators()

    // Instantiate the router and set the base route.
    const baseUrl = '/files'
    this.router = new Router({ prefix: baseUrl })

    this.koaBodyMiddleware = koaBody({ multipart: true, formidable: { uploadDir: './files', keepExtensions: true } })

    this.attach = this.attach.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.getFile = this.getFile.bind(this)

    // _this = this
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    this.router.post('/upload', this.uploadFile)
    this.router.get('/:id', this.getFile)

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }

  async uploadFile (ctx, next) {
    // Validate the user.
    await this.validators.ensureUser(ctx, next)
    // Parse the multipart form data.
    await this.koaBodyMiddleware(ctx, next)
    // Upload the file.
    await this.filesRESTController.uploadFile(ctx)
  }

  async getFile (ctx, next) {
    await this.validators.ensureUser(ctx, next)
    await this.filesRESTController.getFile(ctx)
  }
}

// module.exports = BchRouter
export default FilesRouter
