fetch("http://localhost:3000/api/v1/users")
    .then(res => res.json())
    .then(data => {
        let users = data;
        return users.map((userInfo) => {
            let content = document.querySelector('.page-header');
            let cardBody = document.createElement('div');
            let title = `<h1>${userInfo.fullname}</h1>`;
            let cardTitle = document.createRange().createContextualFragment(title);
            let email = `<p>Email: ${userInfo.email}</p>`;
            let password = `<p>Password: ${userInfo.password}</p>`;
            let cardEmail = document.createRange().createContextualFragment(email);
            let cardPassword = document.createRange().createContextualFragment(password);
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardEmail);
            cardBody.appendChild(cardPassword);
            content.appendChild(cardBody);
        });
    });