import NextAuth, { NextAuthOptions, TokenSet } from 'next-auth'

const CLIENT_ID = 'com.bitgo.testwebapp'
const BASE_PROVIDER_URL = 'https://identity.bitgo-test.com/realms/bitgo'
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
      clientId: CLIENT_ID,
      client: {
        token_endpoint_auth_method: 'none'
      },
      idToken: true,
      authorization: { params: { scope: 'openid web-origins bitgo-info', access_type: 'offline' } },
      wellKnown: `${BASE_PROVIDER_URL}/.well-known/openid-configuration`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email
        }
      }
    }
  ],
  callbacks: {
    async jwt(params) {
      const { account, token, user } = params
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          user,
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + account.expires_in),
          refresh_token: account.refresh_token
        }
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token
      } else {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch(`${BASE_PROVIDER_URL}/protocol/openid-connect/token`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: CLIENT_ID,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token
            }),
            method: 'POST'
          })

          const tokens: TokenSet = await response.json()

          if (!response.ok) throw tokens

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token
          }
        } catch (error) {
          console.error('Error refreshing access token', error)
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: 'RefreshAccessTokenError' as const }
        }
      }
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      ;(session as any).accessToken = token.access_token
      ;(session as any).refreshToken = token.refresh_token
      ;(session as any).user = user
      ;(session as any).error = token.error
      return session
    }
  },
  theme: {
    colorScheme: 'light'
  },
  pages: {
    signIn: 'auth/signin'
  },
  secret: '3cLDy19y9OC/FPbop6lw/sxDhpH4TWpFmeGobObL1Po='
}

export default NextAuth(authOptions)
