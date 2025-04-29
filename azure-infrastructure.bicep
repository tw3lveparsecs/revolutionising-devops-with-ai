@description('Base name for all resources')
param baseName string = 'revolutionising-devops'

@description('Location for all resources')
param location string = resourceGroup().location

@description('App Service Plan SKU')
param appServicePlanSku string = 'B1'

@description('CosmosDB capacity mode')
@allowed(['Serverless', 'Provisioned'])
param cosmosCapacityMode string = 'Serverless'

// Resource naming
var appServiceName = '${baseName}-api'
var appServicePlanName = '${baseName}-asp'
var staticWebAppName = '${baseName}-client'
var cosmosAccountName = replace('${baseName}-db', '-', '')
var cosmosDatabaseName = 'application'
var cosmosCollectionName = 'items'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// App Service for API/Backend
resource appService 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~18'
        }
        {
          name: 'MONGODB_URI'
          value: cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
      ]
    }
  }
}

// Static Web App for Frontend
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// CosmosDB Account with MongoDB API
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosAccountName
  location: location
  kind: 'MongoDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    databaseAccountOfferType: 'Standard'
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
    apiProperties: {
      serverVersion: '4.2'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capacity: {
      totalThroughputLimit: cosmosCapacityMode == 'Provisioned' ? 400 : null
    }
  }
}

// CosmosDB Database
resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: cosmosDatabaseName
  properties: {
    resource: {
      id: cosmosDatabaseName
    }
  }
}

// CosmosDB Collection
resource cosmosCollection 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2023-04-15' = {
  parent: cosmosDatabase
  name: cosmosCollectionName
  properties: {
    resource: {
      id: cosmosCollectionName
      shardKey: { _id: 'Hash' }
      indexes: [
        {
          key: { keys: ['_id'] }
        }
      ]
    }
  }
}

// Output only non-sensitive values
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output staticWebAppUrl string = staticWebApp.properties.defaultHostname
output cosmosAccountName string = cosmosAccountName
output appServiceName string = appServiceName
output staticWebAppName string = staticWebAppName
