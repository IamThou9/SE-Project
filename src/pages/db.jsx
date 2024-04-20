import axios from 'axios';

const connection = axios.create({
  baseURL: 'http://your-mysql-host:3306',
  auth: {
    username: 'your-mysql-username',
    password: 'your-mysql-password'
  }
});

export default connection;