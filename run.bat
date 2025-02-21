TITLE DatabaseViewer

docker-compose up -d

docker exec -i postgres psql -U username -d database < backup.sql
