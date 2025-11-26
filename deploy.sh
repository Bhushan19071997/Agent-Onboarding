#!/bin/bash

# VPS Deployment Script for Agent Onboarding Application
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment to ageasfederal.me..."

# Configuration
DOMAIN="ageasfederal.me"
VPS_IP="31.97.239.130"
VPS_USER="root"  # Change this to your VPS username
WEB_ROOT="/var/www/$DOMAIN"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
SERVICE_NAME="agent-onboarding"

echo "📦 Building application..."
npm run build

echo "📡 Connecting to VPS ($VPS_IP)..."

# Create deployment package
tar -czf dist.tar.gz dist/ nginx.conf

# Upload and deploy
scp dist.tar.gz $VPS_USER@$VPS_IP:/tmp/
scp nginx.conf $VPS_USER@$VPS_IP:/tmp/

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

DOMAIN="ageasfederal.me"
WEB_ROOT="/var/www/$DOMAIN"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

echo "🔧 Setting up directories..."
sudo mkdir -p $WEB_ROOT
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

echo "📋 Extracting files..."
cd /tmp
sudo tar -xzf dist.tar.gz -C $WEB_ROOT --strip-components=1

echo "⚙️ Configuring Nginx..."
sudo cp nginx.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/$DOMAIN

echo "🔒 Setting up SSL with Let's Encrypt..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo "🔄 Restarting services..."
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx

echo "🧹 Cleaning up..."
rm -f /tmp/dist.tar.gz /tmp/nginx.conf

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is now live at https://$DOMAIN"
ENDSSH

# Cleanup local files
rm -f dist.tar.gz

echo "🎉 Deployment to https://$DOMAIN completed successfully!"
echo ""
echo "🔗 Your application is now available at:"
echo "   https://ageasfederal.me"
echo ""
echo "📊 Demo credentials:"
echo "   Admin: admin / admin123"
echo "   Manager: manager / manager123"
echo "   Operator: operator / operator123"