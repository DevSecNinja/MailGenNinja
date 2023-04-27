#
# Description: This file creates the Azure Container Registry (ACR) resource.
#

resource "azurecaf_name" "acr" {
  name = local.app_name_lower
  resource_type = "azurerm_container_registry"
  prefixes      = []
  suffixes      = []
  clean_input   = true
}

resource "azurerm_container_registry" "acr" {
  name                          = azurecaf_name.acr.result
  location                      = azurerm_resource_group.mailgenninja.location
  resource_group_name           = azurerm_resource_group.mailgenninja.name
  sku                           = "Basic" # Premium
  admin_enabled                 = false
  public_network_access_enabled = true

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_role_assignment" "acr_sa_pull" {
  principal_id         = data.azurerm_client_config.core.object_id
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
}

resource "azurerm_role_assignment" "acr_sa_push" {
  principal_id         = data.azurerm_client_config.core.object_id
  role_definition_name = "AcrPush"
  scope                = azurerm_container_registry.acr.id
}

# Internal Container Apps

resource "azurerm_role_assignment" "aca_sa_pull" {
  principal_id         = "e1d5af1c-86de-4ebf-98a7-62064e394408"
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
}
