# Travel App FEND Capstone

[Project Link](https://wanderlust-plan.herokuapp.com/)

## Table of Contents

* [Project Set Up](#Project-Set-Up)
* [Development Mode](Development-Mode)
* [Production Mode](Production-Mode)
* [Description](#Description)
* [Project Goal](#Project-Goal)
* [Languages](#Languages)
* [Features](#Features)

## Description

Wanderlust Planner is a travel app for the [Udacity's](https://www.udacity.com/) FEND capstone project. The app uses 3 APIs `geonames`, `weatherbit`, and `pixabay` to collect and display data to plan a trip/vacation. The user can save and delete trips. Saved trips and stored in `localStorage` so they are accessable on load.

## Project Set Up

1. `npm i `
2. `npm i ` dependencies found in package.json
3. register for API keys
    1. create account with GeoNames
    2. create account with Weatherbit
    3. create account with Pixabay
4. store keys in a `.env` file
5. gitignore `.env` `dist` and `node_modules`

## Development Mode

1. `npm run build-dev`
2. open `localhost:8081` in browser.

## Production Mode

1. `npm run build-prod` in terminal 
2. `npm run start`
3. open `localhost:8081` in browser.

## Project Goal

- Setting up Webpack
- Sass styles
- Webpack Loaders and Plugins
- Dynamic UI
- Service workers
- Creating layouts
- Page design
- APIs
- Creating requests to external urls

## Languages

* JavaScript
* HTML
* CSS
* JQuery
* Bootstrap

## Features

* Weatherbit API
* GeoNames API
* Pixabay API
* Dynamic UI
* LocalStorage
    * save to & delete from
* Jest testing
* Service Workers
* Webpack