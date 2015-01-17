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
 * @param req
 * @param res
 * @param schema
 */
function nuclear_option(req,res, schema)
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
            process.exit();
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
nuclear_option();
