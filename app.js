var oracledb = require('oracledb');
// var dbConfig = require('./dbconfig.js');
var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');    
    next();
});

app.put('/put', (req, res) => {
    async function run() {
        let connection;
        let id = parseInt(req.body.id);
        const [year,month,day] = req.body.date.split("-"); 
        let tr_date = new Date(year,month,day);
        let origin = req.body.origin;
        let destination = req.body.destination;
        let mode2 = req.body.mode;
        let amt = parseInt(req.body.amt);

        console.log(typeof id, tr_date,typeof tr_date,typeof origin,typeof destination,typeof mode,typeof amt);
        try {
            let sql, binds, options, result;
            connection = await oracledb.getConnection({
                user: 'mydb',
                password: 'oracle',
                connectString: 'localhost/XE'
            });

            sql = "UPDATE TRAVEL SET travel_date=:tr_date, origin=:origin, destination=:dest, mode_transport=:mode2, amount=:amt WHERE id=:id";

            binds = [tr_date, origin, destination, mode2, amt, id];

            options = {
                autoCommit: true
            }
            result = await connection.execute(sql, binds, options);

            console.log("Number of rows inserted:", result.rowsAffected);

            res.send("CORRECT");
        } catch (err) {
            console.log(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    run();
});

app.post('/post', (req, res) => {
    async function run() {
        console.log(req.body, "BODY");
        let connection;
        let valid = false;
        let reqId = parseInt(req.body.id);
        console.log(reqId, typeof reqId);
        if (((typeof reqId) === "number") && ((req.body.name).length >= 1)) {
            console.log("if true")
            valid = true;
        } else {
            console.log("else");
            res.send("WAPAS BHEJ");
            return
        }
        // console.log(req.body);
        // console.log(typeof id);

        // // let data = req.body.data;
        // console.log(typeof data);
        try {

            let sql, binds, options, result;

            connection = await oracledb.getConnection({
                //   hostname      : "localhost",
                //   port          : "1521",
                user: "mydb",
                password: "oracle",
                //   sid: "xe",
                connectString: "localhost/XE"
            });

            // Create a table

            //   await connection.execute(
            //     `BEGIN
            //        EXECUTE IMMEDIATE 'DROP TABLE travel';
            //        EXCEPTION
            //        WHEN OTHERS THEN
            //          IF SQLCODE NOT IN (-00942) THEN
            //            RAISE;
            //          END IF;
            //      END;`);

            //   await connection.execute(
            //     `CREATE table "TRAVEL" (
            //         "ID"             NUMBER NOT NULL,
            //         "NAME"           VARCHAR2(50),
            //         "EMAIL"          VARCHAR2(100),
            //         "TRAVEL_DATE"    DATE,
            //         "ORIGIN"         VARCHAR2(50),
            //         "DESTINATION"    VARCHAR2(50),
            //         "MODE_TRANSPORT" VARCHAR2(10),
            //         "AMOUNT"         NUMBER,
            //         constraint  "TRAVEL_PK" primary key ("ID")
            //     ) `);

            // Insert some data

            sql = `INSERT INTO "TRAVEL" (id,name,email) VALUES (:1, :2, :3)`;
            if (valid) {
                let id = req.body.id;
                let name = req.body.name;
                let email = req.body.email;
                binds = [id, name, email];
            }

            // For a complete list of options see the documentation.
            options = {
                autoCommit: true,
                // batchErrors: true,  // continue processing even if there are data errors
                bindDefs: [{
                        type: oracledb.NUMBER
                    },
                    {
                        type: oracledb.STRING,
                        maxSize: 50
                    },
                    {
                        type: oracledb.STRING,
                        maxSize: 100
                    }
                ]
            };

            result = await connection.execute(sql, binds, options);

            console.log("Number of rows inserted:", result.rowsAffected);

            // Query the data

            //   sql = `SELECT * FROM travel`;

            //   binds = {};

            // For a complete list of options see the documentation.
            //   options = {
            // outFormat: oracledb.OBJECT   // query result format
            // extendedMetaData: true,   // get extra metadata
            // fetchArraySize: 100       // internal buffer allocation size for tuning
            //   };

            //   result = await connection.execute(sql, binds, options);

            //   console.log("Column metadata: ", result.metaData);
            //   console.log("Query results: ");
            //   console.log(result.rows);

            //   sql = `UPDATE mytab SET data= :bla where ID= :blabla`;

            //   binds = ['Anirudha','103'];

            //   options = {
            //       autoCommit: true
            //   };

            //   result = await connection.execute(sql, binds, options);

            //   console.log("Number of rows inserted:", result.rowsAffected);



            // Query the data

            //   sql = `SELECT * FROM mytab`;

            //   binds = {};

            //   // For a complete list of options see the documentation.
            //   options = {
            //     outFormat: oracledb.OBJECT   // query result format
            //     // extendedMetaData: true,   // get extra metadata
            //     // fetchArraySize: 100       // internal buffer allocation size for tuning
            //   };

            //   result = await connection.execute(sql, binds, options);

            //   console.log("Column metadata: ", result.metaData);
            //   console.log("Query results: ");
            //   console.log(result.rows);

            res.send("HO GYA");


        } catch (err) {
            console.error(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    run();
    //   res.send("HO GYA");
});


app.listen('8000', (err) => {
    if (err)
        throw err;
    console.log('Server running');
})