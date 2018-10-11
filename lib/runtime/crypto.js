const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')
const EnvManager = require('../env-manager')
const Ast = require('../node/ast')
const CryptoJS = require('crypto-js')
const Crypto = require('crypto')

const ApexCrypto = new Ast.ApexClass(
  'Crypto',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    decrypt: [
      createMethodNode(
        'decrypt',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'initializationVector'],
          ['Blob', 'cipherText']
        ],
        () => {
          const algorithmName = EnvManager.getValue('algorithmName').value

          const initializationVectorBlob = EnvManager.getValue('initializationVector').value
          const initializationVector = CryptoJS.enc.Hex.parse(initializationVectorBlob.toString('hex'))
          const cipherTextBlob = EnvManager.getValue('cipherText').value
          const cipherText = CryptoJS.enc.Hex.parse(cipherTextBlob.toString('hex'))
          const privateKeyBlob = EnvManager.getValue('privateKey').value
          const privateKey = CryptoJS.enc.Hex.parse(privateKeyBlob.toString('hex'))

          const algorithmFunctions = ['AES128', 'AES192', 'AES256']
          if (!algorithmFunctions.includes(algorithmName)) {
            throw new Error(`Invalid Crypto Algorithm`)
          }
          const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherText }, privateKey, { iv: initializationVector })
          const buf = Buffer.from(decrypted.toString(), 'hex')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    decryptWithManagedIV: [
      createMethodNode(
        'decryptWithManagedIV',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'IVAndCipherText']
        ],
        () => {
          const algorithmName = EnvManager.getValue('algorithmName').value

          const IVAndCipherTextBlob = EnvManager.getValue('IVAndCipherText').value
          const ivBlob = IVAndCipherTextBlob.slice(0, 16)
          const iv = CryptoJS.enc.Hex.parse(ivBlob.toString('hex'))
          const cipherTextBlob = IVAndCipherTextBlob.slice(16, 32)
          const cipherText = CryptoJS.enc.Hex.parse(cipherTextBlob.toString('hex'))

          const privateKeyBlob = EnvManager.getValue('privateKey').value
          const privateKey = CryptoJS.enc.Hex.parse(privateKeyBlob.toString('hex'))

          const algorithmFunctions = ['AES128', 'AES192', 'AES256']
          if (!algorithmFunctions.includes(algorithmName)) {
            throw new Error(`Invalid Crypto Algorithm`)
          }
          const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherText }, privateKey, { iv: iv })
          const buf = Buffer.from(decrypted.toString(), 'hex')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    encrypt: [
      createMethodNode(
        'encrypt',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'initializationVector'],
          ['Blob', 'clearText']
        ],
        () => {
          const algorithmName = EnvManager.getValue('algorithmName').value
          const cipherTextBlob = EnvManager.getValue('clearText').value
          const cipherText = CryptoJS.enc.Hex.parse(cipherTextBlob.toString('hex'))
          const privateKeyBlob = EnvManager.getValue('privateKey').value
          const privateKey = CryptoJS.enc.Hex.parse(privateKeyBlob.toString('hex'))
          const initializationVectorBlob = EnvManager.getValue('initializationVector').value
          const initializationVector = CryptoJS.enc.Hex.parse(initializationVectorBlob.toString('hex'))

          const algorithmFunctions = ['AES128', 'AES192', 'AES256']
          if (!algorithmFunctions.includes(algorithmName)) {
            throw new Error(`Invalid Crypto Algorithm`)
          }
          const encrypted = CryptoJS.AES.encrypt(cipherText, privateKey, { iv: initializationVector })
          const buf = Buffer.from(encrypted.ciphertext.toString(), 'hex')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    encryptWithManagedIV: [
      createMethodNode(
        'encryptWithManagedIV',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'clearText']
        ],
        () => {
          const algorithmName = EnvManager.getValue('algorithmName').value
          const cipherTextBlob = EnvManager.getValue('clearText').value
          const cipherText = CryptoJS.enc.Hex.parse(cipherTextBlob.toString('hex'))
          const privateKeyBlob = EnvManager.getValue('privateKey').value
          const privateKey = CryptoJS.enc.Hex.parse(privateKeyBlob.toString('hex'))
          const iv = CryptoJS.enc.Hex.parse(Crypto.randomBytes(16).toString('hex'))

          const algorithmFunctions = ['AES128', 'AES192', 'AES256']
          if (!algorithmFunctions.includes(algorithmName)) {
            throw new Error(`Invalid Crypto Algorithm`)
          }
          const encrypted = CryptoJS.AES.encrypt(cipherText, privateKey, { iv: iv })
          const buf = Buffer.from(
            encrypted.iv.toString() + encrypted.ciphertext.toString(),
            'hex'
          )
          return new Ast.BlobNode(buf)
        }
      )
    ],
    generateAesKey: [
      createMethodNode(
        'generateAesKey',
        ['public'],
        'Blob',
        [
          ['Integer', 'size']
        ],
        () => {
          const size = EnvManager.getValue('size').value
          return new Ast.IntegerNode(Crypto.randomBytes(size))
        }
      )
    ],
    generateDigest: [
      createMethodNode(
        'generateDigest',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'input']
        ],
        () => {
          const algorithmName = EnvManager.getValue('algorithmName').value
          const input = EnvManager.getValue('input').value
          const source = CryptoJS.enc.Hex.parse(input.toString('hex'))

          const algorithmFunctions = {
            MD5: CryptoJS.MD5,
            SHA1: CryptoJS.SHA1,
            'SHA-256': CryptoJS.SHA256,
            'SHA-512': CryptoJS.SHA512
          }
          const hashFunction = algorithmFunctions[algorithmName]
          if (!hashFunction) {
            throw new Error(`Invalid Hash Algorithm`)
          }
          const digest = hashFunction.call(CryptoJS, source)
          const buf = Buffer.from(digest.toString(), 'hex')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    generateMac: [
      createMethodNode(
        'generateMac',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'input'],
          ['Blob', 'privateKey']
        ],
        () => {
          const algorithmName = EnvManager.getValue('algorithmName').value
          const input = EnvManager.getValue('input').value
          const source = CryptoJS.enc.Hex.parse(input.toString('hex'))
          const privateKeyBlob = EnvManager.getValue('privateKey').value
          const privateKey = CryptoJS.enc.Hex.parse(privateKeyBlob.toString('hex'))

          const algorithmFunctions = {
            hmacMD5: CryptoJS.HmacMD5,
            hmacSHA1: CryptoJS.HmacSHA1,
            hmacSHA256: CryptoJS.HmacSHA256,
            hmacSHA512: CryptoJS.HmacSHA512
          }
          const hashFunction = algorithmFunctions[algorithmName]
          if (!hashFunction) {
            throw new Error(`Invalid Hash Algorithm`)
          }
          const hmac = hashFunction.call(CryptoJS, source, privateKey)
          const buf = Buffer.from(hmac.toString(), 'hex')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    getRandomInteger: [
      createMethodNode(
        'getRandomInteger',
        ['public'],
        'Integer',
        [],
        () => {
          const min = -2147483648
          const max = 2147483647
          const value = Math.floor(Math.random() * (max - min)) + min
          return new Ast.IntegerNode(value)
        }
      )
    ],
    getRandomLong: [
      createMethodNode(
        'getRandomLong',
        ['public'],
        'Long',
        [],
        () => {
          const min = -(2 ** 63)
          const max = 2 ** 63 - 1
          const value = Math.floor(Math.random() * (max - min)) + min
          return new Ast.IntegerNode(value)
        }
      )
    ],
    sign: [
      createMethodNode(
        'sign',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'input'],
          ['Blob', 'privateKey']
        ],
        () => {
          const algorithmName = EnvManager.getValue('algorithmName').value
          const input = EnvManager.getValue('input').value
          const source = CryptoJS.enc.Hex.parse(input.toString('hex'))
          const privateKeyBlob = EnvManager.getValue('privateKey').value
          const privateKey = CryptoJS.enc.Hex.parse(privateKeyBlob.toString('hex'))

          const algorithmFunctions = {
            hmacMD5: CryptoJS.HmacMD5,
            hmacSHA1: CryptoJS.HmacSHA1,
            hmacSHA256: CryptoJS.HmacSHA256,
            hmacSHA512: CryptoJS.HmacSHA512
          }
          const hashFunction = algorithmFunctions[algorithmName]
          if (!hashFunction) {
            throw new Error(`Invalid Hash Algorithm`)
          }
          const hmac = hashFunction.call(CryptoJS, source, privateKey)
          const buf = Buffer.from(hmac.toString(), 'hex')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    signWithCertificate: [
      createMethodNode(
        'signWithCertificate',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'input'],
          ['String', 'certDevName']
        ],
        () => {
        }
      )
    ],

    signXML: [
      createMethodNode(
        'signXML',
        ['public'],
        'void',
        [
          ['String', 'algorithmName'],
          [['Dom', 'XmlNode'], 'node'],
          ['String', 'idAttributeName'],
          ['String', 'certDevName']
        ],
        () => {
        }
      ),
      createMethodNode(
        'signXML',
        ['public'],
        'void',
        [
          ['String', 'algorithmName'],
          [['Dom', 'XmlNode'], 'node'],
          ['String', 'idAttributeName'],
          ['String', 'certDevName'],
          [['Dom', 'XmlNode'], 'refChild']
        ],
        () => {
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', ApexCrypto)

module.exports = ApexCrypto
