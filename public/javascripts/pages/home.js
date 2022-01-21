import { getCurrentUserData, findUsers, friendRequest, getFriendRequests, acceptedRequest, getFriends } from '../api/users.js';


window.addEventListener('load', () => {
    document.getElementById('log-out').addEventListener('click', (e) => {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    });
    let currentId;
    getCurrentUserData().then((response) => {
        if (response.success === true) {
            console.log(response);
            document.getElementById('user-name').innerHTML = `Hello ${response.data.name}`;
            currentId = response.data.id;
        }
    }).catch((err) => { console.log(err); });

    const search = document.querySelector('input[name="find-friend"]');
    const tbody = document.querySelector('#users tbody');

    const requestClicks = async() => {
        const buttons = document.querySelectorAll('button.friend-request');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', async(e) => {
                console.log(currentId);
                const response = await friendRequest(e.target.getAttribute('user-id'));
                if (response.success) {

                    e.target.innerHTML = 'Request Sent';
                    e.target.classList.add('green');
                }
                console.log(response);
            })
        }
    };
    search.addEventListener('input', async() => {
        if (search.value.length > 0) {
            const response = await findUsers(search.value);

            console.log(response);
            if (response.data && response.data.length > 0) {

                let innerHTML = '';


                response.data.map(user => {
                    let request_type_name = 'Friend Request';
                    let attributeName = '';
                    if ((user.User && user.User.length > 0 && user.User.filter((elem) => elem.id == currentId).length > 0) || (user.Friend && user.Friend.length > 0 && user.Friend.filter((elem) => elem.id == currentId).length > 0)) {
                        request_type_name = 'Friend';
                        let attributeName = 'disabled';
                    } else if (user.sendFriendRequest && user.sendFriendRequest.length > 0 && user.sendFriendRequest.filter((elem) => elem.id == currentId).length > 0) {
                        request_type_name = 'Request already sent';
                        let attributeName = 'disabled';
                    }

                    if (attributeName == 'disabled') {
                        innerHTML += `
                        <tr>
                            <td>${user.name}</td>
                            <td>
                                <button  user-id=${user.id}>${request_type_name}</button>
                            </td>
                        </tr>
                        
                        `;
                    } else {
                        innerHTML += `
                        <tr>
                            <td>${user.name}</td>
                            <td>
                                <button class="friend-request" user-id=${user.id}>${request_type_name}</button>
                            </td>
                        </tr>
                        
                        `;
                    }

                });
                tbody.innerHTML = innerHTML;

            }
            requestClicks();
        } else {
            tbody.innerHTML = '';
        }
    });

    //accepted friend requestClicks
    const tbody2 = document.querySelector('#requests tbody');
    const acceptedClicks = async() => {
        const buttons2 = document.querySelectorAll('button.accepted');
        for (let i = 0; i < buttons2.length; i++) {
            buttons2[i].addEventListener('click', async(e) => {

                const resp = await acceptedRequest(e.target.getAttribute('user-id'));
                console.log(resp);
            });
        }
    };
    getFriendRequests().then(response => {
        console.log(response);
        if (response.data && response.data.length > 0) {
            let innerHTML = '';
            response.data.map(user => {
                innerHTML += `
                <tr>
                    <td>${user.name}<td>
                    <td>
                        <button class="accepted" user-id=${user.id}>Accept Request</button>
                    </td>
                </tr>
                
                `;
            });
            tbody2.innerHTML = innerHTML;

        }
        acceptedClicks();
    });

    getFriends().then((response) => {
        console.log(response);
        let fried_tbl = document.getElementById("friends");
        let innerHTML = '';
        if (response.data.Friend.length > 0) {

            response.data.Friend.map(user => {
                innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>
                        ${user.id}
                    </td>
                </tr>
                
                `;
            });
        }
        if (response.data.User.length > 0) {

            response.data.User.map(user => {
                innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>
                        ${user.id}
                    </td>
                </tr>
                
                `;
            });
        }
        fried_tbl.innerHTML = innerHTML;

    }).catch((err) => {
        console.log(err.message);
    });




});