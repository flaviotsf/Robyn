# Robyn Web UI

This is a NextJS app that uses a simple
SQLite database to start.

Jobs are updated and we can extract columns from the CSV as well as details about the model execution.

Model execution is done via a `child_process` that calls RScript.

Users can keep updated on progress.

You can build the Docker image like this (choose an appropriate tag):
```
docker build -f next.Dockerfile -t flaviosf310/robyn-web:latest . --platform linux/amd64
```

And you can run the Docker image like this.

Passing `--env-file` did not work for me for some reason, so this is the best approach to load your .env locally.

The Python Path variable is here since if you plan to run the NextJS app outside of your Docker environment you may have a different path for reticulate.

```
source docker.env && \
docker run -d \
    -e DATABASE_URL=$DATABASE_URL \
    -e JWT_SECRET=$JWT_SECRET \
    -e PYTHON_PATH=$PYTHON_PATH \
    -p 3000:3000 flaviosf310/robyn-web:latest
```
source docker.env && \
docker run -d -it \
    -e DATABASE_URL=$DATABASE_URL \
    -e JWT_SECRET=$JWT_SECRET \
    -e PYTHON_PATH=$PYTHON_PATH \
    -p 3000:3000 flaviosf310/robyn-web:latest /bin/sh
    ``````

```
Create a cluster:
gcloud container clusters create next-cluster --num-nodes=1
```

