# CareerPilot AI - Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with this repo pushed
- Vercel account (free at vercel.com)

### Steps

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Deploy to Vercel**:
- Visit https://vercel.com/new
- Import your GitHub repository
- Framework preset: Next.js
- Root directory: `frontend`
- Environment variables:
  - `NEXT_PUBLIC_API_BASE`: Your FastAPI backend URL

3. **Done!** Your app will be live with auto-deployments on push

---

## Docker Deployment

### Prerequisites
- Docker & Docker Compose installed
- FastAPI backend running

### Local Docker Build

1. **Build image**:
```bash
docker build -t careerpilot-frontend:latest .
```

2. **Run container**:
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=http://localhost:8000 \
  careerpilot-frontend:latest
```

3. **Access app**:
```
http://localhost:3000
```

### Docker Compose (with Backend)

1. **Start both services**:
```bash
docker-compose up
```

2. **Stop services**:
```bash
docker-compose down
```

---

## AWS ECS Deployment

### Prerequisites
- AWS Account
- AWS CLI configured
- ECR repository created

### Steps

1. **Build and push image**:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag careerpilot-frontend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/careerpilot-frontend:latest

docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/careerpilot-frontend:latest
```

2. **Create ECS task definition**:
- Container image: ECR image URI
- Port: 3000
- Environment variables:
  - `NEXT_PUBLIC_API_BASE`: Backend URL
  - `NODE_ENV`: production

3. **Create ECS service** and load balancer

---

## Railway.app Deployment

1. **Connect GitHub repo**:
- Visit railway.app
- Create new project
- Connect GitHub repo

2. **Configure**:
- Framework: Next.js
- Root directory: `frontend`
- Environment: Production
- Add environment variables

3. **Deploy**:
- Railway auto-deploys on push

---

## Netlify Deployment

1. **Connect GitHub**:
- Go to netlify.com
- Click "New site from Git"
- Select this repository

2. **Build settings**:
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `.next`

3. **Environment variables**:
- `NEXT_PUBLIC_API_BASE`: Your backend URL

---

## Manual VPS Deployment

### Prerequisites
- VPS with Node.js 18+
- SSH access
- PM2 installed globally

### Steps

1. **SSH into VPS**:
```bash
ssh root@your-vps-ip
```

2. **Clone repository**:
```bash
git clone YOUR_REPO_URL
cd frontend
```

3. **Install dependencies**:
```bash
npm install
npm run build
```

4. **Start with PM2**:
```bash
npm install -g pm2
pm2 start npm --name "careerpilot" -- start
pm2 startup
pm2 save
```

5. **Setup Nginx reverse proxy**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Setup SSL with Certbot**:
```bash
certbot certonly --standalone -d yourdomain.com
# Update Nginx config with SSL paths
systemctl restart nginx
```

---

## DigitalOcean App Platform

1. **Create App**:
- DigitalOcean App Platform
- Connect GitHub
- Select repository

2. **Configure**:
- Component type: Web Service
- Build command: `npm run build`
- Run command: `npm start`
- HTTP port: 3000

3. **Add environment**:
- `NEXT_PUBLIC_API_BASE`
- `NODE_ENV`: production

4. **Deploy**

---

## Fly.io Deployment

1. **Install Fly CLI**:
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**:
```bash
fly auth login
```

3. **Create app**:
```bash
cd frontend
fly launch
```

4. **Configure Dockerfile** (already provided)

5. **Deploy**:
```bash
fly deploy
```

6. **Set environment**:
```bash
fly secrets set NEXT_PUBLIC_API_BASE=your-backend-url
```

---

## Environment Configuration by Platform

### Vercel
- Auto-detects Next.js
- Environment variables in dashboard
- Automatically optimized builds

### Docker
- Set `ENV` instruction in Dockerfile
- Or pass `-e` flag on `docker run`

### AWS ECS
- Set in task definition
- Or use AWS Secrets Manager

### Other Platforms
- Check platform documentation
- Usually via dashboard or config files

---

## Performance Optimization

1. **Enable gzip compression** in Nginx/server
2. **Use CDN** (Cloudflare, CloudFront)
3. **Enable caching headers**
4. **Monitor with** New Relic, DataDog, or Sentry

## Monitoring & Logging

### Sentry (Error tracking)
```
NEXT_PUBLIC_SENTRY_DSN=your-dsn
```

### LogRocket (User session replay)
```
NEXT_PUBLIC_LOGROCKET_ID=your-id
```

### Google Analytics
```
NEXT_PUBLIC_GA_ID=your-id
```

---

## Troubleshooting

**502 Bad Gateway**:
- Check API connection
- Ensure backend is running
- Check environment variables

**Build fails**:
- Clear `.next` folder
- Reinstall dependencies
- Check Node.js version (18+)

**Slow performance**:
- Enable image optimization
- Check API response times
- Use CDN for static assets

---

## Rollback

### Vercel
- Automatic rollback available
- Click "Deployments" → select previous → "Rollback"

### Docker
```bash
docker run -p 3000:3000 careerpilot-frontend:previous-tag
```

### Git
```bash
git revert HEAD
git push
```

---

## Scaling

For high traffic:
- Use CDN for static assets
- Add caching layer (Redis)
- Load balance backend API
- Monitor resource usage
- Auto-scale if using Kubernetes

---

Need help? Check the README.md or open an issue!
