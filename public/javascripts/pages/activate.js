import { activate } from '../api/auth.js';
window.addEventListener('load', () => {
    let h1 = document.querySelector('h1');
    const params = new URLSearchParams(window.location.search);
    const token = params.get('code');
    if (token) {
        activate(token).then((response) => {
            console.log(response);
            if (response.success) {
                h1.innerHTML = 'Profile Activated!';
            } else {
                h1.innerHTML = response.message;
            }
        }).catch((e) => { h1.innerHTML = e.message; });

    } else {
        h1.innerHTML = 'Activation code does not provided!';
    }
});