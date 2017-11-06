import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './db/connect';
import posts from './routes/posts.routes';
let app = express();

connectToDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/api', posts);
app.listen(3005, () => {
    console.log('server started - 3005');
});