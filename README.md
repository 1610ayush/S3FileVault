# S3 File Storage Application

The S3 File Storage Application is a web-based application that allows users to securely upload, store, and manage files on Amazon S3 (Simple Storage Service). It provides a simple and user-friendly interface for registering, logging in, and uploading files to the cloud storage.

## Features

- User Registration: New users can sign up and create an account with a unique username and password.
- User Login: Existing users can log in using their credentials to access their file storage.
- File Upload: Users can select and upload files of various types to the application.
- Secure Authentication: User authentication is handled using JWT (JSON Web Tokens) for enhanced security.
- Amazon S3 Integration: The application is integrated with Amazon S3 for efficient and secure file storage.
- Listing Uploaded Files: Users can view a list of their uploaded files with direct links for easy access.
- User Logout: Users can log out to securely end their session.

## Deployment

The S3 File Storage Application has been deployed on [Fly.io](https://fly.io/), providing a live demo accessible at [S3 File Storage Demo](https://s3filevault.fly.dev/).


## Technologies Used

- Front-end: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Amazon S3 SDK: AWS SDK for JavaScript
- JWT for Authentication
- Multer for File Upload Handling
- Bootstrap for Styling

## How to Use

1. Clone the repository to your local machine using `git clone`.
2. Install the required dependencies using `npm install`.
3. Set up your Amazon S3 credentials in the `.env` file. Refer to the `.env.example` for required environment variables.
4. Run the server using `npm start`.
5. Access the application in your web browser at `http://localhost:3000`.
6. Register a new account or log in with your existing credentials.
7. Use the application to upload, manage, and access your files securely.

## Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```plaintext
S3ACCESSKEYID=YOUR_AWS_ACCESS_KEY_ID
S3SECRETACCESSKEY=YOUR_AWS_SECRET_ACCESS_KEY
JWTSECRETKEY=YOUR_JWT_SECRET_KEY
BUCKETNAME=YOUR_S3_BUCKET_NAME
