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

resource "azurecaf_name" "mailgenninja" {
  name           = local.app_name_lower
  resource_type  = "azurerm_resource_group"
  resource_types = "azurerm_app_service" # No Static Web App resource type yet
  prefixes       = []
  suffixes       = [local.primary_location_short]
  clean_input    = true
}

resource "azurerm_resource_group" "mailgenninja" {
  name     = azurecaf_name.mailgenninja.result
  location = local.primary_location
}

resource "azurerm_static_web_app" "mailgenninja" {
  name                = azurecaf_name.mailgenninja.results["azurerm_app_service"]
  resource_group_name = azurerm_resource_group.mailgenninja.name
  location            = azurerm_resource_group.mailgenninja.location

  sku_name = "Free"

  repository_url = "https://github.com/${local.github_account}/${local.app_name}"
  branch         = "main"

  root_directory = "/"
  api_directory  = "api"
  app_location   = "build"

  build_command = "npm run build"
}
