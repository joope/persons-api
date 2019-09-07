import express from 'express';
import users from './routes/users';
 
const app = express();
 
app.use('/users', users);

app.get('/health', (req, res) => {
  res.send('Hello mummy!');
});
 
app.listen(5000);