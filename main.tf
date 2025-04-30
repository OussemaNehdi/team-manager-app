provider "vsphere" {
  user           = "your-vmware-username"
  password       = "your-vmware-password"
  vsphere_server = "your-vmware-server-ip"
  allow_unverified_ssl = true
}

resource "vsphere_virtual_machine" "k3s_master" {
  name             = "k3s-master"
  resource_pool_id = "your-resource-pool-id"
  datacenter_id    = "your-datacenter-id"
  num_cpus         = 2
  memory           = 2048
  disk {
    size = 20
  }

  network_interface {
    network_id   = "your-network-id"
    adapter_type = "vmxnet3"
  }

  clone {
    template_uuid = "your-template-uuid"
  }
}

resource "vsphere_virtual_machine" "k3s_worker" {
  name             = "k3s-worker"
  resource_pool_id = "your-resource-pool-id"
  datacenter_id    = "your-datacenter-id"
  num_cpus         = 2
  memory           = 2048
  disk {
    size = 20
  }

  network_interface {
    network_id   = "your-network-id"
    adapter_type = "vmxnet3"
  }

  clone {
    template_uuid = "your-template-uuid"
  }
}
