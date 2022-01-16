import { register } from '../api/auth.js';
window.addEventListener('load', () => {
    const token = window.localStorage.getItem('token');
    if (token) {
        window.location.href = '/home';
    }
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async(e) => {
        //     console.log(this);
        //     console.log(e.target);
        e.preventDefault();
        const formData = new FormData();
        //     // console.log(e.target);

        //     console.log(formData)
        //     const error = document.getElementById('error');
        //     error.innerText = '';
        const username = document.querySelector('input[name="username"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const name = document.querySelector('input[name="name"]').value;
        const image = document.querySelector('input[name="image"]').files['0'];
        // console.log(username, name, password, file);
        // const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('image', image);
        formData.append('email', email);
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }

        register(formData).then(data => {
            if (data.success === true) {
                window.location.href = '/login';
            } else {
                error.innerText = data.message;
                console.error(data);
            }

        }).catch(e => {

            console.log(e.message);
        })
    });
});