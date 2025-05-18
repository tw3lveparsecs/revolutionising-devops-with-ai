# Azure Deployment Guide for React + Node.js + MongoDB Application

This guide will walk you through deploying your full-stack application (React frontend, Node.js backend, and MongoDB database) to Azure using GitHub Actions.

## Architecture Overview

The deployment uses these Azure services:

- **Azure App Service**: Hosts the Node.js backend API
- **Azure Static Web App**: Hosts the React frontend
- **Azure Cosmos DB with MongoDB API**: Provides the MongoDB database

## Prerequisites

- Azure subscription
- GitHub account and repository with your application code
- GitHub repository secrets configured (see below)

## Deployment Steps

### 1. Set Up Authentication for GitHub Actions

You'll need to create a service principal for GitHub Actions to authenticate with Azure:

```bash
# Login to Azure
az login

# Create a service principal and configure its access to Azure resources
az ad sp create-for-rbac --name "github-workflow-sp" --role contributor \
                         --scopes /subscriptions/{subscription-id} \
                         --sdk-auth
```

Take the JSON output and create the following secrets in your GitHub repository:

- `AZURE_CLIENT_ID`: Client ID from the JSON
- `AZURE_TENANT_ID`: Tenant ID from the JSON
- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID
- `REPO_GITHUB_TOKEN`: A GitHub fine-grained access token with `secrets`:`Read and write` access scoped to this repository only

### 2. Deploy Azure Infrastructure

You can deploy the infrastructure in two ways:

#### Option 1: Using GitHub Actions (Recommended)

1. Navigate to the "Actions" tab in your GitHub repository
2. Select the "Deploy Azure Infrastructure" workflow
3. Click "Run workflow"
4. Enter the following information:
   - **Resource Group Name**: Name for your Azure resource group
   - **Azure Region Location**: Azure region (e.g., eastus)
   - **Base name for resources**: Base name for all your resources

The workflow will:

- Create the Azure resource group if it doesn't exist
- Deploy all resources using the Bicep template
- Extract and store the MongoDB connection string and Static Web App deployment token as GitHub secrets
- Display URLs and other important information

#### Option 2: Using Local PowerShell Script

Alternatively, you can run the deployment script locally:

```powershell
# Run the deployment script
./deploy-azure-resources.ps1 -ResourceGroupName "your-resource-group-name"
```

Then manually set up the GitHub secrets as instructed by the script output.

### 3. Configure GitHub Actions Workflow

The application deployment GitHub Actions workflow (`.github/workflows/azure-deploy.yml`) is already set up to:

- Build and test your Node.js backend
- Deploy the backend to Azure App Service
- Build the React frontend with the correct API URL
- Deploy the frontend to Azure Static Web App

This workflow will run automatically on pushes to the main branch, or you can trigger it manually from the Actions tab.

### 4. Verify Deployment

After the workflow runs successfully:

1. Access your frontend at the Static Web App URL
2. Test your API endpoints at the App Service URL
3. Verify that the application is connecting to the MongoDB database

## Additional Configuration

### Environment Variables

The backend automatically receives these environment variables:

- `MONGODB_URI`: Connection string to your Cosmos DB
- `NODE_ENV`: Set to 'production'

For the frontend, environment variables are set during the build process:

- `REACT_APP_API_URL`: URL of your backend API

### Custom Domain Setup (Optional)

To configure custom domains:

- For the backend API: Configure in Azure App Service > Custom Domains
- For the frontend: Configure in Azure Static Web App > Custom Domains

### Monitoring and Logs

- Backend logs: Available in Azure App Service > Monitoring > Log stream
- Frontend: Available in Azure Static Web App > Monitoring
- Database: Available in Cosmos DB > Monitoring

## Troubleshooting

1. **Connection Issues**: Verify that the MongoDB connection string is correctly set in GitHub secrets
2. **Deployment Failures**: Check the GitHub Actions logs for detailed error information
3. **CORS Errors**: Ensure your backend has CORS configured to allow requests from your frontend URL
4. **Authentication Issues**: Verify that AZURE_CREDENTIALS secret is properly formatted and has correct permissions
5. **"Stuck on Loading" Issues**: If your application is deployed but gets stuck on loading screens:
   - Verify that `REACT_APP_API_URL` is correctly set during the build process with the actual backend URL
   - Check that the URL doesn't have trailing slashes that could cause path resolution problems
   - Examine browser console logs (F12 developer tools) for any API connection errors
   - Ensure CORS is properly configured with the correct frontend origin URL

## References

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
