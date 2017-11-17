Get Started 
==================

Run all programs at once (require concurrently installed by npm)

npm start

Ghost:

prerequisites: MySQL
```
npm install --production

npm start
```

Go to localhost:2368/ghost to set up 

Modify the config.js for database setting. (For production and development)

-------

NodeBB
```
npm install

./nodeBB setup

(set port as 3000)
(url: http://4000v-cis-swen90014-wcplatypus-l.eng.unimelb.edu.au/forum)

./nodeBB start
```

Login as admin

In Extend, activate nodebb-plugin-blog-comments and nodebb-plugin-sso-oauth

Copy library.js from Other->Nodebb-plugin-oauth and paste it into /NodeBB-master/node_modules/nodebb-plugin-sso-oauth

Restart NodeBB

Go to Plugins -> Blog Comments. Put Ghost information in it.

Restart NodeBB

-------

OAuth Server
```
npm install
```

An Error will occur: "js-bson: Failed to load c++ bson extension, using pure JS version"

Open authorization-server/node_modules/connect-mongo/node_modules/mongodb/node_modules/bson/ext/index.js

Change Line 15 bson = require('../build/Release/bson'); to bson = require('bson');

-------

Tools
```
npm install

npm start
```

----------------------------

Examples:

OauthClient (Others/0-auth-client)

A client demonstrates how to acceess protected API with a registered user.

Run
```
npm start
```