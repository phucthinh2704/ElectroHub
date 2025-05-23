const formatMoney = (number) => {
    return Number(Number(number)?.toFixed(1)).toLocaleString();
};
export default formatMoney;