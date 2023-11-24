# RESTful-Express-MongoDB

A RESTful API made utilizing Node.js, Express, and MongoDB that allows the user to create, read, update, and delete notes.

API Endpoints:

Auth:

POST /auth/signup: create a new user account
POST /auth/login: login to an existing account and receive an access token

Notes:

GET /notes: get a list of all notes for the authenticated user.
GET /notes/:id : get a note by ID for the authenticated user.
POST /notes: create a new note for the authenticated user.
PUT /notes/:id : update an existing note by ID for the authenticated user.
DELETE /notes/:id : delete a note by ID for the authenticated user.
POST /notes/:id/share: share a note with another user for the authenticated user.
GET /search?keyword=:query : search for notes based on keywords for the authenticated user.
