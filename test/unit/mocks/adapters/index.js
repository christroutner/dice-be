/*
  Mocks for the Adapter library.
*/

class IpfsAdapter {
  constructor () {
    this.ipfs = {
      files: {
        stat: () => {}
      }
    }
  }
}

class IpfsCoordAdapter {
  constructor () {
    this.ipfsCoord = {
      adapters: {
        ipfs: {
          connectToPeer: async () => {}
        }
      },
      useCases: {
        peer: {
          sendPrivateMessage: () => {}
        }
      },
      thisNode: {}
    }
  }
}

const ipfs = {
  ipfsAdapter: new IpfsAdapter(),
  ipfsCoordAdapter: new IpfsCoordAdapter(),
  getStatus: async () => {},
  getPeers: async () => {},
  getRelays: async () => {}
}
ipfs.ipfs = ipfs.ipfsAdapter.ipfs

const localdb = {
  Users: class Users {
    static findById () {}
    static find () {}
    static findOne () {
      return {
        validatePassword: localdb.validatePassword
      }
    }

    async save () {
      return {}
    }

    generateToken () {
      return '123'
    }

    toJSON () {
      return {}
    }

    async remove () {
      return true
    }

    async validatePassword () {
      return true
    }
  },

  Posts: class Posts {
    static findById () {}
    static find () { return [] }
    static findOne () {
      return {}
    }

    async save () {
      return {}
    }


    toJSON () {
      return {}
    }

    async remove () {
      return true
    }

    static async countDocuments () {
      return 1
    }

  },
    Comments: class Comments {
    static findById () {}
    static find () { return [] }
    static findOne () {
      return {}
    }

    async save () {
      return {}
    }


    toJSON () {
      return {}
    }

    async remove () {
      return true
    }
    static async countDocuments () {
      return 1
    }

  },


  Usage: class Usage {
    static findById () {}
    static find () {}
    static findOne () {
      return {
        validatePassword: localdb.validatePassword
      }
    }

    async save () {
      return {}
    }

    generateToken () {
      return '123'
    }

    toJSON () {
      return {}
    }

    async remove () {
      return true
    }

    async validatePassword () {
      return true
    }
    static async deleteMany(){
      return true
    }
  },
  

  validatePassword: () => {
    return true
  }
}

export default { ipfs, localdb };
