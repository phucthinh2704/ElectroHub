const formatMoney = (number) => {
    return Number(number?.toFixed(1)).toLocaleString();
};
export default formatMoney;