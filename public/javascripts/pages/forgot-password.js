import { forgotPassword } from '../api/auth.js';
window.addEventListener('load', () => {
    document.querySelector('button').addEventListener('click', async() => {
        const response = await forgotPassword(document.querySelector('input').value);
        document.querySelector('label').innerText = response.message;
    });
});