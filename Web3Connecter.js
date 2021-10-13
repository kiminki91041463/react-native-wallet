import { TronABI } from './ContractDataTron';
// import { tron_contract_address,tron_grid,tron_address } from './config'; //변경이 안됨

const TronWeb = require('tronweb');
// 메인넷
const tron_grid = 'https://api.trongrid.io';
const tron_address = 'TMCXrW3FR7EsxvASiTTrmsoeeSzdyxhLAJ';
const tron_contract_address = 'TLkRwsZLYyN83jw5VYH4Fiwrw5GspkoVME';

// 테스트넷
// const tron_grid = 'https://api.shasta.trongrid.io';
// const tron_address = 'TPhaWdxXMwT6XguHoZ5tPaJwLBWrKVmAAj';
// const tron_contract_address = 'TBw1pQZfz4LSybGYRjbiUdPuggr7kE1GUS';
const fullNode = tron_grid;
const solidityNode = tron_grid;
const eventServer = tron_grid;
const tronWeb = new TronWeb(
  fullNode, //tron grid에서 운영중인 노드
  solidityNode, //tron grid에서 운영중인 노드
  eventServer, //tron grid에서 운영중인 노드,
);
const HEX_PREFIX = '41';
let contract;
const getContract = async () => {
  await tronWeb.setAddress(tron_address);
  contract = await tronWeb.contract(TronABI, tron_contract_address);
  console.log('contract get done');
  return;
};
getContract();
const options = {
  feeLimit: 100000000,
  callValue: 0,
};

export const isAddressFunc = (address) => {
  // console.log(address);
  return tronWeb.isAddress(address);
};

const hexToNumber = (stringParam) => {
  return parseInt(Number(stringParam).toString(10));
};

export const hexAddressToBase58 = (hexAddress) => {
  let retval = hexAddress;
  try {
    if (hexAddress.startsWith('0x')) {
      hexAddress = HEX_PREFIX + hexAddress.substring(2);
    }
    let bArr = tronWeb.utils['code'].hexStr2byteArray(hexAddress);
    retval = tronWeb.utils['crypto'].getBase58CheckAddress(bArr);
  } catch (e) {
    //Handle
    console.log(e);
  }
  return retval;
};

//get user Balance
export const getUserBalance = async (address) => {
  try {
    const balance = await contract.balanceOf(address).call();
    const trx = await tronWeb.trx.getBalance(address);
    return {
      KRWG: hexToNumber(balance),
      TRX: trx,
    };
  } catch (error) {
    throw new Error(error);
  }
};
