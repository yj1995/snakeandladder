const express = require('express');
const path = require('path');
const app = express();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));

    app.get('/', (req, res) => {
        console.log(path);
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    })
}
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
