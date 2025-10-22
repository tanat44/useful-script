## install on ansible control (host)
running on linux or mac (no windows)
python3 -m venv venv
source venv/bin/activate
pip3 install ansible passlib

## prerequisite on nodes (control plane + workers)
- tested with ubuntu 24.04lts
- ansible host has access to nodes via public key
- prepare the following files
    - `var.yaml`
    - `asset/registries.yaml`

## step1: create user
to create non root user
1. set ansible_user in inventory.yaml to 'root'
1. ansible-playbook -i inventory.yaml playbook/1-create-user.yaml --extra-vars "@var.yaml"

## step2: install k3s control plane
1. set ansible_user in inventory.yaml to 'tanut'
1. ansible-playbook -i inventory.yaml playbook/2-install-k3s-cp.yaml --extra-vars "@var.yaml" -K

## step3: install k3s worker
ansible-playbook -i inventory.yaml playbook/3-install-k3s-worker.yaml --extra-vars "@var.yaml" -K