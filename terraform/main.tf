locals {
  app_name               = "MailGenNinja"
  app_name_lower         = "mailgenninja"
  app_short_name         = "mgn"
  github_account         = "DevSecNinja"
  primary_location       = "westeurope"
  primary_location_short = "weu"
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.29.1"
    }
    
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "2.0.0-preview3"
    }
  }

  cloud {
    organization = "ravensberg"

    workspaces {
      name = "MailGenNinja"
    }
  }
}

provider "azurerm" {
  features {}
}

# Obtain client configuration from the un-aliased provider
data "azurerm_client_config" "core" {
  provider = azurerm
}

resource "azurecaf_name" "mailgenninja" {
  name           = local.app_name_lower
  resource_type  = "azurerm_resource_group"
  resource_types = ["azurerm_app_service"] # No Static Web App resource type yet
  prefixes       = []
  suffixes       = []
  clean_input    = true
}

resource "azurerm_resource_group" "mailgenninja" {
  name     = azurecaf_name.mailgenninja.result
  location = local.primary_location
}

# After the Static Site is provisioned, you'll need to associate your target repository,
# which contains your web app, to the Static Site, by following the Azure Static Site document.
# https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration?tabs=github-actions

resource "azurerm_static_site" "mailgenninja" {
  name                = azurecaf_name.mailgenninja.results["azurerm_app_service"]
  resource_group_name = azurerm_resource_group.mailgenninja.name
  location            = azurerm_resource_group.mailgenninja.location

  sku_tier = "Standard"
  sku_size = "Standard"
}
