export const formatNum = (
    value,
    isDecimal = true,
    decimalCount = 2
) => {
    const givenNum = Number(value) ?? 0;
    let number;
    if (isDecimal) {
        number = givenNum.toFixed(decimalCount); //adding decimal
    } else {
        number = givenNum.toString().split(".")[0]; //removing decimal
    }

    let updatedNumber = Number(number);
    if (isNaN(updatedNumber)) updatedNumber = 0;
    let result = updatedNumber.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "decimal",
    });
    if (isDecimal && !result.includes(".")) result += ".00";
    const isSingleDecimal = result.split(".")[1].length === 1;
    if (isSingleDecimal) result += "0";

    return result;
};