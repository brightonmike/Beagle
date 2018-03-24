# Gene Beagle

A Node.js app that runs a bunch of FE tests, returns a success or fail, and stores the data.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:brightonmike/Beagle.git or clone your own fork
$ cd Beagle
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Running a test

`curl localhost:5000?url=YOUR_URL_HERE`

Get a cuppa and wait. This may take some time.

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