/*
  Unit tests for the REST API handler for the /files endpoints.
*/

// Public npm libraries
import { assert } from 'chai'

import sinon from 'sinon'
import FilesController from '../../../../../src/controllers/rest-api/files/controller.js'

import { context as mockContext } from '../../../mocks/ctx-mock.js'
let uut
let sandbox
let ctx

describe('Files REST API Controller', () => {
  before(async () => {
  })

  beforeEach(() => {
    uut = new FilesController()

    sandbox = sinon.createSandbox()

    // Mock the context object.
    ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#POST /files/upload', () => {
    it('should handle a biz logic error', async () => {
      try {
        await uut.uploadFile()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Cannot read properties of undefined')
      }
    })

    it('should return 200 status on success', async () => {
      ctx.request = {
        files: {
          file: {
            newFilename: 'test.txt',
            originalFilename: 'test.txt'
          }
        }
      }

      await uut.uploadFile(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'success')
      assert.isTrue(ctx.response.body.success)
    })
  })
  describe('#GET /files/:id', () => {
    it('should handle a biz logic error', async () => {
      try {
        await uut.getFile()
      } catch (err) {
        assert.include(err.message, 'Cannot read properties of undefined')
      }
    })
    it('should return 200 status on success', async () => {
      try {
        sandbox.stub(uut, 'koaSend').callsFake((ctx, fileId, options) => {
          ctx.status = 200
          return true
        })
        ctx.params = {
          id: '123'
        }
        await uut.getFile(ctx)
        assert.equal(ctx.status, 200)
      } catch (error) {
        assert.fail(error)
      }
    })
  })

  describe('#handleError', () => {
    it('should pass an error message', () => {
      try {
        const err = {
          status: 422,
          message: 'Unprocessable Entity'
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.include(err.message, 'Unprocessable Entity')
      }
    })

    it('should still throw error if there is no message', () => {
      try {
        const err = {
          status: 404
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.include(err.message, 'Not Found')
      }
    })
  })
})
