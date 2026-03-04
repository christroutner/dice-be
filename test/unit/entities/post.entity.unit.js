/*
  Unit tests for the Post entity library.
*/

import { assert } from 'chai'

import sinon from 'sinon'
import Post from '../../../src/entities/post.js'

let sandbox
let uut

describe('#Post-Entity', () => {
  before(async () => { })

  beforeEach(() => {
    uut = new Post()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#validate', () => {
    it('should throw an error if ownerId is not provided', () => {
      try {
        uut.validate()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'ownerId' must be a string!")
      }
    })
    it('should throw an error if ownerId is not a string', () => {
      try {
        uut.validate({ ownerId: 123 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'ownerId' must be a string!")
      }
    })

    it('should throw an error if postContent is not provided', () => {
      try {
        uut.validate({ ownerId: '123' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'postContent' must be a string!")
      }
    })

    it('should throw an error if provided postContent is not a string', () => {
      try {
        uut.validate({ ownerId: '123', postContent: 1234 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'postContent' must be a string!")
      }
    })
    it('should throw an error if provided mediaUrls is not an array', () => {
      try {
        uut.validate({ ownerId: '123', postContent: '1234', mediaUrls: 'test' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'mediaUrls' must be an array!")
      }
    })
    it('should return a Post object', () => {
      const inputData = {
        ownerId: '123',
        postContent: 'test'
      }
      const entry = uut.validate(inputData)
      assert.equal(entry.ownerId, inputData.ownerId)
      assert.equal(entry.postContent, inputData.postContent)
      assert.equal(entry.likes.length, 0)
    })
  })
})
