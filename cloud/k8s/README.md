# Steps

## Create External IP in GCP

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml

kubectl -n cert-manager get all

kubectl apply -f issuer-lets-encrypt-production.yaml


```