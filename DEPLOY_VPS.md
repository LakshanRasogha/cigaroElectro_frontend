# VPS Deployment

## App Requirements

- Node.js 20+
- npm 10+
- A reachable backend URL for `NEXT_PUBLIC_API`
- A domain configured in Google OAuth if Google login is used

## First-Time Setup

1. Copy `.env.example` to `.env.local` on the VPS and fill in the real values.
2. Install dependencies with `npm ci`.
3. Build the app with `npm run build`.
4. Start it with PM2:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Update Deploy Flow

```bash
git pull
npm ci
npm run build
pm2 restart cigaroelectro-frontend
```

## Nginx Reverse Proxy Example

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Notes

- Update `NEXT_PUBLIC_API` to the production backend URL before building.
- If Google login is enabled, add the production domain to the allowed origins in Google Cloud.
- Rebuild after every environment change because `NEXT_PUBLIC_*` values are embedded at build time.
