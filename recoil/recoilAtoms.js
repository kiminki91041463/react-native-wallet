import { atom } from 'recoil';

//atom
export const isLoggedIn = atom({
  key: 'isLoggedIn',
  default: false,
});

export const loadingTransaction = atom({
  key: 'loadingTransaction',
  default: false,
});

export const userBalance = atom({
  key: 'userBalance',
  default: {
    KRWG: null,
    TRX: null,
  },
});

export const basicState = atom({
  key: 'basicState',
  default: {
    walletExist: null,
    beginning: null,
    policy: null,
    authType: null,
    useAuthenticationPossible: null,
    alreadyAuthenticatie: null,
  },
});

export const someState = atom({
  key: 'someState',
  default: {
    buttonActive: 0,
    myInfoCheck: false,
    charge: 490,
  },
});

export const myInfoState = atom({
  key: 'myInfoState',
  default: {
    nickName: null,
    code: null,
    dailyFreeTransferCount: null,
  },
});

export const companyState = atom({
  key: 'companyState',
  default: {
    bank: '',
    creditNumber: '',
    charge: 490,
  },
});

export const refreshAndRefetch = atom({
  key: 'refreshAndRefetch',
  default: {
    refresh: false,
    refetch: false,
  },
});

export const transferData = atom({
  key: 'transferData',
  default: {
    coinValue: null,
  },
});
