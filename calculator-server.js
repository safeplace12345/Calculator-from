const http        = require("http");
const url         = require('url');
const querystring = require('querystring');
const server      = http.createServer( handleRequests );

function renderPage( numA, numB ){

    numA = Number( numA.trim() );
    numB = Number( numB.trim() );

    return ` 
        <!DOCTYPE html>
        <html>
        <head>
            <title>Calculator</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.min.css">
            <style>mark { padding: 0 20px; }</style>
        </head>
        <body>
            <h1>Congratulations! Calculation: ${ numA } + ${ numB } = ${ numA + numB }</h1>
            <p>Input <strong>number_a</strong>: <mark>${numA}</mark></p>
            <p>Input <strong>number_b</strong>: <mark>${numB}</mark></p>
        </body>
    </html>
   `

}

function handleRequests( request, response ){

    const chunks = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => {

        let number_a;
        let number_b;

        if ( request.method === "GET" ){

            const { query } = url.parse( request.url, true );
            number_a = query.number_a;
            number_b = query.number_b;

        } else if ( request.method === "POST" ){

            const data = Buffer.concat(chunks).toString();
            number_a = querystring.parse(data).number_a;
            number_b = querystring.parse(data).number_b;

        } else {

            return response.end( "Sorry, this server can only handle GET and POST HTTP methods" );

        }

        if ( !number_a || !number_b ){

            response.writeHead( 200, { 'Content-Type':'text/html' });
            return response.end(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Calculator</title>
                    </head>
                    <body>
                        <h1 style="color:tomato">Sorry, having problem finding form data (number_a, number_b)</h1>
                    </body>
                </html>
                `);      
    
        }

        response.writeHead( 200, { 'Content-Type':'text/html' });
        return response.end( renderPage( number_a, number_b ) );      

    });

}

server.listen( 8080, ()=>{
    console.log( "SERVER LISTENING AT PORT 8080" );
});
