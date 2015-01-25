/**
 * Created by albmin on 1/17/15.
 * I suppose we may have to modularize this
 * in order to get it to import from others, but that
 * brings up issues with some of the params like connections
 *
 * Right now i'm just going to leave in script mode
 */

var port = (process.env.VCAP_APP_PORT || 3000),
    host = (process.env.VCAP_APP_HOST || 'localhost'),
    pg = require('pg'),
    fs = require('fs'),
    psql;


if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    psql = env['postgresql-9.1'][0].credentials;
    // The Postgresql service returns the database name in the
//"name"
    // property but the pg.js Node.js module expects it to be in
//the
    // "database" property.
    psql.database = psql.name;
} else {
 //   console.log('localhost detected')
    // Specify local Postgresql connection properties here.
    psql = getLocalhostCreds('localpg.json');
   // console.log(psql);
}


function getLocalhostCreds(file_path)
{
    //fs.readFile(file_path, 'utf8', function(err,data){
    //    if(err) throw err;
    //    console.log('file data ');
    //    console.log(JSON.parse(data));
     //   return JSON.parse(data);
    //}
    return JSON.parse(fs.readFileSync(file_path, 'utf8'));
}


/**
 * Method to drop all items within a schema
 * @param schema
 */
function nuclear_option(schema)
{
    if (typeof schema === 'undefined')
    {
        schema =  'public';
    }
    console.log("NOTICE: ALL TABLES under schema " + schema + " IN DB ARE BEING DROPPED");
    console.log("THERE SHOULD BE A CONFIRMATION HERE, BUT TOUGH SHIT!");
    pg.connect(psql, function(err,client,done)
    {
        if(err)
        {
            return console.error("Error requesting client", err);
        }
        client.query("drop  schema "  +  schema + " cascade",  function(err, result)
        {
            if(err)
            {
                done();
                return console.error('Error nuking db', err);
            }

            done();
            console.log('db schema successfully nuked');
            //this kills it immediately, probably need a flag if this is module is for multiple transactions
   //         process.exit();
            return;
        });
    });
    //if we get here, we're done
    //process.exit();
}
//getLocalhostCreds()
//while(typeof psql === 'undefined')
//{
//    var xx = 0;
//}

/**
 * Method that will insert the values into the json
 * This method assumes that the json key's coorespond to columns in the db
 * TODO build a helper function that will take a schema to transpose the values in
 *  TODO case the column names are different
 * @param json_data
 */
function insert_values(table_name, json_data)
{
    pg.connect(psql, function(err,client,done)
    {
        if(err)
        {
            return console.error("Error requesting client", err);
        }

        //construct key and value strings
        var keys = "";
        var vals = "";
        for (var i in json_data)
        {
            keys += i;
            keys += ', ';
            vals += json_data[i];
            vals += ', ';
        }
        //slice off the trailing commas
        vals.slice(0, -2);
        keys.slice(0,-2);

        //debug lines
        console.log(vals);
        console.log(keys);

        client.query("INSERT INTO " + table_name + "(" + keys+ ")" +
        " VALUES(" + vals + ")");
    })
}


//method calls for manual running of this script (not recommended, should be modulized)
//nuclear_option();
