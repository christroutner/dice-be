/*
  Unit tests for the Comment entity library.
*/

import { assert } from 'chai'

import sinon from 'sinon'
import Comment from '../../../src/entities/comment.js'

let sandbox
let uut

describe('#Comment-Entity', () => {
  before(async () => { })

  beforeEach(() => {
    uut = new Comment()

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

    it('should throw an error if commentContent is not provided', () => {
      try {
        uut.validate({ ownerId: '123' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'commentContent' must be a string!")
      }
    })

    it('should throw an error if provided commentContent is not a string', () => {
      try {
        uut.validate({ ownerId: '123', commentContent: 1234 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'commentContent' must be a string!")
      }
    })
    it('should throw an error if parentId is not provided', () => {
      try {
        uut.validate({ ownerId: '123', commentContent: 'test' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentId' must be a string!")
      }
    })
    it('should throw an error if parentId is not a string', () => {
      try {
        uut.validate({ ownerId: '123', commentContent: 'test', parentId: 123 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentId' must be a string!")
      }
    })
    it('should throw an error if parentType is not provided', () => {
      try {
        uut.validate({ ownerId: '123', commentContent: 'test', parentId: '123' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentType' must be a string!")
      }
    })
    it('should throw an error if parentType is not a string', () => {
      try {
        uut.validate({ ownerId: '123', commentContent: 'test', parentId: '123', parentType: 123 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentType' must be a string!")
      }
    })
    it('should throw an error if parentType is not a string', () => {
      try {
        uut.validate({ ownerId: '123', commentContent: 'test', parentId: '123', parentType: 123 })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentType' must be a string!")
      }
    })

    it('should throw an error if parentType is not a valid parent type', () => {
      try {
        uut.validate({ ownerId: '123', commentContent: 'test', parentId: '123', parentType: 'invalid' })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentType' must be 'post' or 'comment'!")
      }
    })
    it('should return a Comment object for post parent type', () => {
      const inputData = {
        ownerId: '123',
        commentContent: 'test',
        parentId: '123',
        parentType: 'post'

      }
      const entry = uut.validate(inputData)
      assert.equal(entry.ownerId, inputData.ownerId)
      assert.equal(entry.commentContent, inputData.commentContent)
      assert.equal(entry.parentId, inputData.parentId)
      assert.equal(entry.parentType, inputData.parentType)
      assert.equal(entry.likes.length, 0)
    })
    it('should return a Comment object for comment parent type', () => {
      const inputData = {
        ownerId: '123',
        commentContent: 'test',
        parentId: '123',
        parentType: 'comment'
      }
      const entry = uut.validate(inputData)
      assert.equal(entry.ownerId, inputData.ownerId)
      assert.equal(entry.commentContent, inputData.commentContent)
      assert.equal(entry.parentId, inputData.parentId)
      assert.equal(entry.parentType, inputData.parentType)
      assert.equal(entry.likes.length, 0)
    })
  })
})
