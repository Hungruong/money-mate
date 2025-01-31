Before running the project, make sure you have the following software installed:

Java 21+ (for backend)
Gradle (for building and running backend services)
Node.js (for frontend)
Expo Go (for testing the frontend app)
PostgreSQL (for accessing the RDS database)

Clone the Repository
git clone https://github.com/Hungruong/money-mate.git

Backend Setup
1. Move to backend folder
cd money-mate/backend
2. Set Up Databases (AWS RDS)
For database connectivity, we are using AWS RDS PostgreSQL instance. Make sure you have access to the RDS instance.

RDS Instance URL: money-mate-db.cpgs2swwy3f4.us-east-2.rds.amazonaws.com
Database name: money_mate
Username: admin_user
Password: moneymate123

Connect to the Database:
For Windows:
psql -h money-mate-db.cpgs2swwy3f4.us-east-2.rds.amazonaws.com -U admin_user -d money_mate
Password for user admin_user: moneymate123

For macOS/Linux:
psql -h money-mate-db.cpgs2swwy3f4.us-east-2.rds.amazonaws.com -U admin_user -d money_mate

3. Running Backend Services
Go to each service:
gradle clean build
gradle bootRun


Frontend Setup
1. Move to frontend folder
cd money-mate/frontend

2. Install Dependencies
Make sure you have Node.js and Expo CLI installed. You can install Expo CLI globally using:
npm install -g expo-cli
npm install

3. Start the Project
npm run start


*Can download Expo Go on phone or computer to test
For Windows, test with Android
For MacOS, test with IOS