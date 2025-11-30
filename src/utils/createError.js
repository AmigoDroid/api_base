export default function createError(status, message, code) {
    const err = new Error(message);
    err.status = status;
    err.code = code;
    return err;
};
