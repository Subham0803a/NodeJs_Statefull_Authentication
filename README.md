# What it Does :-


This Node.js Express application implements a user authentication system with the following functionalities:

Registration: Users can create new accounts with usernames and passwords. The passwords are securely hashed before storage to protect user data.

Login: Registered users can log in using their credentials. The application validates the username and password combination against stored data.

Logout: Users can log out of their accounts, clearing session information.

Session Management: The application creates and manages user sessions using Express Session and a MongoDB store. This allows for tracking logged-in users and 
providing personalized experiences.

Templating: EJS templates are used to generate dynamic HTML pages, delivering a user-friendly interface for registration, login, dashboard, and home page.

# Technologies Used :-



Node.js: The JavaScript runtime environment that powers the server-side application.

Express: A popular Node.js framework for building web applications.

Mongoose: An ODM (Object Data Modeling) library for interacting with MongoDB databases in a more intuitive way.

bcrypt: A library for securely hashing passwords using a one-way algorithm.

Express Session (connect-mongo): Middleware for managing user sessions with a MongoDB store for persistence.

EJS: A templating engine for generating dynamic HTML content based on data.
