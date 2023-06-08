## Phonebook Backend Project

This is the backend project for a phonebook application that allows users to register, login, add an avatar, and perform CRUD operations on contacts.

## Features:

- User Registration: Users can create a new account by providing their desired username, email, and password. The registration endpoint is secure and validates user input.
- User Login: Registered users can log in using their credentials to access their phonebook and perform CRUD operations.
- Avatar Upload: Users have the ability to upload and update their profile picture (avatar) to personalize their phonebook experience.
- Blocked Users: User can move contact to blocked contacts list
- Contact Creation: Once logged in, users can create new contacts by providing the contact's name, phone number.
- Contact Retrieval: Users can view a list of their existing contacts, including their name, phone number.
- Contact Update: Users can edit and update the details of their existing contacts, including the name and phone number.
- Contact Deletion: Users have the ability to delete unwanted contacts from their phonebook.

## Technologies Used:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Multer (for file uploads)
- bcrypt (for password hashing)

## Commands:

- `npm start` &mdash; starts the server in production mode.
- `npm run start:dev` &mdash;  starts the server in development mode.
- `npm run lint` &mdash; runs code checks with eslint. It is necessary to run this command before each pull request (PR) and fix all linting errors.
- `npm lint:fix` &mdash; similar to the lint command, but automatically fixes simple linting errors.
