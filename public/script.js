// Function to handle user registration
async function registerUser() {
  const regUsername = document.getElementById('regUsername').value;
  const regPassword = document.getElementById('regPassword').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: regUsername, password: regPassword }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to register user.');
    }

    alert('Registration successful. You can now log in.');
    toggleForm('loginForm'); // Show the login form after successful registration
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during user registration.');
  }
}

// Function to handle user login
async function loginUser() {
  const loginUsername = document.getElementById('loginUsername').value;
  const loginPassword = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to log in.');
    }

    const data = await response.json();
    const token = data.token;
    const username = data.username;
    console.log(username)
    localStorage.setItem('token', token); // Store the token in local storage for user session management
    localStorage.setItem('username', username);

    // Show the logged-in content and hide the login form
    document.getElementById('app').style.display = 'none';
    document.getElementById('loggedInContent').style.display = 'block';

    // Fetch and display the list of uploaded files (you can implement this function separately)
    displayUserFiles();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during user login.');
  }
}

// Function to handle user logout
function logoutUser() {
  localStorage.removeItem('token'); // Remove the token from local storage to log the user out

  // Show the login and registration forms and hide the logged-in content
  document.getElementById('app').style.display = 'block';
  document.getElementById('loggedInContent').style.display = 'none';
}

// Function to toggle between login and registration forms
function toggleForm(formIdToShow) {
  const forms = document.getElementsByClassName('auth-form');
  for (const form of forms) {
    form.style.display = form.id === formIdToShow ? 'block' : 'none';
  }
}

// Function to handle file upload
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  console.log("hi")

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated.');
    }

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the request headers
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file.');
    }

    const data = await response.json();
    console.log(data)
    const fileUrl = data.fileUrl;

    const username = localStorage.getItem('username');
    

    // Save the fileUrl in local storage for the current user
    const userId = username; // Use the username as the userId
    const userFiles = JSON.parse(localStorage.getItem(userId)) || [];
    userFiles.push({ name: file.name, url: fileUrl });
    localStorage.setItem(userId, JSON.stringify(userFiles));

    displayUserFiles();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during the upload.');
  }
}

function displayUserFiles() {
  const username = localStorage.getItem('username');
  if (!username) {
    console.error('Username not found in local storage.');
    return;
  }

  const userId = username;
  const userFiles = JSON.parse(localStorage.getItem(userId)) || [];

  const filesListElement = document.getElementById('filesList');
  filesListElement.innerHTML = ''; // Clear existing list before adding new files

  for (const file of userFiles) {
    const fileLink = document.createElement('a');
    fileLink.href = file.url;
    fileLink.target = '_blank';
    fileLink.textContent = file.name;
    filesListElement.appendChild(fileLink);
    filesListElement.appendChild(document.createElement('br'));
  }
}


// Check if the user is already logged in (on page load)
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    // User is logged in, show logged-in content
    document.getElementById('app').style.display = 'none';
    document.getElementById('loggedInContent').style.display = 'block';
    // Fetch and display the list of uploaded files
    displayUserFiles()
  } else {
    // User is not logged in, show login and registration forms
    document.getElementById('app').style.display = 'block';
    document.getElementById('loggedInContent').style.display = 'none';
  }
});



































// async function uploadFile() {
//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];
  
//     if (!file) {
//       alert('Please select a file.');
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('file', file);
  
//     try {
//       const response = await fetch('http://localhost:3000/upload', {
//         method: 'POST',
//         body: formData,
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to upload file.');
//       }
  
//       const data = await response.json();
//       console.log(data)
//       const messageElement = document.getElementById('message');
//       if (data.fileUrl) {
//         messageElement.innerHTML = `File uploaded successfully. Access it here: <a href="${data.fileUrl}" target="_blank" class="link-style">${data.fileUrl}</a>`;
//       } else {
//         messageElement.textContent = 'Failed to upload file.';
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       const messageElement = document.getElementById('message');
//       messageElement.textContent = 'An error occurred during the upload.';
//     }
//   }
  