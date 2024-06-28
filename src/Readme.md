# 🌍 MassEnergize Frontend-Portal 🌍

Welcome to the MassEnergize Frontend-Portal! We're thrilled to have you here. Our mission is to empower communities to take meaningful climate action, and this Frontend-Portal is at the heart of that mission.

### Technologies We Use 💻

- **Language**: `JavaScript`
- **JavaScript Library**: `React`
- **Frontend Framework**: `Bootstrap`
- **State Management**: `Redux`
- **Auth**: `Firebase`
- **Cloud Hosting Platform**: `Netlify`
- **Frontend Testing Tool**: `Cypress`
- We also use `Sentry`

## General Prerequisites

Ready to get started? Awesome! Here’s what you need to do first:

1. **[Setting up your domain hosts](#domain_hosts)** `check appendix 1.0`

   - Set up a new domain pointing from your localhost

2. **[TinyMCE Setup](#setup_tinymce)**: `check appendix 1.1`
   - Head over to **[tinyMCE site](https://www.tiny.cloud/)**, sign up for free, and copy the API keys
     <!-- **NB:** Use the same keys for the API -->
3. **[Firebase Setup](#setup_firebase)**: `check appendix 1.2`
   - Head over to [firebase.google.com](https://firebase.google.com), create a project, enable authentication, and copy the API keys
     <!-- **NB:** Use the same keys for the API -->
4. **[Sample local.env file](#sample_env)**: `check appendix 1.3`

# How to Run the Frontend-Portal (Locally)

To be able to have full access to all the features that comes with this code base and run locally we would suggest you set up the backend [massEnergize API](https://github.com/massenergize/api) as well.

### 1. Run the Frontend-Portal

#### 1.1 Clone and setting up the project

1. Navigate to the [project directory](https://github.com/massenergize/frontend-portal) on github
2. Copy the link to clone the repository to your local
3. Navigate on your local to where you want to keep the project
4. Open the terminal from that directory and paste and run

```sh
git clone https://github.com/massenergize/frontend-portal.git
```

5. Create a `local.env` file in the `root` folder. See [here](#sample_env), to have a view of how the `local.env` should be.
6. Paste in the right values.

#### 1.2 Running the Frontend-Portal

1. **Installing Packages and Dependencies**:

   - Navigate to the root of the project
   - Run the command below in the terminal to install all related packages

   ```sh
        make init
   ```

2. **Running it locally**:
   - Navigate to the file **`/src/config/config.json`** and change the variable **`IS_LOCAL`** to **`true`**
   - Run the command below to start the project
   ```sh
        make start
   ```

## Appendix

### 1.0 Setting up your host domains <a id="domain_hosts"></a>

1. Open your terminal
2. Type this command to go your root directory

#### for Mac/linux

```sh
sudo nano /etc/hosts
```

when the `hosts` file opens add this on a new line in the file

```
127.0.0.1 massenergize.test
127.0.0.1 community.massenergize.test
127.0.0.1 communities.massenergize.test
127.0.0.1 api.massenergize.test
127.0.0.1 share.massenergize.test
```

and then press `control(^) + o` and then `Enter` to write to the `hosts` file.
Press `control(^) + x` to exit the file

#### for Windows

1. Open Notepad as **Administrator**
   - Press the Windows key and type "notepad".
   - Right-click on the "Notepad" application in the search results.
   - Select "Run as administrator" from the context menu.
2. Open the `hosts` file:

   - In Notepad, navigate to File > Open.
   - In the "Open" dialog, change the "Files of type" dropdown to All Files.
   - Now, navigate to the following location:

```
C:\Windows\System32\drivers\etc
```

4. You should see a file named `hosts`. Select it and click "Open".

5. Edit the `hosts` file:

   - Add this to the hosts file

   ```
   127.0.0.1 massenergize.test
   127.0.0.1 community.massenergize.test
   127.0.0.1 communities.massenergize.test
   127.0.0.1 Frontend-Portal.massenergize.test
   127.0.0.1 share.massenergize.test
   ```

6. Save the changes.

### 1.1 Getting tinyMCE api keys: <a id="setup_tinymce"></a>

- Visit the tinyMCE website from [here](https://www.tiny.cloud/).
- Login or sign up to the platform
- Navigate to the `Dashboard` and click `Get your API key`
- Copy the `API Key` and paste it into the `local.env` file

```env
REACT_APP_TINY_MCE_KEY=
```

### 1.2 Setting up Firebase: <a id="setup_firebase"></a>

Firebase setup is crucial for running the Frontend-Portal and enabling authentication.

- Visit [firebase.google.com](https://firebase.google.com) and set up a new project.
- Enable authentication and set your service providers.
- Navigate to the setings tab and add `localhost` and `massenergize.test` to the allowed domains.
- **Set up a web app in the project for frontend credentials.**
  - Go to project overview
  - Click on web app and follow through the steps to configure your frontend

### 1.3 Sample `local.env` File <a id="sample_env"></a>

```env
REACT_APP_TINY_MCE_KEY=
REACT_APP_LOCAL_FIREBASE_API_KEY=
REACT_APP_LOCAL_FIREBASE_AUTH_DOMAIN=
REACT_APP_LOCAL_FIREBASE_DATABASE_URL=
REACT_APP_LOCAL_FIREBASE_PROJECT_ID=
REACT_APP_LOCAL_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_LOCAL_FIREBASE_APP_ID=
```

---
