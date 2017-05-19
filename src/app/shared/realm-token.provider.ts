import { REALM } from 'ngx-login-client';

let realmFactory = () => {
  console.log('Using Keycloak realm: ' + process.env.REALM);
  return process.env.REALM;
};

export let realmProvider = {
  provide: REALM,
  useFactory: realmFactory
};
