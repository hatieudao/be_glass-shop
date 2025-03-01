import { PORT, DOMAINNAME } from '../constant';

export default () => ({
  [PORT]: process.env[PORT],
  [DOMAINNAME]: process.env[DOMAINNAME],
});
