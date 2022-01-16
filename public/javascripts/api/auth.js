export const login = async(username, password) => {

    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    console.log(response);
    return response.json();
};
export const register = async(formData) => {

    const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        body: formData

    });
    return response.json();
}
export const activate = async(token) => {

    const response = await fetch('http://localhost:3000/auth/activate?code=' + token, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },

    });
    console.log(response);
    return response.json();
};
export const forgotPassword = async(email) => {

    const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email

        })
    });
    console.log(response);
    return response.json();
};
export const resetPassword = async(password, code) => {

    const response = await fetch('http://localhost:3000/auth/reset-password?code=' + code, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password

        })
    });
    console.log(response);
    return response.json();
};