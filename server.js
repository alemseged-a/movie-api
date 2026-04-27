const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    
    if (req.url === '/movies' && req.method === 'GET') {
        const data = fs.readFileSync('data.json');
        return res.end(data);
    }

    
    if (req.url === '/movies' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const newMovie = JSON.parse(body);

            const data = JSON.parse(fs.readFileSync('data.json'));

            newMovie.id = Date.now();

            data.push(newMovie);

            fs.writeFileSync('data.json', JSON.stringify(data));

            res.end("Movie added");
        });

        return;
    }

    
    if (req.url.startsWith('/movies/') && req.method === 'GET') {
        const id = req.url.split('/')[2];

        const data = JSON.parse(fs.readFileSync('data.json'));

        const movie = data.find(m => m.id == id);

        return res.end(JSON.stringify(movie));
    }

    
    if (req.url.startsWith('/movies/') && req.method === 'PUT') {
        const id = req.url.split('/')[2];

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const updated = JSON.parse(body);

            let data = JSON.parse(fs.readFileSync('data.json'));

            data = data.map(movie =>
                movie.id == id ? { ...movie, ...updated } : movie
            );

            fs.writeFileSync('data.json', JSON.stringify(data));

            res.end("Updated");
        });

        return;
    }

    
    if (req.url.startsWith('/movies/') && req.method === 'DELETE') {
        const id = req.url.split('/')[2];

        let data = JSON.parse(fs.readFileSync('data.json'));

        data = data.filter(movie => movie.id != id);

        fs.writeFileSync('data.json', JSON.stringify(data));

        return res.end("Deleted");
    }

    
    res.end("Route not found");
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});