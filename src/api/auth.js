import express from 'express'
const router = express.Router()
import saml from 'passport-saml'
import fs from 'fs'

router.get('/', async (req, res) => {
  res.render('auth')
})

const samlStrategy = new saml.Strategy(
  {
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: process.env.CALLBACK_URL,
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: process.env.ENTRY_POINT,
    // Usually specified as `/shibboleth` from site root
    issuer: process.env.ISSUER,
    identifierFormat: null,
    // Service Provider private key
    decryptionPvk: fs.readFileSync(__dirname + '/../../certs/key.pem', 'utf8'),
    // Service Provider Certificate
    privateCert: fs.readFileSync(__dirname + '/../../certs/key.pem', 'utf8'),
    // Identity Provider's public key
    cert: fs.readFileSync(__dirname + '/../../certs/idp_cert.pem', 'utf8'),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
  },
  (profile, done) => done(null, profile)
)

const ensureAuthenticated = (req, res, next) =>
  next() ? req.isAuthenticated() : res.redirect('/auth')

export { samlStrategy, ensureAuthenticated }
export default router
