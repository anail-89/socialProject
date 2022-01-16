export const getCurrentUserData = async() => {
    var token = window.localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/users/current', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
    console.log(response);
    return response.json();
};
export const findUsers = async(name) => {
    var token = window.localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/users?name=' + name, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
    if (response.code === 401) {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    }
    console.log(response);
    return response.json();
};
export const friendRequest = async(to) => {

    var token = window.localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/users/friend-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ to })
    });
    if (response.code === 401) {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    }
    console.log(response);
    return response.json();
};
export const getFriendRequests = async() => {
    var token = window.localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/users/getFriendRequests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
    if (response.code === 401) {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    }
    console.log(response);
    return response.json();
};
export const acceptedRequest = async(from) => {

    var token = window.localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/users/accept-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ from })
    });
    if (response.code === 401) {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    }
    console.log(response);
    return response.json();
};
export const getFriends = async() => {
    var token = window.localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/users/getFriends', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
    if (response.code === 401) {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    }
    console.log(response);
    return response.json();
};