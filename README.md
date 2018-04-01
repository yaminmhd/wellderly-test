# README

## Required Plugins for VS Code

You need to install the following plugins for VS Code.

### Debugger for Chrome

### ESLint

### Jest

### Prettier - Code formatter

## After checkout

Run the following commands

```shell
yarn install
```

## Setup your local MongoDB

To run the server locally, you need a connection to some MongoDB instance.

If you installed the MongoDB on your machine, you can start it with

```shell
mongod --dbpath /path/to/mongodb/storage/directory
```

Note that the `/path/to/mongodb/storage/directory` should exist and you have write permission to it.

## Configure your local .env file

In the `server` directory, you need to add one `.env` file.

You can follow the example in `.env.example` file.

## Start both client and server locally

```shell
yarn start
```

## Deploy to Heroku

This project follows the setup as described in [Running Create React App and Express (CRAE) on Heroku](https://originmaster.com/running-create-react-app-and-express-crae-on-heroku-c39a39fe7851), except that I didn't use babel on the server side.

You can follow the steps below to deploy this application to Heroku.

TODO: add the steps for adding mLab mongodb addon

### Environment Variable in Heroku Application Settings

You need to configure the environment variables you have put in the `server/.env` file:

- NODE_ENV
  - This needs to be set to 'production'
- MONGODB_URI
  - This should have been automatically set by Heroku when you add an `mLab` add-on
- SECRET
  - You need to choose a random secret to sign JWT tokens during authentication

TODO: how to set these variables with heroku CLI

### Deployment Script

```shell
// navigate to the root of your project
// login to Heroku (if you aren't already)
heroku login
// create your heroku project, make sure to replace name-of-my-app, // with the actual name of your app. Note, this name must be unique // across of all heroku. 
heroku create name-of-my-app
// add the latest nodejs build pack to our project
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs#yarn
// push our code to heroku.  This step will take the longest
git push heroku master
// let's launch your app
heroku open
```