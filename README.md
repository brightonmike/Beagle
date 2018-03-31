# Beagle

A Node.js app that runs a bunch of FE tests, returns a success or fail, and stores the data.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

You also need to be running Redis: `redis-server`. If you do not have Redis, install it using homebrew.

```sh
$ git clone git@github.com:brightonmike/Beagle.git or clone your own fork
$ cd Beagle
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

The first time you run Beagle, you'll need to authenticate on Google. Follow these steps:

- Login to your google account in your browser.
- Use this [wizard](https://console.developers.google.com/start/api?id=sheets.googleapis.com) to create or select a project in the Google Developers Console and automatically turn on the API.
- After landing to the console page, click Continue button.
- Now click on Go to credentials button.
- On the Add credentials to your project page, click the Cancel button.
- Click on the OAuth consent screen tab.
- Select an Email address, enter a Product name if not already set, and click the Save button.
- Select the Credentials tab (probably it’s already selected by now), click the Create credentials button and select OAuth client ID.
- Select the application type Other and enter the name “WhatsoeverYouWant”, and click the Create button.
- Click OK to dismiss the resulting dialog.
- You should see a download icon at the right side. Click on this to download the json file containing credentials.
- Rename the file as credentials.json and save in the `lib` directory of your the Beagle folder.

The first time you run Beagle locally and request a report, the app will generate and store locally a Refresh Token. It should not need to do this again.

## Running a test

Visit localhost:5000 in your browser. You can also ping the webhook:

`localhost:5000/generate/?url=YOUR_URL_HERE`

In browser, the most crucial metrics are displayed. This includes your page speed scores, lighthouse scores, and key metrics from WebPageTest.

This data is also inserted into Google Sheets.

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

Coming soon.