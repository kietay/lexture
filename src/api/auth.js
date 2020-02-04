import express from 'express'
const router = express.Router()
import saml from 'passport-saml'
import fs from 'fs'
import passport from 'passport'

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

// these keys will be used when moving from test to production identity provider
// const pk = fs.readFileSync(__dirname + '/../../cert/key.pem', 'utf8')
// const pCert = fs.readFileSync(__dirname + '/../../cert/server.crt', 'utf8')
// const idpCert = fs.readFileSync(__dirname + '/../../cert/cornell-idp.cer', 'utf8')

const samlStrategy = new saml.Strategy(
  {
    path: process.env.CALLBACK_URL,
    entryPoint: process.env.ENTRY_POINT,
    issuer: process.env.ISSUER,
    // decryptionPvk: pk,
    // privateCert: pCert,
    // cert: idpCert,
    // validateInResponseTo: false,
    // disableRequestedAuthnContext: true,
  },
  (profile, done) => done(null, profile)
)

passport.use(samlStrategy)

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  else return res.redirect('/auth')
}

router.get('/', async (req, res) => {
  res.render('auth')
})

router.all(
  '/cornell',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  (req, res) => res.redirect('/')
)

export { samlStrategy, ensureAuthenticated, passport }
export default router
