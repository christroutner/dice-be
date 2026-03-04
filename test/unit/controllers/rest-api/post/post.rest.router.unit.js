/*
  Unit tests for the REST API handler for the /post endpoints.
*/

// Public npm libraries
import { assert } from 'chai'

import sinon from 'sinon'

// Local support libraries
import adapters from '../../../mocks/adapters/index.js'

import UseCasesMock from '../../../mocks/use-cases/index.js'

// const app = require('../../../mocks/app-mock')

import PostRouter from '../../../../../src/controllers/rest-api/post/index.js'

let uut
let sandbox
// let ctx

// const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#Post-REST-Router', () => {
  // const testUser = {}

  beforeEach(() => {
    const useCases = new UseCasesMock()
    uut = new PostRouter({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    // ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new PostRouter()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating Post REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new PostRouter({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating Post REST Controller.'
        )
      }
    })
  })

  describe('#attach', () => {
    it('should throw an error if app is not passed in.', () => {
      try {
        uut.attach()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Must pass app object when attaching REST API controllers.'
        )
      }
    })
  })

  describe('#createPost', () => {
    it('should route to controller ', async () => {
      // Stub functions
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.postRESTController, 'createPost').resolves(true)

      await uut.createPost()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#getAll', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.postRESTController, 'getPosts').resolves(true)

      await uut.getAll()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#getPost', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.postRESTController, 'getPost').resolves(true)

      await uut.getPost()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#updatePost', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      sandbox.stub(uut.postRESTController, 'getPost').resolves(true)
      const spy = sandbox.stub(uut.postRESTController, 'updatePost').resolves(true)

      await uut.updatePost()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#deletePost', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      sandbox.stub(uut.postRESTController, 'getPost').resolves(true)
      const spy = sandbox.stub(uut.postRESTController, 'deletePost').resolves(true)

      await uut.deletePost()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#getHydratedPosts', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.postRESTController, 'getHydratedPosts').resolves(true)

      await uut.getHydratedPosts()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#getHydratedPost', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.postRESTController, 'getHydratedPost').resolves(true)

      await uut.getHydratedPost()
      assert.isTrue(spy.calledOnce)
    })
  })
})
