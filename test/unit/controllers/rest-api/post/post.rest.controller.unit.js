/*
  Unit tests for the REST API handler for the /post endpoints.
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
import adapters from '../../../mocks/adapters/index.js'
import UseCasesMock from '../../../mocks/use-cases/index.js'
import PostController from '../../../../../src/controllers/rest-api/post/controller.js'

import { context as mockContext } from '../../../mocks/ctx-mock.js'
let uut
let sandbox
let ctx

describe('#Post-REST-Controller', () => {
  // const testUser = {}

  beforeEach(() => {
    const useCases = new UseCasesMock()
    uut = new PostController({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new PostController()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating /post REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new PostController({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating /post REST Controller.'
        )
      }
    })
  })

  describe('#POST /post', () => {
    it('should return 422 status on biz logic error', async () => {
      try {
        await uut.createPost(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.equal(err.status, 422)
        assert.include(err.message, 'Cannot read')
      }
    })

    it('should return 200 status on success', async () => {
      ctx.request.body = {
        post: {
          ownerId: '56bd1da600a526986cf65c80',
          postContent: 'This is a test post',
          likes: ['56bd1da600a526986cf65c80']
        }
      }

      await uut.createPost(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'post')
    })
  })

  describe('GET /post', () => {
    it('should return 422 status on arbitrary biz logic error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.post, 'getAllPosts')
          .rejects(new Error('test error'))

        await uut.getPosts(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })

    it('should return 200 status on success', async () => {
      await uut.getPosts(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'posts')
    })
  })

  describe('GET /post/:id', () => {
    it('should return 422 status on arbitrary biz logic error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.post, 'getPost')
          .rejects(new Error('test error'))

        await uut.getPost(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 422)
        assert.include(err.message, 'test error')
      }
    })

    it('should return 200 status on success', async () => {
      // Mock dependencies
      sandbox.stub(uut.useCases.post, 'getPost').resolves({ _id: '123' })

      await uut.getPost(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'post')
    })
    it('should run next function if it exists', async () => {
      // Mock dependencies
      const nextSpy = sandbox.spy()
      sandbox.stub(uut.useCases.post, 'getPost').resolves({ _id: '123' })

      await uut.getPost(ctx, nextSpy)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'post')
      assert.isTrue(nextSpy.calledOnce)
    })

    it('should return other error status passed by biz logic', async () => {
      try {
        // Mock dependencies
        const testErr = new Error('test error')
        testErr.status = 404
        sandbox.stub(uut.useCases.post, 'getPost').rejects(testErr)

        await uut.getPost(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.status, 404)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('PUT /post/:id', () => {
    it('should return 422 if no input data given', async () => {
      try {
        await uut.updatePost(ctx)

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
      sandbox.stub(uut.useCases.post, 'updatePost').resolves({})

      await uut.updatePost(ctx)

      // Assert the expected HTTP response
      assert.equal(ctx.status, 200)

      // Assert that expected properties exist in the returned data.
      assert.property(ctx.response.body, 'post')
    })
  })
  describe('GET /post/hydrated', () => {
    it('should return 422 if no input data given', async () => {
      try {
        sandbox.stub(uut.useCases.post, 'getHydratedPosts').rejects(new Error('test error'))
        await uut.getHydratedPosts(ctx)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
    it('should return 200 on success', async () => {
      await uut.getHydratedPosts(ctx)
      assert.equal(ctx.status, 200)
      assert.property(ctx.response.body, 'posts')
    })
  })
  describe('GET /post/hydrated/:id', () => {
    it('should return 422 if no input data given', async () => {
      try {
        ctx.params = {
          id: '123'
        }
        sandbox.stub(uut.useCases.post, 'getHydratedPost').rejects(new Error('test error'))
        await uut.getHydratedPost(ctx)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
    it('should return 200 on success', async () => {
      ctx.params = {
        id: '123'
      }
      await uut.getHydratedPost(ctx)
      assert.equal(ctx.status, 200)
      assert.property(ctx.response.body, 'post')
    })
  })

  describe('DELETE /post/:id', () => {
    it('should return 422 if no input data given', async () => {
      try {
        await uut.deletePost(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.equal(err.status, 422)
        assert.include(err.message, 'Cannot read')
      }
    })

    it('should return 200 status on success', async () => {
      // Replace the testUser variable with an actual model from the DB.
      const existingPost = {}

      ctx.body = {
        post: existingPost
      }

      await uut.deletePost(ctx)

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
