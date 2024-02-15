# CodiTeach

## Introduction

CodiTeach is an innovative educational platform designed to streamline the learning and teaching process. This repository includes both the frontend and backend components, built with modern technologies such as React.js, TypeScript, NestJS, and Vite, providing a dynamic and responsive user interface and efficient backend services.

## Frontend Requirements

To set up and run the frontend of CodiTeach, ensure you have the following requirements installed:

- **Node.js**: The JavaScript runtime environment essential for running the development server and the build scripts. [Download Node.js](https://nodejs.org/), which includes npm (Node Package Manager). Node.js is open-source and licensed under the [MIT License](https://opensource.org/licenses/MIT).
- **Vite**: A modern frontend build tool that provides a faster and leaner development experience. [Get started with Vite](https://vitejs.dev/guide/). Vite is open-source and licensed under the [MIT License](https://opensource.org/licenses/MIT).
- **React.js**: A JavaScript library for building user interfaces. [Learn more about React](https://reactjs.org/docs/getting-started.html). React is open-source and licensed under the [MIT License](https://opensource.org/licenses/MIT).
- **Mantine UI**: A fully featured React components library that includes everything you need to build fully functional applications. [Start with Mantine](https://mantine.dev/getting-started/). Mantine is open-source and licensed under the [MIT License](https://github.com/mantinedev/mantine/blob/master/LICENSE).
- **TypeScript**: A superset of JavaScript that adds types to make your code more robust and understandable. [Download TypeScript](https://www.typescriptlang.org/download). TypeScript is open-source and licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

### Additional Modules

Your project also depends on several additional npm packages. Ensure all of these are installed via `npm install` after cloning the repository. Here are some of the key packages:

- **@mantine/...**: Various Mantine components and hooks for building the UI. All Mantine packages are open-source and licensed under the [MIT License](https://github.com/mantinedev/mantine/blob/master/LICENSE).
- **axios**: Promise-based HTTP client for the browser and node.js. [Learn about axios](https://axios-http.com/docs/intro). Axios is open-source and licensed under the [MIT License](https://github.com/axios/axios/blob/master/LICENSE).
- **dayjs**: A minimalist JavaScript library for parsing, validating, manipulating, and displaying dates and times. [Day.js documentation](https://day.js.org/). Day.js is open-source and licensed under the [MIT License](https://github.com/iamkun/dayjs/blob/dev/LICENSE).
- **react-router-dom**: The standard routing library for React. [React Router documentation](https://reactrouter.com/en/6.22.0). React Router is open-source and licensed under the [MIT License](https://github.com/remix-run/react-router/blob/main/LICENSE.md).
- **zustand**: A simple, fast, and scalable bearbones state-management solution. [Zustand on GitHub](https://github.com/pmndrs/zustand). Zustand is open-source and licensed under the [MIT License](https://github.com/pmndrs/zustand/blob/main/LICENSE).

## Backend Requirements

For the backend of CodiTeach, you will need:

- **Node.js**: As mentioned above, Node.js is crucial for running the backend server.
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications. [Get started with NestJS](https://nestjs.com/). NestJS is open-source and licensed under the [MIT License](https://github.com/nestjs/nest/blob/master/LICENSE).
- **TypeORM**: An ORM that can run in Node.js and be used with TypeScript (or JavaScript). [TypeORM documentation](https://typeorm.io/#/). TypeORM is open-source and licensed under the [MIT License](https://github.com/typeorm/typeorm/blob/master/LICENSE.md).
- **PostgreSQL**: A powerful, open-source object-relational database system. [Download PostgreSQL](https://www.postgresql.org/download/). PostgreSQL is open-source and licensed under the [PostgreSQL License](https://www.postgresql.org/about/licence/), a liberal open-source license.



## Setup and Installation

### Frontend Installation Guide

1. **Clone the Repository**
   Clone the CodiTeach repository from GitHub to your local machine using the following command:

```bash 
git clone https://github.com/codiplaykz/coditeach.git
```

```bash
cd coditeach/frontend
```

2. **Install Dependencies**
   Inside the frontend directory, install the necessary npm packages by running:


```bash
npm install
```


3. **Set Up Environment Variables**
   Create a `.env` file in the root of your frontend project to store environment-specific variables. For the frontend to communicate with the backend, you need to specify the backend API URL. Replace `https://api.example.com` with the actual URL of your backend.

```bash
REACT_APP_API_URL=https://api.example.com
```


4. **Run the Project with Vite**
   To start the development server using Vite, run the following command:

```bash
npm run dev
```

This command will start the local development server, usually accessible at `http://localhost:3000` (or another port if 3000 is in use). You should see the CodiTeach frontend running in your browser.

### Backend Installation Guide

1. **Set Up Environment Variables**
   Create a `.env.stage.dev` file in the root of your backend project and populate it with the necessary environment variables. Replace `example` with your actual configuration values:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=coditeach_db
JWT_SECRET=your_jwt_secret
```

2. **Set Up a Test Database with Docker**
   You can use Docker to run a PostgreSQL database container for testing purposes. Run the following command to pull the PostgreSQL image and run a container:

```bash
docker run --name coditeach-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=coditeach_db -p 5432:5432 -d postgres
```

3. **Migrate Database Tables**
   Use the provided SQL script to create your database schema. Connect to your Docker PostgreSQL database using a GUI tool like pgAdmin or a command-line tool like `psql`.

4. **Install Dependencies and Run the Backend**
   Navigate to your backend project directory, install the necessary npm packages, and start the NestJS application:

```bash
npm install
```

```bash
npm run start
```



## Features

- Role-based access control for super admins, school admins, and teachers.
- Class management and student enrollment functionalities.
- Comprehensive curricular access for diverse learning modules.

## Technology Stack

- **Frontend**: React.js, TypeScript, Vite, Mantine UI
- **Backend**: Node.js, NestJS, TypeORM, PostgreSQL

## Contributing

Thank you for considering contributing to the CodiTeach Platform! If you are interested in contributing or becoming a sponsor, please visit the CodiTeach Platform GitHub page.

## Code of Conduct

In order to ensure that the CodiTeach community is welcoming to all, please review and abide by the Code of Conduct. Be tolerant of opposing views, and ensure that your language and actions are free of personal attacks.

## Privacy Policy

The Privacy Policy for the CodiTeach platform is available at [Privacy Policy](https://github.com/codiplaykz/coditeach/blob/main/Privacy%20policy.docx). Please review it to understand how we collect, use, and protect your information.

## Security Vulnerabilities

If you discover a security vulnerability within CodiTeach, please send an e-mail to the project maintainers via [support@codiplay.com](mailto:support@office.com). All security vulnerabilities will be promptly addressed.

## License

The CodiTeach platform is open-sourced software licensed under the BSD 3-Clause.





