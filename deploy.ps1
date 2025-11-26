# VPS Deployment Script for Windows PowerShell
# Usage: .\deploy.ps1

param(
    [string]$VpsUser = "root",
    [string]$VpsIp = "31.97.239.130",
    [string]$Domain = "ageasfederal.me"
)

Write-Host "🚀 Starting deployment to $Domain..." -ForegroundColor Green

# Build the application
Write-Host "📦 Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
if (Get-Command tar -ErrorAction SilentlyContinue) {
    tar -czf dist.tar.gz dist/ nginx.conf
} else {
    # Use PowerShell compression if tar is not available
    Compress-Archive -Path "dist\*", "nginx.conf" -DestinationPath "dist.zip" -Force
}

Write-Host "📡 Uploading to VPS..." -ForegroundColor Yellow
Write-Host "Please ensure you have SSH access configured to $VpsIp" -ForegroundColor Cyan

# Instructions for manual upload if automated deployment is not available
Write-Host @"

🔧 MANUAL DEPLOYMENT STEPS:

1. Upload the build files to your VPS:
   scp -r dist/* $VpsUser@${VpsIp}:/var/www/$Domain/
   scp nginx.conf $VpsUser@${VpsIp}:/tmp/

2. SSH into your VPS:
   ssh $VpsUser@$VpsIp

3. Run these commands on your VPS:

   # Install required packages
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx

   # Create web directory
   sudo mkdir -p /var/www/$Domain
   
   # Copy nginx configuration
   sudo cp /tmp/nginx.conf /etc/nginx/sites-available/$Domain
   sudo ln -sf /etc/nginx/sites-available/$Domain /etc/nginx/sites-enabled/
   
   # Remove default nginx site if it exists
   sudo rm -f /etc/nginx/sites-enabled/default
   
   # Get SSL certificate
   sudo certbot --nginx -d $Domain -d www.$Domain
   
   # Test and reload nginx
   sudo nginx -t
   sudo systemctl reload nginx
   sudo systemctl enable nginx

4. Your application will be live at: https://$Domain

"@ -ForegroundColor Cyan

Write-Host "✅ Build package created successfully!" -ForegroundColor Green
Write-Host "📁 Files ready for deployment in dist/ folder" -ForegroundColor Green