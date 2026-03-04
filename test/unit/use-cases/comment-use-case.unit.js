/*
  Unit tests for the src/lib/comments.js business logic library.

*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
// const testUtils = require('../../utils/test-utils')

// Unit under test (uut)
import CommentLib from '../../../src/use-cases/comment.js'

import adapters from '../mocks/adapters/index.js'

describe('#comments-use-case', () => {
  let uut
  let sandbox

  before(async () => {
    // Delete all previous users in the database.
    // await testUtils.deleteAllUsers()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new CommentLib({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new CommentLib()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating Comment Use Cases library.'
        )
      }
    })
  })

  describe('#createComment', () => {
    it('should throw an error if no input is given', async () => {
      try {
        await uut.createComment()

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        // assert.equal(err.status, 422)
        assert.include(err.message, "Property 'ownerId' must be a string!")
      }
    })

    it('should throw an error if email is not provided', async () => {
      try {
        await uut.createComment({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'ownerId' must be a string!")
      }
    })

    it('should throw an error if commentContent is not provided', async () => {
      try {
        const usrObj = {
          ownerId: '123'
        }

        await uut.createComment(usrObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'commentContent' must be a string!")
      }
    })

    it('should throw an error if provided postContent is not a string', async () => {
      try {
        const usrObj = {
          ownerId: '123',
          commentContent: 1234
        }

        await uut.createComment(usrObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'commentContent' must be a string!")
      }
    })

    it('should catch and throw DB errors', async () => {
      try {
        // Force an error with the database.
        sandbox.stub(uut, 'CommentModel').throws(new Error('test error'))

        const commentObj = {
          ownerId: '123',
          commentContent: 'test',
          parentId: '123',
          parentType: 'post'
        }

        await uut.createComment(commentObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })

    it('should create a new comment in the DB', async () => {
      const commentObj = {
        ownerId: '123',
        commentContent: 'test',
        parentId: '123',
        parentType: 'post'
      }

      const comment = await uut.createComment(commentObj)
      assert.isObject(comment)
    })
  })

  describe('#getAllComments', () => {
    it('should return all comments from the database', async () => {
      const comments = await uut.getAllComments()
      // console.log(`comments: ${JSON.stringify(comments, null, 2)}`)

      assert.isArray(comments)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error.
        sandbox.stub(uut.CommentModel, 'find').rejects(new Error('test error'))

        await uut.getAllComments()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#getComment', () => {
    it('should throw 422 if no id given.', async () => {
      try {
        await uut.getComment()

        assert.fail('Unexpected code path.')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'Unprocessable Entity')
      }
    })

    it('should throw 422 for malformed id', async () => {
      try {
        // Force an error.
        sandbox
          .stub(uut.CommentModel, 'findById')
          .rejects(new Error('Unprocessable Entity'))

        const params = { id: 1 }
        await uut.getComment(params)

        assert.fail('Unexpected code path.')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'Unprocessable Entity')
      }
    })

    it('should throw 404 if comment is not found', async () => {
      try {
        sandbox.stub(uut.CommentModel, 'findById').resolves(null)
        const params = { id: '5fa4bd7ee1828f5f4d3ed004' }
        await uut.getComment(params)

        assert.fail('Unexpected code path.')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'Comment not found')
      }
    })

    it('should return the comment model', async () => {
      sandbox.stub(uut.CommentModel, 'findById').resolves({ _id: 'abc123' })

      const params = { id: 'abc123' }
      const result = await uut.getComment(params)

      assert.isObject(result)
    })
  })

  describe('#updateComment', () => {
    it('should throw an error if parentId is provided ', async () => {
      try {
        const existingComment = { _id: 'abc123', save: () => { } }
        await uut.updateComment(existingComment, {
          parentId: '123'
        })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentId' is not allowed to be updated!")
      }
    })
    it('should throw an error if parentType is provided ', async () => {
      try {
        const existingComment = { _id: 'abc123', save: () => { } }
        await uut.updateComment(existingComment, {
          parentType: 'post'
        })
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentType' is not allowed to be updated!")
      }
    })
    it('should throw an error if commentContent is not a string', async () => {
      try {
        const existingComment = { _id: 'abc123', save: () => { } }
        await uut.updateComment(existingComment, {
          commentContent: 1234
        })

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, "Property 'commentContent' must be a string!")
      }
    })

    it('should throw an error if likes is not an array', async () => {
      try {
        const existingComment = { _id: 'abc123', save: () => { } }
        const newData = {
          commentContent: 'test',

          likes: 1234
        }

        await uut.updateComment(existingComment, newData)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, "Property 'likes' must be an array!")
      }
    })

    it('should update the comment model', async () => {
      const newData = {
        commentContent: 'test comment updated',
        likes: ['123']
      }

      const existingComment = { _id: 'abc123', save: () => { } }

      const comment = await uut.updateComment(existingComment, newData)

      assert.isObject(comment)
      assert.equal(comment.commentContent, 'test comment updated')
      assert.equal(comment.likes.length, 1)
    })
  })
  describe('#getCommentsByParentId', () => {
    it('should return all comments by parent id', async () => {
      const fakeFind = {
        populate: () => {
          return [{ _id: 'abc123' }]
        }
      }
      sandbox.stub(uut.CommentModel, 'find').returns(fakeFind)
      const comments = await uut.getCommentsByParentId('abc123')
      assert.isArray(comments)
    })
    it('should throw an error if no parent id provided', async () => {
      try {
        await uut.getCommentsByParentId()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentId' must be a string!")
      }
    })
    it('should throw an error if parent id is not a string', async () => {
      try {
        await uut.getCommentsByParentId(123)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'parentId' must be a string!")
      }
    })
  })

  describe('#deleteComment', () => {
    it('should delete the comment from the database', async () => {
      const testComment = { _id: 'abc123', remove: () => {} }
      await uut.deleteComment(testComment)

      assert.isOk('Not throwing an error is a pass!')
    })
  })
  it('should throw an error if no comment provided', async () => {
    try {
      await uut.deleteComment()

      assert.fail('Unexpected code path')
    } catch (err) {
      assert.include(err.message, 'Cannot read properties')
    }
  })
})
