import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_USER,
} from '../constant';

export default () => ({
  [MYSQL_HOST]: process.env[MYSQL_HOST],
  [MYSQL_DATABASE]: process.env[MYSQL_DATABASE],
  [MYSQL_USER]: process.env[MYSQL_USER],
  [MYSQL_PASSWORD]: process.env[MYSQL_PASSWORD],
});
