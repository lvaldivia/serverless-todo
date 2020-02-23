// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'gwdjdyzl4d'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'lvaldivia89.auth0.com',            // Auth0 domain
  clientId: 'D2G9H2e8bB8UKaAZLgjr197dJZE6gLg9',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
