import * as dotenv from "dotenv";

dotenv.config();

class Env {
  static username = process.env.CMS_EMAIL;
  static password = process.env.CMS_PASSWORD;
  static partnerIdTest = process.env.CMS_PARTNER_ID_TEST;
  static bearerToken = process.env.CMS_BEARER_TOKEN;
  static bearerTokenTest = process.env.CMS_BEARER_TOKEN_TEST;
  static gcpCredentials = process.env.CMS_GCP_CREDENTIALS;
  static twoFaUsername = process.env.CMS2FA_EMAIL;
  static twoFaPassword = process.env.CMS2FA_PASSWORD;
  static twoFaTokenPath = process.env.CMS2FA_TOKEN_PATH;
}

export default Env;
