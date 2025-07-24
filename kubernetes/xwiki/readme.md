helm repo add xwiki-helm https://xwiki-contrib.github.io/xwiki-helm

helm install -f values.yaml xwiki xwiki-helm/xwiki --namespace xwiki
helm upgrade -f values.yaml xwiki xwiki-helm/xwiki --namespace xwiki

helm uninstall xwiki --namespace xwiki