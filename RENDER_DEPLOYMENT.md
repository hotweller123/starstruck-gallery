# Deploying Starstruck Gallery to Render

This guide walks you through deploying the Starstruck Gallery TanStack Start application to Render.

## Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. Your project pushed to a GitHub, GitLab, or Bitbucket repository

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push the render.yaml to your repository**

   ```bash
   git add render.yaml
   git commit -m "Add Render deployment configuration"
   git push
   ```

2. **Create a new Blueprint on Render**
   - Go to your [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select your repository
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to create the service

### Option 2: Manual Setup

1. **Create a new Web Service**
   - Go to your [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure the service**
   - **Name**: `starstruck-gallery` (or your preferred name)
   - **Region**: Choose the closest to your users
   - **Branch**: `main` (or your default branch)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`

3. **Set Environment Variables**
   - Click "Advanced" to expand options
   - Add the following environment variables:
     - `NODE_VERSION`: `20.x`
     - `NODE_ENV`: `production`
     - `HOST`: `0.0.0.0`
     - `PORT`: `10000`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## Important Configuration Notes

### Build Settings

The application uses Vite and TanStack Start, which requires:

- **Build Command**: `npm install && npm run build` - This installs dependencies and builds the production bundle
- **Start Command**: `node dist/server.js` - This runs the built TanStack Start server

### Port Configuration

Render assigns a dynamic port via the `PORT` environment variable. The TanStack Start server will use this port. The `HOST` environment variable is set to `0.0.0.0` to ensure the server binds to all network interfaces.

### Node Version

The application requires Node.js 20.x or higher for optimal compatibility with the dependencies.

## Post-Deployment Steps

1. **Verify the deployment**
   - Once deployed, Render will provide a URL like `https://starstruck-gallery.onrender.com`
   - Visit the URL to ensure the application is running correctly

2. **Custom Domain (Optional)**
   - In your Render service settings, go to "Settings" → "Custom Domains"
   - Add your custom domain and follow the DNS configuration instructions

3. **Enable Auto-Deploy (Optional)**
   - In your service settings, go to "Settings" → "Build & Deploy"
   - Enable "Auto-Deploy" to automatically deploy when you push to your branch

## Troubleshooting

### Build Failures

- Check the build logs in the Render dashboard
- Ensure all dependencies are listed in `package.json`
- Verify that the `postinstall` script runs successfully

### Runtime Errors

- Check the service logs in the Render dashboard
- Ensure the `PORT` environment variable is being used
- Verify that all required environment variables are set

### Performance Issues

- Consider upgrading to a paid Render plan for better performance
- The free tier may have cold starts after periods of inactivity

## Environment Variables

Currently, this application doesn't require any specific environment variables beyond the standard Render ones. However, if you add features that require configuration, add them in the Render dashboard under "Environment" settings.

## Monitoring

- Use Render's built-in metrics to monitor your application
- Set up health check alerts in the service settings
- The health check path is configured as `/` in the render.yaml

## Support

For Render-specific issues:

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)

For application-specific issues:

- Check the application logs in the Render dashboard
- Review the TanStack Start documentation
