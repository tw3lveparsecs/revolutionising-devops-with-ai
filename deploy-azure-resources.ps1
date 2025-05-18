param(
  [Parameter(Mandatory = $true)]
  [string]$ResourceGroupName,

  [Parameter(Mandatory = $false)]
  [string]$Location = "eastus",

  [Parameter(Mandatory = $false)]
  [string]$BaseName = "revolutionising-devops"
)

# Login to Azure (if not already logged in)
$loginStatus = az account show --query "user.name" -o tsv 2>$null
if (-not $loginStatus) {
  Write-Host "Logging in to Azure..."
  az login
}

# Check if resource group exists, if not create it
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
  Write-Host "Creating resource group '$ResourceGroupName'..."
  az group create --name $ResourceGroupName --location $Location
}

# Deploy Bicep template
Write-Host "Deploying Azure resources from Bicep template..."
$deploymentOutput = az deployment group create `
  --resource-group $ResourceGroupName `
  --template-file azure-infrastructure.bicep `
  --parameters baseName=$BaseName location=$Location `
  --output json | ConvertFrom-Json

# Extract output values
$appServiceUrl = $deploymentOutput.properties.outputs.appServiceUrl.value
$staticWebAppUrl = $deploymentOutput.properties.outputs.staticWebAppUrl.value
$mongodbConnectionString = $deploymentOutput.properties.outputs.mongodbConnectionString.value

Write-Host "`nDeployment completed successfully!" -ForegroundColor Green
Write-Host "`nResource Information:" -ForegroundColor Cyan
Write-Host "App Service URL: $appServiceUrl"
Write-Host "Static Web App URL: $staticWebAppUrl"

# Generate GitHub secrets command examples
Write-Host "`nTo set up your GitHub repository secrets, run the following commands:" -ForegroundColor Yellow
Write-Host "gh secret set AZURE_CREDENTIALS -b'$(az ad sp create-for-rbac --name 'github-workflow-sp' --role contributor --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$ResourceGroupName --sdk-auth | ConvertTo-Json -Compress)'"
Write-Host "gh secret set MONGODB_CONNECTION_STRING -b'$mongodbConnectionString'"

# Get Static Web App deployment token
$staticWebAppName = "$BaseName-client"
Write-Host "`nTo get your Static Web App deployment token, run:" -ForegroundColor Yellow
Write-Host "az staticwebapp secrets list --name $staticWebAppName --query 'properties.apiKey' -o tsv"
Write-Host "Then set this value as STATIC_WEB_APP_DEPLOY_TOKEN in your GitHub repository secrets."