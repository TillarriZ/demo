# Vista App — Install & VPS Hosting Guide

This project is a **Next.js 16** app (React 19, TypeScript, Tailwind CSS 4). Below: how to install dependencies and run it locally, then how to host it on a VPS.

---

## 1. Prerequisites

- **Node.js** 18.18 or later (20.x LTS recommended)
- **npm** (comes with Node) or **yarn** / **pnpm**

Check versions:

```bash
node -v   # e.g. v20.x.x
npm -v    # e.g. 10.x.x
```

Install Node from [nodejs.org](https://nodejs.org) or use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 20
nvm use 20
```

---

## 2. Install Dependencies

From the project root (where `Vista AI-HF` is), go into the app folder and install:

```bash
cd vista-app
npm install
```

This uses `package.json` and `package-lock.json` to install:

- **Dependencies:** next, react, react-dom, recharts  
- **DevDependencies:** Tailwind, TypeScript, ESLint, types

If you use **yarn** or **pnpm**:

```bash
cd vista-app
yarn install
# or
pnpm install
```

---

## 3. Run Locally

**Development (hot reload):**

```bash
cd vista-app
npm run dev
```

App: **http://localhost:3000**

**Production build and run:**

```bash
cd vista-app
npm run build
npm run start
```

Again at **http://localhost:3000** (production mode).

---

## 4. Host on a VPS

Assumptions: you have a VPS (Ubuntu/Debian), SSH access, and a domain (optional).

### 4.1 Initial VPS Setup

SSH in and prepare the system:

```bash
ssh root@YOUR_VPS_IP
```

Update and install Node (example with NodeSource for Node 20):

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

Optional: create a non-root user and use it for the app:

```bash
adduser vista
usermod -aG sudo vista
su - vista
```

---

### 4.2 Deploy the App on the VPS

**Option A — Git (recommended)**

On the VPS:

```bash
# If you use Git
cd /var/www   # or ~/apps
sudo mkdir -p /var/www && sudo chown $USER /var/www
git clone YOUR_REPO_URL vista-app
cd vista-app/vista-app
npm install
npm run build
```

**Option B — Upload files (e.g. SCP/rsync)**

From your **local** machine (in the project root):

```bash
rsync -avz --exclude node_modules --exclude .next vista-app/ user@YOUR_VPS_IP:/var/www/vista-app/
```

Then on the VPS:

```bash
cd /var/www/vista-app
npm install
npm run build
```

---

### 4.3 Run with PM2 (keeps app running and restarts on crash)

**Important:** PM2 must run the app with **cwd** set to the Next.js app directory (e.g. `vista-app/`). If you start from `/var/www/demo`, PM2 will look for `package.json` in `/var/www/demo` and fail. Use the **ecosystem file** (recommended) so the app directory is always correct.

Install PM2, then start using the ecosystem file (in the repo under `vista-app/ecosystem.config.cjs`):

```bash
sudo npm install -g pm2
cd /var/www/demo/vista-app   # must be the directory that contains package.json + next
npm run build                # required before first start
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # run the command it prints to enable startup on reboot
```

The ecosystem file sets `cwd` to the app directory automatically, so it works no matter where you cloned the repo.

Useful PM2 commands:

```bash
pm2 status
pm2 logs vista-app
pm2 restart vista-app
pm2 stop vista-app
```

**If you don't use the ecosystem file**, you must run `pm2 start` from inside the app directory and use:

```bash
cd /var/www/demo/vista-app
pm2 start npm --name "vista-app" -- start
```

Starting from `/var/www/demo` (parent) will cause `ENOENT: no such file or directory, open '/var/www/demo/package.json'`.

---

### 4.4 Reverse proxy with Nginx (HTTPS + domain)

Install Nginx and (optionally) Certbot for SSL:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create a site config (replace `yourdomain.com` and `YOUR_VPS_IP`):

```bash
sudo nano /etc/nginx/sites-available/vista-app
```

Paste (and adjust domain / IP):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    # Or use IP: server_name YOUR_VPS_IP;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/vista-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

If you use a domain and want HTTPS:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your app will be available at **https://yourdomain.com** (or http://YOUR_VPS_IP if you didn’t set a domain).

---

### 4.5 PM2 ecosystem file (included in repo)

The project includes `vista-app/ecosystem.config.cjs`, which starts Next.js with `cwd` set to the app directory (using `__dirname`), so PM2 always finds `package.json` and `.next` in the right place. Use it to avoid the "ENOENT package.json" error when the repo lives in a parent folder (e.g. `/var/www/demo/vista-app`):

```bash
cd /var/www/demo/vista-app
pm2 start ecosystem.config.cjs
pm2 save
```

---

## 5. Environment variables (if needed)

If the app uses env vars (e.g. API keys):

1. On the VPS, in the app folder:
   ```bash
   nano .env.local
   ```
2. Add variables (no quotes unless the value has spaces):
   ```env
   NEXT_PUBLIC_API_URL=https://api.example.com
   API_SECRET=your-secret
   ```
3. Rebuild and restart:
   ```bash
   npm run build
   pm2 restart vista-app
   ```

Never commit `.env.local` (it’s in `.gitignore`).

---

## 6. Firewall (recommended on VPS)

Allow SSH, HTTP, and HTTPS; block direct access to Node’s port if Nginx is in front:

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 7. Troubleshooting

### "Could not find a production build in the '.next' directory"

- You must run **`npm run build`** before **`npm run start`** (or before starting with PM2).
- **Build and start must both run from the Next.js app directory** (the folder that contains `package.json` with `next`, e.g. `vista-app/`).

On the VPS, use the directory that contains the Next app (e.g. `/var/www/demo/vista-app`):

```bash
cd /var/www/demo/vista-app
npm run build
pm2 start npm --name "vista-app" -- start
```

If you use a parent folder like `/var/www/demo`, do **not** run `npm start` or PM2 from there; always `cd` into the `vista-app` subfolder first.

### "ENOENT: no such file or directory, open '/var/www/demo/package.json'"

- PM2 is running with the **parent directory** as cwd instead of the app directory. Use the included ecosystem file so `cwd` is always the app folder:
  ```bash
  cd /var/www/demo/vista-app
  pm2 delete vista-app   # remove the old process
  pm2 start ecosystem.config.cjs
  pm2 save
  ```

### "Next.js inferred your workspace root" / multiple lockfiles

- This appears when there is a `package-lock.json` (or other lockfile) in both a parent directory (e.g. `/var/www/demo`) and in the app directory (e.g. `/var/www/demo/vista-app`).
- The project’s **next.config** sets **`outputFileTracingRoot`** so Next.js uses the app directory as the root; redeploy the updated `next.config.ts` and restart.
- Optional: remove the extra lockfile in the parent directory if that folder is not a separate Node project:
  ```bash
  rm /var/www/demo/package-lock.json   # only if you don’t need it
  ```

---

## Quick reference

| Task              | Command (from `vista-app/`) |
|-------------------|-----------------------------|
| Install deps      | `npm install`               |
| Dev server        | `npm run dev`               |
| Production build  | `npm run build`             |
| Production run    | `npm run start`             |
| PM2 start         | `pm2 start npm --name "vista-app" -- start` |
| PM2 restart       | `pm2 restart vista-app`     |

For hosting, the flow is: **install deps → build → run with PM2 → put Nginx in front with optional SSL.**
