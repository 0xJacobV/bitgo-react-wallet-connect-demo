import NextAuth, { NextAuthOptions } from 'next-auth'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: 'bitgo',
      name: 'BitGo',
      type: 'oauth',
      checks: ['pkce', 'state'],
      clientId: 'com.bitgo.testwebapp',
      client: {
        token_endpoint_auth_method: 'none'
      },
      authorization: { params: { scope: 'openid' } },
      idToken: true,
      wellKnown: 'https://identity.bitgo-test.com/realms/bitgo/.well-known/openid-configuration',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email
        }
      }
    }
  ],
  theme: {
    colorScheme: 'light'
  },
  // pages: {
  //   signIn: 'auth/signin'
  // },
  secret: '3cLDy19y9OC/FPbop6lw/sxDhpH4TWpFmeGobObL1Po='
}

export default NextAuth(authOptions)
