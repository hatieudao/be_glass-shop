import { MONGO_CONNECTION_STRING } from '../constant';

export default () => ({
  [MONGO_CONNECTION_STRING]: process.env[MONGO_CONNECTION_STRING],
});
