How to Run This Project:
 1. Install MySQL and Set Up the Database
Make sure you have MySQL installed on your system.
Create a new database named moviesdb.
CREATE DATABASE moviesdb;
Import the provided SQL dump to create tables and populate sample data:
mysql -u your_username -p moviesdb < dump-moviesdb-202504171031.sql
Replace your_username with your MySQL username on the env file.
 2. Run the Backend (Node.js)
Make sure Node.js is installed.
Navigate to the backend folder (if applicable).
Install dependencies (if not already done):
npm install
Start the server: node app.js
If everything is set up correctly, you should see:
✅ Server running on port 3000
 3. Run the Frontend (React)
Open a new terminal and navigate to the frontend project directory.
Install dependencies:
npm install
Start the development server:
npm run dev
A local development link (typically http://localhost:5173) will appear in the terminal. Open it in your browser.
✅ All Set!
At this point:
The backend server should be running on http://localhost:3000
The frontend app should be available on the link shown in the terminal after npm run dev
You're ready to explore the app!
pls use following link to check the Matomo analytic.

***Accessibility & SEO***
* To ensure the application is accessible, semantic HTML elements such as  <main>, <button> are used, allowing screen readers to interpret content effectively. The app supports keyboard navigation, enabling users to tab through interactive elements smoothly. Contrast ratios between text and background colors were checked to meet readability standards. Additionally, descriptive alt attributes are included for all images, enhancing both accessibility and SEO. Although the backend does not serve dynamic HTML pages, the API responses are clearly structured and labeled, making it easier to integrate with an SEO-friendly frontend in the future.e.
***Tracking & Privacy***
For tracking user interactions, both backend and frontend solutions have been implemented. On the backend, a custom /api/track endpoint collects and stores data such as IP address, screen resolution, and user agent into the database. This allows for monitoring trends in device usage and optimizing the user experience based on device types. On the frontend, the app integrates Matomo, a privacy-focused, open-source analytics platform, instead of Google Analytics. The decision to use Matomo was driven by its strong emphasis on user privacy and data ownership. Unlike Google Analytics, which processes user data on third-party servers and may share information with other services, Matomo allows data to be stored locally on the server, giving complete control over the collected data and ensuring that no personal or identifiable information is shared externally.
 Matomo also respects GDPR compliance, as it offers features like anonymizing IP addresses and obtaining user consent before tracking begins. Furthermore, unlike Google Analytics, Matomo does not use cookies to track users or perform fingerprinting, ensuring that no unique identifiers are created for users. This is a crucial consideration, as it aligns with the app’s commitment to maintaining user privacy while still being able to gather valuable insights into user behavior. The decision to use Matomo instead of Google Analytics was ultimately driven by a desire to prioritize data privacy, transparency, and user control.

***Security Threats & Mitigation***
Two common security threats for web applications are SQL Injection and API Key Exposure.To prevent SQL Injection attacks, the project uses parameterized queries with mysql2/promise, which sanitize all user inputs before executing SQL statements.To secure private routes, the API key is stored in a .env file and verified via middleware. This middleware checks the x-api-key header and denies access if the key is missing or invalid.The app also implements Helmet to set secure HTTP headers, and express-rate-limit to prevent abuse through repeated requests.For development and testing purposes, CORS is globally enabled using the cors middleware with open access (origin: "*") to allow cross-origin requests. However, in production, this should be restricted to trusted domains only to minimize potential security risks.