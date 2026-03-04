/*
  Unit tests for the REST API handler for the /comment endpoints.
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
import adapters from '../../../mocks/adapters/index.js'
import UseCasesMock from '../../../mocks/use-cases/index.js'
import CommentController from '../../../../../src/controllers/rest-api/comment/controller.js'

import { context as mockContext } from '../../../mocks/ctx-mock.js'
let uut
let sandbox
let ctx

describe('#Comment-REST-Controller', () => {
  // const testUser = {}

  beforeEach(() => {
    const useCases = new UseCasesMock()
    uut = new CommentController({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new CommentController()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating /comment REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new CommentController({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating /comment REST Controller.'
        )
      }
    })
  })

  describe('#POST /comment', () => {
    it('should return 422 status on biz logic error', async () => {
      try {
        await uut.createComment(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.equal(err.status, 422)
        assert.include(err.message, 'Cannot read')
      }
    })

    it('should return 200 status on success', async () => {
      ctx.request.body = {
        comment: {
          ownerId: '56bd1da600a526986cf65c80',
          commentContent: 'This is a test comment'
        }
      }

      await uut.createComment(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'comment')
    })
  })

  describe('GET /comment', () => {
    it('should return 422 status on arbitrary biz logic error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.comment, 'getAllComments')
          .rejects(new Error('test error'))

        await uut.getComments(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })

    it('should return 200 status on success', async () => {
      await uut.getComments(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'comments')
    })
  })

  describe('GET /comment/:id', () => {
    it('should return 422 status on arbitrary biz logic error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.comment, 'getComment')
          .rejects(new Error('test error'))

        await uut.getComment(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })

    it('should return 200 status on success', async () => {
      // Mock dependencies
      sandbox.stub(uut.useCases.comment, 'getComment').resolves({ _id: '123' })

      await uut.getComment(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'comment')
    })
    it('should run next function if it exists', async () => {
      // Mock dependencies
      const nextSpy = sandbox.spy()
      sandbox.stub(uut.useCases.comment, 'getComment').resolves({ _id: '123' })

      await uut.getComment(ctx, nextSpy)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'comment')
      assert.isTrue(nextSpy.calledOnce)
    })

    it('should return other error status passed by biz logic', async () => {
      try {
        // Mock dependencies
        const testErr = new Error('test error')
        testErr.status = 404
        sandbox.stub(uut.useCases.comment, 'getComment').rejects(testErr)

        await uut.getComment(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 404)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('PUT /comment/:id', () => {
    it('should return 422 if no input data given', async () => {
      try {
        await uut.updateComment(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.equal(err.status, 422)
        assert.include(err.message, 'Cannot read')
      }
    })

    it('should return 200 on success', async () => {
      // Prep the testUser data.
      // console.log('testUser: ', testUser)
      // testUser.password = 'password'
      // delete testUser.type

      // Replace the testUser variable with an actual model from the DB.
      // const existingUser = await User.findById(testUser._id)

      ctx.body = {
        user: {}
      }
      ctx.request.body = {
        user: {}
      }

      // Mock dependencies
      sandbox.stub(uut.useCases.comment, 'updateComment').resolves({})

      await uut.updateComment(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'comment')
    })
  })
  describe('GET /comment/parent/:id', () => {
    it('should return 200 on success', async () => {
      ctx.params = {
        id: 'abc123'
      }

      sandbox.stub(uut.useCases.comment, 'getCommentsByParentId').returns([])
      await uut.getCommentsByParentId(ctx)
      assert.equal(ctx.status, 200)
      assert.property(ctx.response.body, 'comments')
    })
    it('should return 422 if no input data given', async () => {
      try {
        await uut.getCommentsByParentId(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.equal(err.status, 422)
        assert.include(err.message, 'Cannot read')
      }
    })
  })

  describe('DELETE /comment/:id', () => {
    it('should return 422 if no input data given', async () => {
      try {
        await uut.deleteComment(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.equal(err.status, 422)
        assert.include(err.message, 'Cannot read')
      }
    })

    it('should return 200 status on success', async () => {
      // Replace the testUser variable with an actual model from the DB.
      const existingComment = {}

      ctx.body = {
        comment: existingComment
      }

      await uut.deleteComment(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)
    })
  })

  describe('#handleError', () => {
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
