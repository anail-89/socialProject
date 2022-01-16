window.addEventListener('load', () => {
    document.getElementById('userData').addEventListener('click', async(event) => {
        const response = await fetch("http:/localhost:3000/users");
        const data = await response.json();
        console.log(data);
        if (data.success) {
            const table = document.createElement('table');
            const users = data.data;
            for (let i = 0; i < users.length; i++) {
                console.log(users[i]);
                const tr = document.createElement('tr');
                const tdUsername = document.createElement('td');
                const tdName = document.createElement('td');
                const tdImage = document.createElement('td');
                tr.append(tdUsername);
                tr.append(tdName);
                tr.append(tdImage);
                table.append(tr);
                tr.setAttribute('username', users[i].username);
                tr.addEventListener('click', async(e) => {
                    const username = e.target.parentElement.getAttribute('username');
                    const response = await fetch("http:/localhost:3000/users/" + username);
                    //const response = await fetch("http:/localhost:2021/users/" + username, { method: 'PUT' });
                    const data = await response.json();
                    const userBlock = document.createElement('div');
                    const username2 = document.createElement('input');
                    username2.setAttribute('name', 'username');
                    username2.setAttribute('disabled', true);
                    username2.setAttribute('value', data.data.username);
                    const name2 = document.createElement('input');
                    name2.setAttribute('name', 'name');
                    name2.setAttribute('value', data.data.name);
                    const file = document.createElement('input');
                    file.setAttribute('type', 'input');
                    file.setAttribute('files', data.data.path);
                    file.setAttribute('value', data.data.path);
                    const btn = document.createElement('button');
                    btn.textContent = 'update';
                    btn.setAttribute('name', 'update');
                    btn.setAttribute('username', data.data.username);
                    btn.setAttribute('type', 'button');
                    userBlock.appendChild(btn);
                    userBlock.append(username2);
                    userBlock.append(name2);
                    userBlock.append(file);
                    e.target.parentElement.append(userBlock);
                    btn.addEventListener('click', async(e) => {
                        const newName = name2.getAttribute('value');
                        const newImg = file.getAttribute('files');
                        const response = await fetch("http:/localhost:3000/users/" + username);
                        const data2 = await response.json();
                        console.log(data2);
                    });
                    //const response = await fetch("http:/localhost:2021/users/" + username, { method: 'PUT', data: { name: newName, path: newImg } });
                    //const response = await fetch("http:/localhost:2021/users/" + username, { method: 'PUT' });

                });
                console.log(data);
                // console.log(data.data.name);

                tdUsername.textContent = users[i].username;
                tdName.textContent = users[i].name;
                tdImage.textContent = users[i].path;
            }
            document.body.append(table);
        }
        //console.log(data);
    });
    document.getElementById('addUser').addEventListener('click', async() => {
        const username = document.querySelector('input[name="username"]').value;
        const name = document.querySelector('input[name="name"]').value;
        const file = document.querySelector('input[name="image"]').files['0'];

        const formData = new FormData();
        formData.append('username', username);
        formData.append('name', name);
        formData.append('image', file);

        const response = await fetch("http:/localhost:3000/users", {
            method: 'POST',
            body: formData
        });

        const data = response.json();
        console.log(data);
    });
});