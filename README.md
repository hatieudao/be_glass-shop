#DB docker

```
docker build -t ceramic-cups-db -f DBdocker-file .
```

```
docker run -d \
  -p 3306:3306 \
  --name ceramic-cups-db \
  -v mysql_data:/var/lib/mysql \
  ceramic-cups-db
```
