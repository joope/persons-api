import express from 'express';
import users from './routes/users';
 
const app = express();
 
app.get('/', (req, res) => res.send('ok'));

app.use('/users', users);

export default app;