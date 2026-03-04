import config from '../../../config/index.js'
import axios from 'axios'
import { assert } from 'chai'
import sinon from 'sinon'
import FormData from 'form-data'

import testUtils from '../../utils/test-utils.js'
// Mock data
// const mockData = require('./mocks/contact-mocks')

const LOCALHOST = `http://localhost:${config.port}`
let sandbox

describe('Files', () => {
  before(async () => {
    const userObj = {
      email: 'test-file@test.com',
      password: 'pass2',
      name: 'test2'
    }
    const testUser = await testUtils.createUser(userObj)
    context.user = testUser.user
    context.token = testUser.token
  })
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('POST /files/upload', () => {
    it('should not create  if the authorization header is missing', async () => {
      try {
        const formData = new FormData()
        formData.append('file', Buffer.from('test data'), 'test.txt')
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/files/upload`,
          data: formData

        }
        await axios(options)

        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })

    it('should not create a post if the authorization header is missing the scheme', async () => {
      try {
        const formData = new FormData()
        formData.append('file', Buffer.from('test data'), 'test.txt')
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/files/upload`,
          data: formData,
          headers: {
            Authorization: ` ${context.token}`
          }
        }
        await axios(options)

        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })

    it('should not create a post if the authorization header has invalid scheme', async () => {
      try {
        const formData = new FormData()
        formData.append('file', Buffer.from('test data'), 'test.txt')
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/files/upload`,
          data: formData,
          headers: {
            Authorization: `Unknown ${context.token}`
          }
        }
        await axios(options)

        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })

    it('should not create a post if the token is invalid', async () => {
      try {
        const formData = new FormData()
        formData.append('file', Buffer.from('test data'), 'test.txt')
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/files/upload`,
          data: formData,
          headers: {
            Authorization: 'Bearer 1'
          }
        }
        await axios(options)

        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })

    it('should create a file', async () => {
      const formData = new FormData()
      formData.append('file', Buffer.from('test data'), 'test.txt')
      const options = {
        method: 'POST',
        url: `${LOCALHOST}/files/upload`,
        data: formData,
        headers: {
          Authorization: `Bearer ${context.token}`
        }
      }
      const result = await axios(options)
      assert.equal(result.data.success, true)
      assert.property(result.data, 'fileRef')
      assert.property(result.data, 'fileName')
      context.fileRef = result.data.fileRef
    })
  })
  describe('GET /files/:id', () => {
    it('should not get a file if the authorization header is missing', async () => {
      try {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/files/1`
        }
        await axios(options)

        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })
    it('should not get a file if the authorization header has invalid scheme', async () => {
      try {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/files/1`,
          headers: {
            Authorization: `Unknown ${context.token}`
          }
        }
        await axios(options)

        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })
    it('should not get a file if the token is invalid', async () => {
      try {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/files/1`,
          headers: {
            Authorization: 'Bearer 1'
          }
        }
        await axios(options)

        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })
    it('should get a file', async () => {
      const fileRef = context.fileRef
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/files/${fileRef}`,
        headers: {
          Authorization: `Bearer ${context.token}`
        }
      }
      const result = await axios(options)
      assert.equal(result.status, 200)
    })
  })
})
