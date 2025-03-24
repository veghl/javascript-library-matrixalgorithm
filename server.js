const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/examples', express.static(path.join(__dirname, 'examples')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});