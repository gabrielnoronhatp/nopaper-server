import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';



const CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const TENANT_ID = process.env.AZURE_TENANT_ID!;

const options = {
    identityMetadata: `https://login.microsoftonline.com/${TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: CLIENT_ID,
    validateIssuer: true,
    issuer: `https://sts.windows.net/${TENANT_ID}/`,
    passReqToCallback: false,
};

passport.use(new BearerStrategy(options, (token, done: any) => {
    done(null, token);
}));
