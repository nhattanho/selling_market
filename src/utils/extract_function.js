export const extractErrorMessage = (err) => {
    var errorMessage = err.code.split('/')[1];
    if (errorMessage === "email-already-in-use") {
        errorMessage = "The email address is already in use!";
    } else if (errorMessage === "invalid-email") {
        errorMessage = "The email address is not valid!";
    } else if (errorMessage === "operation-not-allowed") {
        errorMessage = "Operation not allowed!";
    } else if (errorMessage === "weak-password") {
        errorMessage = "The password is too weak. At least 6 characters!";
    } else if (errorMessage === "user-not-found") {
        errorMessage = "The email or user does not existed!";
    } else if (errorMessage === "wrong-password") {
        errorMessage = "Password was wrong!";
    }
    return errorMessage;
}