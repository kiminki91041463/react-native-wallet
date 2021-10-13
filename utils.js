export const setComma = (number) => {
  const reg = /(^[+-]?\d+)(\d{3})/;

  number += "";
  while (reg.test(number)) {
    // replace 정규표현식으로 3자리씩 콤마 처리
    number = number.replace(reg, "$1" + "," + "$2");
  }

  return number;
};
