/*
  Unit tests for the User entity library.
*/

import { assert } from 'chai'

import sinon from 'sinon'
import User from '../../../src/entities/user.js'

let sandbox
let uut

describe('#User-Entity', () => {
  before(async () => {})

  beforeEach(() => {
    uut = new User()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#validate', () => {
    it('should throw an error if email is not provided', () => {
      try {
        uut.validate()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'email' must be a string!")
      }
    })

    it('should throw an error if password is not provided', () => {
      try {
        uut.validate({ email: 'test@test.com' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'password' must be a string!")
      }
    })

    it('should throw an error if name is not provided', () => {
      try {
        uut.validate({ email: 'test@test.com', password: 'test' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'name' must be a string!")
      }
    })
    it('should throw an error if provided profilePictureUrl is not a string', () => {
      try {
        uut.validate({ email: 'test@test.com', password: 'test', name: 'test', profilePictureUrl: 1234 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'profilePictureUrl' must be a string!")
      }
    })

    it('should throw an error if provided about is not a string', () => {
      try {
        uut.validate({ email: 'test@test.com', password: 'test', name: 'test', about: 1234 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'about' must be a string!")
      }
    })

    it('should throw an error if provided website is not a string', () => {
      try {
        uut.validate({ email: 'test@test.com', password: 'test', name: 'test', website: 1234 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'website' must be a string!")
      }
    })

    it('should return a User object', () => {
      const inputData = {
        email: 'test@test.com',
        password: 'test',
        name: 'test'
      }

      const entry = uut.validate(inputData)
      // console.log('entry: ', entry)

      assert.property(entry, 'email')
      assert.equal(entry.email, inputData.email)

      assert.property(entry, 'password')
      assert.equal(entry.password, inputData.password)

      assert.property(entry, 'name')
      assert.equal(entry.name, inputData.name)
    })
    it('should return a User object with maximum inputs', () => {
      const inputData = {
        email: 'test@test.com',
        password: 'test',
        name: 'test',
        profilePictureUrl: 'https://example.com/profile.jpg',
        about: 'I am a test user',
        website: 'https://example.com'
      }

      const entry = uut.validate(inputData)
      // console.log('entry: ', entry)

      assert.property(entry, 'email')
      assert.equal(entry.email, inputData.email)

      assert.property(entry, 'password')
      assert.equal(entry.password, inputData.password)

      assert.property(entry, 'name')
      assert.equal(entry.name, inputData.name)

      assert.property(entry, 'profilePictureUrl')
      assert.equal(entry.profilePictureUrl, inputData.profilePictureUrl)

      assert.property(entry, 'about')
      assert.equal(entry.about, inputData.about)

      assert.property(entry, 'website')
      assert.equal(entry.website, inputData.website)
    })
  })
})
