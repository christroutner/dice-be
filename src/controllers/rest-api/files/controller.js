/*
  REST API Controller library for the /files route
*/

// Global npm libraries

// Local libraries
import wlogger from '../../../adapters/wlogger.js'
import send from 'koa-send'
import path from 'path'

class FilesRESTControllerLib {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.koaSend = send
    // this.UserModel = this.adapters.localdb.Users
    // this.userUseCases = this.useCases.user

    // Bind 'this' object to all subfunctions
    this.uploadFile = this.uploadFile.bind(this)
    this.getFile = this.getFile.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  /**
    * @api {post} /files Upload a file
   * @apiPermission public
   * @apiName UploadFile
   * @apiGroup REST Files
   *
   * @apiExample Example usage:
   * curl -X POST localhost:5001/files/upload -H "Authorization: Bearer <token>" -F "file=@/path/to/your/file.txt"
   * @apiParam {File} file File to upload (required, multipart form data)
   *
   * @apiSuccess {Boolean} success True if the file was uploaded successfully.
   * @apiSuccess {String} fileRef The reference of the uploaded file.
   * @apiSuccess {String} fileName The name of the uploaded file.
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   */
  async uploadFile (ctx) {
    try {
      const { file } = ctx.request.files
      console.log(file)
      ctx.body = {
        success: true,
        fileRef: file.newFilename,
        fileName: file.originalFilename
      }
    } catch (err) {
      wlogger.error('Error in files/controller.js/uploadFile(): ')
      this.handleError(ctx, err)
    }
  }

  /**
    * @api {get} /files/:id Get a file
   * @apiPermission public
   * @apiName GetFile
   * @apiGroup REST Files
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5020/files/1234567890
   */
  async getFile (ctx) {
    try {
      const fileId = ctx.params.id
      const filePath = path.resolve('./files')
      ctx.set('Content-Disposition', 'inline')
      await this.koaSend(ctx, fileId, { root: filePath })
    } catch (err) {
      wlogger.error('Error in files/controller.js/getFile(): ')
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

// module.exports = FilesRESTControllerLib
export default FilesRESTControllerLib
