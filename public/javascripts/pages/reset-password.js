import { resetPassword } from '../api/auth.js';
window.addEventListener('load', () => {
    document.querySelector('button').addEventListener('click', async() => {
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;
        if (password === confirm) {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const response = await resetPassword(password, code);
            if (response.success) {
                window.location.href = '/login';
            }
            document.querySelector('.message').innerText = response.message;
        } else {
            document.querySelector('.message').innerText = 'enter same password in two field';
        }

    });
});