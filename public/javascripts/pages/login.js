import { login } from '../api/auth.js';
window.addEventListener('load', () => {
    const token = window.localStorage.getItem('token');
    if (token) {
        window.location.href = '/home';
    }
    document.getElementById('login').addEventListener('click', async() => {
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        console.log(username, password);

        // const formData = new FormData();
        // formData.append('username', username);
        // formData.append('password', password);
        // console.log(formData);

        login(username, password)
            .then(data => {
                if (data.success === true) {
                    console.log(data);
                    window.localStorage.setItem('token', data.data);
                    window.location.href = '/home';
                    //window.location.href = 'login.pug';
                } else {
                    document.getElementById('error').innerHTML = data.message;
                }

            }).catch(e => {
                console.log(e);
            });
    });
});