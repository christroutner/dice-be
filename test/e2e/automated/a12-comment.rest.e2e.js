/**
 * End-to-end tests for /comment endpoints.
 *
 */
import testUtils from '../../utils/test-utils.js'
import { assert } from 'chai'
import config from '../../../config/index.js'
import axios from 'axios'
import sinon from 'sinon'
import util from 'util'

util.inspect.defaultOptions = { depth: 1 }

const LOCALHOST = `http://localhost:${config.port}`

const context = {
  postId: 'mock-post-id',
  commentId: 'mock-comment-id'
}
let sandbox

// const mockContext = require('../../unit/mocks/ctx-mock').context

if (!config.noMongo) {
  describe('Comments', () => {
    before(async () => {
      // console.log(`config: ${JSON.stringify(config, null, 2)}`)

      // Create a second test user.
      const userObj = {
        email: 'test-comment@test.com',
        password: 'pass2',
        name: 'test2'
      }
      const userObj2 = {
        email: 'test-comment2@test.com',
        password: 'pass3',
        name: 'test3'
      }
      const testUser = await testUtils.createUser(userObj)
      const testUser2 = await testUtils.createUser(userObj2)

      // console.log(`testUser2: ${JSON.stringify(testUser, null, 2)}`)
      context.user = testUser.user
      context.token = testUser.token
      context.id = testUser.user._id

      context.user2 = testUser2.user
      context.token2 = testUser2.token
      context.id2 = testUser2.user._id

      // Get the JWT used to log in as the admin 'system' user.
      const adminJWT = await testUtils.getAdminJWT()
      context.adminJWT = adminJWT

      // const admin = await testUtils.loginAdminUser()
      // context.adminJWT = admin.token

      // const admin = await adminLib.loginAdmin()
      // console.log(`admin: ${JSON.stringify(admin, null, 2)}`)
    })

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    afterEach(() => sandbox.restore())

    describe('POST /comment - Create comment', () => {
      it('should not create  if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/comment`,
            data: {
              comment: {
                ownerId: context.user._id,
                commentContent: 'This is a test comment'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not create a comment if the authorization header is missing the scheme', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/comment`,
            data: {
              comment: {
                ownerId: context.user._id,
                createdAt: new Date(),
                commentContent: 'This is a test comment'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not create a comment if the authorization header has invalid scheme', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/comment`,
            data: {
              comment: {
                ownerId: context.user._id,
                createdAt: new Date(),
                commentContent: 'This is a test comment'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not create a comment if the token is invalid', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/comment`,
            data: {
              comment: {
                ownerId: context.user._id,
                createdAt: new Date(),
                commentContent: 'This is a test comment'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should create a comment', async () => {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/comment`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.token}`
          },
          data: {
            comment: {
              ownerId: context.user._id,
              commentContent: 'This is a test comment',
              parentId: context.postId,
              parentType: 'post'
            }
          }
        }
        const result = await axios(options)
        assert.equal(result.status, 200)
        assert.equal(result.data.comment.ownerId, context.user._id)
        assert.equal(result.data.comment.commentContent, 'This is a test comment')
        assert.equal(result.data.comment.likes.length, 0)
        assert.property(result.data.comment, 'createdAt')

        context.commentId = result.data.comment._id
      })
    })

    describe('GET /comment', () => {
      it('should not get a comment if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }

          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a comment if the authorization header has invalid scheme', async () => {
        const { token } = context
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a comment if token is invalid', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should get all comments', async () => {
        const { token } = context

        const options = {
          method: 'GET',
          url: `${LOCALHOST}/comment`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
        const result = await axios(options)
        const comment = result.data.comments[0]
        // console.log(`users: ${util.inspect(users)}`)

        assert.hasAnyKeys(comment, ['ownerId', 'createdAt', 'commentContent', 'likes'])
      })
    })

    describe('GET /comment/:id', () => {
      it('should not get a post if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/1`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a comment if the authorization header has invalid scheme', async () => {
        const { token } = context
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/1`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a comment if token is invalid', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/1`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it("should throw 404 if comment doesn't exist", async () => {
        const { token } = context

        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 404)
        }
      })

      it('should throw 422 for invalid comment id', async () => {
        const { token } = context

        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/1`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 422)
        }
      })

      it('should get a comment', async () => {
        const _id = context.commentId
        const token = context.token

        const options = {
          method: 'GET',
          url: `${LOCALHOST}/comment/${_id}`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
        const result = await axios(options)

        const comment = result.data.comment
        // console.log(`user: ${util.inspect(user)}`)

        assert.property(comment, 'ownerId')
        assert.property(comment, 'createdAt')
        assert.property(comment, 'commentContent')
        assert.property(comment, 'parentId')
        assert.property(comment, 'parentType')
        assert.property(comment, 'likes')
      })
    })

    describe('PUT /comment/:id', () => {
      it('should not update a comment if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/comment/1`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a comment if the authorization header has invalid scheme', async () => {
        const { token } = context
        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/comment/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not update a comment if token is invalid', async () => {
        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/comment/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it("should not update a comment if comment doesn't exist", async () => {
        const { token } = context

        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/comment/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 404)
        }
      })

      it('should not update a comment if comment id is invalid', async () => {
        const { token } = context

        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/comment/1`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 422)
        }
      })

      it('should update a comment when owner', async () => {
        const options = {
          method: 'PUT',
          url: `${LOCALHOST}/comment/${context.commentId}`,
          headers: {
            Authorization: `Bearer ${context.token}`
          },
          data: {
            comment: {
              commentContent: 'This is a test comment updated',
              likes: [`${context.user._id}`]
            }
          }
        }
        const result = await axios(options)
        assert.equal(result.status, 200)
        assert.equal(result.data.comment.commentContent, 'This is a test comment updated')
        assert.equal(result.data.comment.likes.length, 1)
        assert.property(result.data.comment, 'updatedAt')
      })

      it('should update a comment when admin', async () => {
        const options = {
          method: 'PUT',
          url: `${LOCALHOST}/comment/${context.commentId}`,
          headers: {
            Authorization: `Bearer ${context.adminJWT}`
          },
          data: {
            comment: {
              commentContent: 'This is a test comment updated by admin',
              likes: []
            }
          }
        }

        const result = await axios(options)
        // console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

        assert.equal(result.status, 200)
        assert.equal(result.data.comment.commentContent, 'This is a test comment updated by admin')
        assert.equal(result.data.comment.likes.length, 0)
        assert.property(result.data.comment, 'updatedAt')
      })
    })

    describe('GET /comment/parent/:id', () => {
      it('should not get comments by parent id if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/parent/1`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should not get comments by parent id if the authorization header has invalid scheme', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/parent/1`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should not get comments by parent id if token is invalid', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/comment/parent/${context.postId}`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should get comments by parent id', async () => {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/comment/parent/${context.postId}`,
          headers: {
            Authorization: `Bearer ${context.token}`
          }
        }
        const result = await axios(options)
        const comment = result.data.comments[0]
        assert.property(comment, 'ownerId')
        assert.property(comment, 'createdAt')
        assert.property(comment, 'commentContent')
        assert.property(comment, 'parentId')
        assert.property(comment, 'parentType')
        assert.property(comment, 'likes')
      })
    })
    describe('DELETE /comment/:id', () => {
      it('should not delete a comment if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'DELETE',
            url: `${LOCALHOST}/comment/${context.commentId}`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not delete a comment if the authorization header has invalid scheme', async () => {
        const { token } = context

        try {
          const options = {
            method: 'DELETE',
            url: `${LOCALHOST}/comment/${context.commentId}`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not delete a comment if token is invalid', async () => {
        try {
          const options = {
            method: 'DELETE',
            url: `${LOCALHOST}/comment/${context.commentId}`,
            headers: {
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should delete a comment', async () => {
        const options = {
          method: 'DELETE',
          url: `${LOCALHOST}/comment/${context.commentId}`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.token}`
          }
        }
        const result = await axios(options)
        // console.log(`result: ${util.inspect(result.data.comment)}`)

        assert.equal(result.status, 200)
      })
    })
  })
}
