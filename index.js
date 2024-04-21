//this imports the postgres connector into the file so it can be used
const { Client } = require('pg');

//instantiates a client to connect to the database, connection settings are passed in
const client = new Client({
    user: process.env.db_user,
    host: process.env.db_host,
    database: 'case',
    password: process.env.db_password,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

//the lambda funtion code
exports.handler = async (event) => {

    if (!client._connected) {
        await client.connect();
    }

    try {
        // Decode the base64 message
        let base64string = JSON.stringify(event.messages[0].data);
        let buffer = Buffer.from(base64string, 'base64');
        let msg = buffer.toString('utf8');

        // Start a PostgreSQL transaction
        await client.query('BEGIN');

        // Query the database
        const selectResult = await client.query('SELECT * FROM cases where title = $1', [msg]);
        console.log('Select Result:', selectResult.rows);

        if (selectResult.rowCount === 1) {
            // Update the database
            const updateResult = await client.query('UPDATE cases SET published = true where title = $1', [msg]);
            console.log('Update Result:', updateResult.rowCount);

            // Commit the transaction
            await client.query('COMMIT');
        } else {
            console.log('Find duplicate cases:', selectResult.rows);
        }

    } catch (error) {
        console.error('Transaction error:', error);
        await client.query('ROLLBACK');
    } finally {
        //await client.end();
    }

};