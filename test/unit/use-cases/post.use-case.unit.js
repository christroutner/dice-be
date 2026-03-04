/*
  Unit tests for the src/lib/posts.js business logic library.

  TODO: verify that an admin can change the type of a user
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
// const testUtils = require('../../utils/test-utils')

// Unit under test (uut)
import PostLib from '../../../src/use-cases/post.js'

import adapters from '../mocks/adapters/index.js'

describe('#posts-use-case', () => {
  let uut
  let sandbox

  before(async () => {
    // Delete all previous users in the database.
    // await testUtils.deleteAllUsers()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new PostLib({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new PostLib()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating Post Use Cases library.'
        )
      }
    })
  })

  describe('#createPost', () => {
    it('should throw an error if no input is given', async () => {
      try {
        await uut.createPost()

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        // assert.equal(err.status, 422)
        assert.include(err.message, "Property 'ownerId' must be a string!")
      }
    })

    it('should throw an error if email is not provided', async () => {
      try {
        await uut.createPost({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'ownerId' must be a string!")
      }
    })

    it('should throw an error if postContent is not provided', async () => {
      try {
        const usrObj = {
          ownerId: '123'
        }

        await uut.createPost(usrObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'postContent' must be a string!")
      }
    })

    it('should throw an error if provided postContent is not a string', async () => {
      try {
        const usrObj = {
          ownerId: '123',
          postContent: 1234
        }

        await uut.createPost(usrObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'postContent' must be a string!")
      }
    })

    it('should catch and throw DB errors', async () => {
      try {
        // Force an error with the database.
        sandbox.stub(uut, 'PostModel').throws(new Error('test error'))

        const postObj = {
          ownerId: '123',
          postContent: 'test'
        }

        await uut.createPost(postObj)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })

    it('should create a new post in the DB', async () => {
      const postObj = {
        ownerId: '123',
        postContent: 'test',
        likes: ['123']
      }

      const post = await uut.createPost(postObj)
      assert.isObject(post)
    })
  })

  describe('#getAllPosts', () => {
    it('should return all posts from the database', async () => {
      const posts = await uut.getAllPosts()
      // console.log(`posts: ${JSON.stringify(posts, null, 2)}`)

      assert.isArray(posts)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error.
        sandbox.stub(uut.PostModel, 'find').rejects(new Error('test error'))

        await uut.getAllPosts()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#getPost', () => {
    it('should throw 422 if no id given.', async () => {
      try {
        await uut.getPost()

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
          .stub(uut.PostModel, 'findById')
          .rejects(new Error('Unprocessable Entity'))

        const params = { id: 1 }
        await uut.getPost(params)

        assert.fail('Unexpected code path.')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'Unprocessable Entity')
      }
    })

    it('should throw 404 if post is not found', async () => {
      try {
        sandbox.stub(uut.PostModel, 'findById').resolves(null)
        const params = { id: '5fa4bd7ee1828f5f4d3ed004' }
        await uut.getPost(params)

        assert.fail('Unexpected code path.')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'Post not found')
      }
    })

    it('should return the post model', async () => {
      sandbox.stub(uut.PostModel, 'findById').resolves({ _id: 'abc123' })

      const params = { id: 'abc123' }
      const result = await uut.getPost(params)

      assert.isObject(result)
    })
  })

  describe('#updatePost', () => {
    it('should throw an error if postContent is not a string', async () => {
      try {
        await uut.updatePost({ _id: 'abc123' }, {
          postContent: 1234
        })

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, "Property 'postContent' must be a string!")
      }
    })

    it('should throw an error if likes is not an array', async () => {
      try {
        const newData = {
          likes: 1234
        }

        await uut.updatePost({ _id: 'abc123' }, newData)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, "Property 'likes' must be an array!")
      }
    })

    it('should update the post model', async () => {
      const newData = {
        postContent: 'test updated',
        likes: ['123']
      }

      const existingPost = { _id: 'abc123', save: () => { } }

      const post = await uut.updatePost(existingPost, newData)

      assert.isObject(post)
      assert.equal(post.postContent, 'test updated')
      assert.equal(post.likes.length, 1)
    })
  })
  describe('#getHydratedPosts', () => {
    it('shound handle errors', async () => {
      try {
        const fakeFind = {
          populate: () => {
            return {
              lean: () => {
                throw new Error('test error')
              }
            }
          }
        }
        sandbox.stub(uut.PostModel, 'find').returns(fakeFind)
        await uut.getHydratedPosts()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
    it('should return all hydrated posts from the database', async () => {
      const fakeFind = {
        populate: () => {
          return {
            lean: () => [{ _id: 'abc123' }]
          }
        }
      }
      sandbox.stub(uut.PostModel, 'find').returns(fakeFind)
      sandbox.stub(uut.CommentModel, 'countDocuments').resolves(1)
      const posts = await uut.getHydratedPosts()
      assert.isArray(posts)
    })
  })
  describe('#getHydratedPost', () => {
    it('should throw an error if no post id provided', async () => {
      try {
        await uut.getHydratedPost()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Post ID is required')
      }
    })
    it('should throw an error if post not found', async () => {
      try {
        const fakeFind = {
          populate: () => {
            return {
              lean: () => {
                return null
              }
            }
          }
        }
        sandbox.stub(uut.PostModel, 'findOne').returns(fakeFind)
        await uut.getHydratedPost('123')
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Post not found')
      }
    })
    it('should return the hydrated post', async () => {
      const fakeFind = {
        populate: () => {
          return {
            lean: () => {
              return { _id: 'abc123' }
            }
          }
        }
      }
      sandbox.stub(uut.PostModel, 'findOne').returns(fakeFind)
      sandbox.stub(uut.CommentModel, 'countDocuments').resolves(1)
      const post = await uut.getHydratedPost('abc123')
      assert.isObject(post)
    })
  })
  describe('#deletePost', () => {
    it('should delete the post from the database', async () => {
      const testPost = { _id: 'abc123', remove: () => {} }
      await uut.deletePost(testPost)

      assert.isOk('Not throwing an error is a pass!')
    })
  })
  it('should throw an error if no post provided', async () => {
    try {
      await uut.deletePost()

      assert.fail('Unexpected code path')
    } catch (err) {
      assert.include(err.message, 'Cannot read')
    }
  })
})
