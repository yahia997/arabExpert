const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const app = express();

const router = require("./routes");
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/", router);

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('database connected successfully');
});

const uri = "mongodbURI is secret";
mongoose.connect(uri, { useNewUrlParser: true }); 


app.listen(port, () => {
    console.log(`app is listening on port ${port}...`);
});
