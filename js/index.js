// document.addEventListener("DOMContentLoaded", () =>{

//     let mainContainer = document.getElementById("main")[0]

//     fetch("http://localhost:3000/posts")
//     .then(response => response.json())
//     .then(data => {
//         data.forEach(element => {
//             let mainDiv = document.createElement("div");
//             mainDiv.id = "main"
//         });
//     })
// })

// index.js

document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    githubForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm === '') {
        return;
      }
  
      // Clear previous search results
      userList.innerHTML = '';
      reposList.innerHTML = '';
  
      try {
        // Search for users using the GitHub User Search Endpoint
        const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchTerm}`);
        const usersData = await usersResponse.json();
  
        if (usersData.items.length === 0) {
          userList.innerHTML = 'No users found.';
          return;
        }
  
        // Display user information
        usersData.items.forEach(user => {
          const userItem = document.createElement('li');
          userItem.innerHTML = `
            <img src='${user.avatar_url}' alt='${user.login}'>
            <p>${user.login}</p>
            <button class='repos-button' data-username='${user.login}'>Show Repos</button>
          `;
  
          userList.appendChild(userItem);
  
          // Add event listener to show repositories when button is clicked
          const reposButton = userItem.querySelector('.repos-button');
          reposButton.addEventListener('click', async () => {
            try {
              // Fetch user's repositories using the User Repos Endpoint
              const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`);
              const reposData = await reposResponse.json();
  
              // Display user's repositories
              reposList.innerHTML = '';
  
              if (reposData.length === 0) {
                reposList.innerHTML = 'No repositories found.';
                return;
              }
  
              const reposHeader = document.createElement('h3');
              reposHeader.textContent = `${user.login}'s Repositories:`;
              reposList.appendChild(reposHeader);
  
              const reposUl = document.createElement('ul');
              reposData.forEach(repo => {
                const repoItem = document.createElement('li');
                repoItem.innerHTML = `<a href='${repo.html_url}' target='_blank'>${repo.name}</a>`;
                reposUl.appendChild(repoItem);
              });
  
              reposList.appendChild(reposUl);
            } catch (error) {
              console.error('Error fetching repositories:', error);
            }
          });
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        userList.innerHTML = 'An error occurred while fetching data.';
      }
    });
  });
  