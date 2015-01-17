Seeing as there aren't too many 'nice' tools for bluemix and postgres, this (soon to be) module will act as a wrapper over pg to do basic SQL operations over bluemix. Currently the only option is nuclear (delete a schema), but more will be added.
To use on localhost (or other connection), please specify a localpg.json file with the following json:
  
{
  "database": "employees",
  "host": "localhost",
  "port": 5432,
  "user": "",
  "password": "",
  "ssl": false
}

