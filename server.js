const express = require('express');

const app = express();

app.use(express.static('./dist'));
app.use('/webbot-system', express.static('./webbot-system'))

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist'}),
);

app.listen(process.env.PORT || 8080);