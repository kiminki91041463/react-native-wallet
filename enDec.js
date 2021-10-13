import { rsa_key } from './config';
import crypto from 'crypto'; //react-native-crypto => nodejs에 내장된 crypto 모듈과 같다

export const rsaEncrytion = async (orginalPwd) => {
  try {
    const encrypt = crypto
      .publicEncrypt(rsa_key, Buffer.from(orginalPwd, 'utf8'))
      .toString('base64');
    return encrypt;
  } catch (error) {
    //return
    throw new Error(error);
  }
};
