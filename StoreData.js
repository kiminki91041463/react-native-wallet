import AsyncStorage from "@react-native-community/async-storage"
import SecureStorage from 'react-native-secure-storage'


//외부에서 사용하는 ASyncStorage의 get,setItem을 전부 함수화
export const storeData = async (wallet, privateKey, mnemonic) => {
  try {
    // console.log(wallet);
    // 지갑 목록 정보 저장하기
    await AsyncStorage.setItem("WALLETS", JSON.stringify(wallet));
    // 개인키를 안전한 영역에 저장하기
    const secureData = {
      address: wallet.address,
      privateKey,
      mnemonic: mnemonic
    };
    const jsonSecureData = JSON.stringify(secureData);
    await SecureStorage.setItem("secureData", jsonSecureData);
    return;
  } catch (error) {
    // Error saving data
    return console.log(error);
  }
};
