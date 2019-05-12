# rdv-communication-test
Test React / Node / Scrapping


# API
API is reachable at `localhost:3000/api`

- `get /annonces` : Get all annonces
- `get /annonces/:id`: Get a specific annonces with `:id` being the id of the document on mongo database
- `post /annonces`: Start the scrapping, parameters:
    - `startingPage:[Number]`: (Optional) Set starting page of scrapping. Default is `1`
    - `numberOfPage:[Number]`: (Optional) Set number of pages to scrap. Default is `1`
    - `numberOfElements:[Number]`(Optional) Set number of elements to scrap on the page. Default is `10`


# Mongo Credential
- user: rdv-com
- password: SoCB36i2YqBomWrV


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console

### `npm test`

Launches back-end test
