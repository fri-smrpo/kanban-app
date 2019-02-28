# KANBAN APP

## Requirements

 - [Node v7.6+](https://nodejs.org/en/download/current/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

Install dependencies:

```bash
yarn install
```

Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
yarn start
```

## Running in Production

```bash
yarn run prod
```

## Test

```bash
# run all tests with Mocha
yarn test

# run unit tests
yarn test:unit

# run integration tests
yarn test:integration

# run all tests and watch for changes
yarn test:watch

# open nyc test coverage reports
yarn coverage
```
