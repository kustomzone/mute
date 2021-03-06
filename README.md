# MUTE

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-rc.1.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `npm run gh-deploy` to deploy to Github Pages.

## Building Docker image

A basic `Dockerfile` is provided. It is based on the official [NGINX](https://hub.docker.com/_/nginx/) container (built on top of [Alpine Linux](https://alpinelinux.org/)) that will serve the packaged angular application.

Run `ng build` to build the application.
Then, run `docker build -t 'coast-team/mute' .` to build the container image.

You can start a new container using the following command `docker run -it -p 80:80 coast-team/mute`.

## Note on Service Worker

The application actually use
[`sw-precache`](https://github.com/GoogleChrome/sw-precache).
In order to deploy the app:
  ng build -prod -aot
  npm run precache

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
