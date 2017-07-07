# Demo for Computational Intelligence

This code covers an implementation of the ideas presented in the submitted article. Some of the entry points are listed here:

- Configuration: `core/src/configs/config-core.js`
- Weighting methods: `core/src/modules/matrix.js`
- Similarity measures: `core/src/modules/vectors.js`
- Feature extraction: `core/src/modules/tokens.js`
- Validation methods: `core/src/utilities/validation.js`

## Hosted demo
A hosted demo is available at:
http://coin.fastclass.de

## Run demo locally
To run a local version of the demo:
1. clone the repository
2. navigate to directory `app`
3. build from source (see below)
4. start a web server in the `dist` folder
5. navigate your browser to the location

## Build from source
To build the demo from source you need to have the following tools globally installed:
- *npm* (https://nodejs.org/en/download/)

Execute the following steps to set up the development environment (in directory `app`). A build will be automatically generated into `dir`.
- `npm install`

To generate a new build from source into `dir`:
- `gulp build`
