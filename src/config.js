// Configuration for different environments
const config = {
  development: {
    socketUrl: 'http://localhost:3001'
  },
  production: {
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'https://your-app.railway.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const socketUrl = config[environment].socketUrl; 