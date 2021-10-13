import {
  ENDEC_KEY,
  RSA_PUB_KEY,
  TRON_BRAVO_ADDRESS,
  TRON_TOKEN_CA,
  TRON_GRID
} from 'react-native-dotenv';
export const key = ENDEC_KEY;
export const rsa_key = RSA_PUB_KEY.replace(/\\n/gm, '\n');
export const tron_address = TRON_BRAVO_ADDRESS;
export const tron_contract_address = TRON_TOKEN_CA;
export const tron_grid = TRON_GRID;
// export default {
//   //크로스 플랫폼일 때, API_KEY 예시
//     ANALYTICS_KEY: Platform.select({
//       ios: IOS_ANALYTICS_KEY,
//       android: ANDROID_ANALYTICS_KEY,
//     }),
// };
