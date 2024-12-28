function validPhoneNumber(Number) {
    if (Number.length !== 10) {
        return { valid: false, msg: "Mobile number must be 10 digits" };
    }
    return { valid: true };
}

module.exports = {
    validation: validPhoneNumber
};
