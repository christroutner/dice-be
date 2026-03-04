/*
  Unit tests for the REST API handler for the /comment endpoints.
*/

// Public npm libraries
import { assert } from 'chai'

import sinon from 'sinon'

// Local support libraries
import adapters from '../../../mocks/adapters/index.js'

import UseCasesMock from '../../../mocks/use-cases/index.js'

// const app = require('../../../mocks/app-mock')

import CommentRouter from '../../../../../src/controllers/rest-api/comment/index.js'

let uut
let sandbox
// let ctx

// const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#Comment-REST-Router', () => {
  // const testUser = {}

  beforeEach(() => {
    const useCases = new UseCasesMock()
    uut = new CommentRouter({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    // ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new CommentRouter()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating Comment REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new CommentRouter({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating Comment REST Controller.'
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

  describe('#createComment', () => {
    it('should route to controller ', async () => {
      // Stub functions
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.commentRESTController, 'createComment').resolves(true)

      await uut.createComment()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#getAll', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.commentRESTController, 'getComments').resolves(true)

      await uut.getAll()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#getComment', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.commentRESTController, 'getComment').resolves(true)

      await uut.getComment()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#updateComment', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      sandbox.stub(uut.commentRESTController, 'getComment').resolves(true)
      const spy = sandbox.stub(uut.commentRESTController, 'updateComment').resolves(true)

      await uut.updateComment()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#deleteComment', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      sandbox.stub(uut.commentRESTController, 'getComment').resolves(true)
      const spy = sandbox.stub(uut.commentRESTController, 'deleteComment').resolves(true)

      await uut.deleteComment()
      assert.isTrue(spy.calledOnce)
    })
  })
  describe('#getCommentsByParentId', () => {
    it('should route to controller', async () => {
      sandbox.stub(uut.validators, 'ensureUser').resolves(true)
      const spy = sandbox.stub(uut.commentRESTController, 'getCommentsByParentId').resolves(true)

      await uut.getCommentsByParentId()
      assert.isTrue(spy.calledOnce)
    })
  })
})
