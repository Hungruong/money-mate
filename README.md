
# Money-Mate Project

## Overview

Money-Mate is a comprehensive financial management application designed to help users manage their spending, savings, investments, and more. The project includes backend services developed using **Spring Boot** and **Gradle**, as well as a frontend mobile application built with **React Native** and **Expo**.

This document provides a detailed guide on how to set up and run the project locally, including steps for both **backend** and **frontend** services, as well as integration with external services like **AWS RDS**.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Backend Setup](#backend-setup)
    - [Set Up Databases (AWS RDS)](#set-up-databases-aws-rds)
    - [Running Backend Services](#running-backend-services)
4. [Frontend Setup](#frontend-setup)
    - [Install Dependencies](#install-dependencies)
    - [Start the Project](#start-the-project)
    - [Testing the Frontend](#testing-the-frontend)
5. [Additional Information](#additional-information)

---

## Prerequisites

Before running the project, make sure you have the following software installed:

- **Java 21** (for backend)
- **Gradle** (for building and running backend services)
- **Node.js** (for frontend)
- **Expo Go** (for testing the frontend app)
- **PostgreSQL** (for accessing the RDS database)

You can download and install these software packages from their respective official websites.

---

## Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/Hungruong/money-mate.git
```

After cloning, navigate to the project directory:

```bash
cd money-mate
```

---

## After cloning:
    Please refer to the document I attach in our groupchat to copypaste our data to the files in project before next step.

## Backend Setup

### Set Up Databases (AWS RDS)

For database connectivity, we are using **AWS RDS PostgreSQL**. Ensure that you have access to the RDS instance and its credentials.

- **RDS Instance URL:** `money-mate-db.cpgs2swwy3f4.us-east-2.rds.amazonaws.com`
- **Database Name:** `money_mate`
- **Username:** `admin_user`
- **Password:** `moneymate123`

#### Connecting to the Database:

**For Windows:**

Open PowerShell or Command Prompt and run the following command:

```bash
psql -h money-mate-db.cpgs2swwy3f4.us-east-2.rds.amazonaws.com -U admin_user -d money_mate
```

Enter the password when prompted:

```
Password for user admin_user: moneymate123
```

**For macOS/Linux:**

Open Terminal and run:

```bash
psql -h money-mate-db.cpgs2swwy3f4.us-east-2.rds.amazonaws.com -U admin_user -d money_mate
```

---

### Running Backend Services

Each service in the backend runs independently. Here are the steps to run the services:

1. **Navigate to each service directory:**

For example, for the `user-service`:

```bash
cd backend/user-service
```

2. **Clean and build the project:**

```bash
gradle clean build
```

3. **Run the service:**

```bash
gradle bootRun
```

Repeat these steps for each service in the backend (e.g., `auth-service`, `payment-service`, `savings-service`, etc.).

---

## Frontend Setup

### Install Dependencies

1. **Navigate to the frontend directory:**

```bash
cd money-mate/frontend
```

2. **Install the required dependencies using npm:**

Ensure you have **Node.js** and **Expo CLI** installed. If you don't have **Expo CLI** installed, run the following:

```bash
npm install -g expo-cli
```

Then, install the project dependencies:

```bash
npm install
```

---

### Start the Project

Once all dependencies are installed, start the frontend project:

```bash
npm run start
```

This will start the Metro Bundler and the project, and you should see a QR code in your terminal.

---

### Testing the Frontend

You can test the frontend app using **Expo Go**. To do this:

1. **Install Expo Go** on your phone (available on both Android and iOS) from the App Store or Google Play Store.
2. Open **Expo Go**, and scan the QR code displayed in the terminal.
3. Alternatively, you can test the app in a web browser by navigating to [http://localhost:8081](http://localhost:8081).

- For **Windows**, test with Android.
- For **macOS**, test with iOS.

Once the QR code is scanned, the app will open on your mobile device or web browser.
