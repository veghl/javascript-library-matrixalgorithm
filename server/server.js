const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // Adjust the path to reach index.html
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})