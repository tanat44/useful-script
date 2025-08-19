1. install crd (custom resource definition) `kubectl create -f https://download.elastic.co/downloads/eck/3.1.0/crds.yaml`
1. install operator `kubectl apply -f https://download.elastic.co/downloads/eck/3.1.0/operator.yaml`


## install with helm chart
```
helm repo add elastic https://helm.elastic.co
helm repo update
```

```
# Install an eck-managed Elasticsearch and Kibana using the default values, which deploys the quickstart examples.
helm install es-kb-quickstart elastic/eck-stack -n elastic-stack --create-namespace
```

## install with manifest
`kubectl apply -k .`