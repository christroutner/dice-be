/*
  Unit tests for the REST API handler for the /files endpoints.
*/

// Public npm libraries
import { assert } from 'chai'

import sinon from 'sinon'

// const app = require('../../../mocks/app-mock')

import FilesRouter from '../../../../../src/controllers/rest-api/files/index.js'

let uut
let sandbox
// let ctx

// const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#Files-REST-Router', () => {
  // const testUser = {}

  beforeEach(() => {
    uut = new FilesRouter()

    sandbox = sinon.createSandbox()

    // Mock the context object.
    // ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

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
    describe('#uploadFile', () => {
      it('should route to controller ', async () => {
        // Stub functions
        sandbox.stub(uut.validators, 'ensureUser').resolves(true)
        sandbox.stub(uut, 'koaBodyMiddleware').resolves(true)
        const spy = sandbox.stub(uut.filesRESTController, 'uploadFile').resolves(true)

        await uut.uploadFile()
        assert.isTrue(spy.calledOnce)
      })
    })
    describe('#getFile', () => {
      it('should route to controller', async () => {
        sandbox.stub(uut.validators, 'ensureUser').resolves(true)
        const spy = sandbox.stub(uut.filesRESTController, 'getFile').resolves(true)

        await uut.getFile()
        assert.isTrue(spy.calledOnce)
      })
    })
  })
})
