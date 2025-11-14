# 🚀 Deployment Guide

This guide covers various deployment options for the Rontgen/CT-Scan AI Interpreter application.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- ✅ All dependencies are installed (`npm install`)
- ✅ Build succeeds without errors (`npm run build`)
- ✅ Environment is properly configured
- ✅ .gitignore is in place
- ✅ Documentation is complete

---

## 🏗️ Build for Production

### 1. Production Build

```bash
# Build the application
npm run build
```

This creates optimized files in the `dist/` folder:
- `dist/index.html` - Entry point
- `dist/assets/` - CSS and JS bundles

### 2. Preview Production Build Locally

```bash
# Preview the production build
npm run preview
```

Access at `http://localhost:4173`

---

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended)

This application is a pure frontend SPA, perfect for static hosting.

#### A. Netlify

1. **Via Git (Recommended)**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Configure on Netlify**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy!

3. **Manual Deploy**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build
   npm run build
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

#### B. Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Build first
   npm run build
   
   # Deploy
   vercel --prod
   ```

3. **Or via Vercel Dashboard**
   - Import Git repository
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

#### C. GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/Cogniscan"
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/Cogniscan/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

#### D. AWS S3 + CloudFront

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Configure bucket policy for public read

3. **Upload files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **Configure CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Set default root object: `index.html`
   - Configure error pages (404 → index.html)

#### E. Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   - Public directory: `dist`
   - Single-page app: Yes
   - Automatic builds: No

3. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

---

## 🐳 Docker Deployment (Optional)

### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build and Run

```bash
# Build image
docker build -t rontgen-ai-interpreter .

# Run container
docker run -p 80:80 rontgen-ai-interpreter
```

---

## ⚙️ Environment Configuration

### Important Notes

1. **No Server-Side Environment Variables**
   - This is a client-side only application
   - API keys are configured in the Settings page
   - No `.env` file needed for production

2. **User Configuration**
   - Users must configure their OpenAI API key after deployment
   - Settings stored in browser localStorage
   - No server configuration required

---

## 🔒 Security Considerations

### Before Deployment

1. **Review .gitignore**
   - Ensure sensitive files are excluded
   - Don't commit API keys
   - Don't commit environment files

2. **Content Security Policy (Optional)**
   Add to index.html `<head>`:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline'; 
                  style-src 'self' 'unsafe-inline'; 
                  connect-src 'self' https://api.openai.com;">
   ```

3. **HTTPS Only**
   - Always deploy with HTTPS
   - Required for clipboard API
   - Required for secure localStorage

---

## 🎯 Post-Deployment

### 1. Verify Deployment

**Check these functionalities:**
- [ ] Application loads correctly
- [ ] Navigation works (all routes)
- [ ] Settings page accessible
- [ ] Image upload works
- [ ] API calls to OpenAI succeed (with valid key)
- [ ] LocalStorage persists data
- [ ] Download/copy features work
- [ ] Responsive design on mobile

### 2. Test User Flow

```
1. Open application
2. Go to Settings → Enter API key → Save
3. Create New Interpretation
4. Upload test image
5. Run AI interpretation
6. View results
7. Check history
8. View detail page
9. Test export features
```

### 3. Performance Check

Use Chrome DevTools Lighthouse:
- Performance score
- Best practices
- SEO
- Accessibility

---

## 📊 Monitoring (Optional)

### Add Analytics

#### Google Analytics

Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Custom error logging

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './dist'
        production-deploy: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🛠️ Troubleshooting

### Build Fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routes Don't Work (404 on refresh)

Configure your hosting for SPA:
- All routes should serve `index.html`
- Set up proper rewrites/redirects

**Netlify**: Create `public/_redirects`
```
/*    /index.html   200
```

**Vercel**: Automatic with SPA detection

**Nginx**: Use `try_files $uri $uri/ /index.html;`

### Large Bundle Size

1. Check bundle size:
   ```bash
   npm run build
   ```

2. Optimize if needed:
   - Code splitting
   - Lazy loading
   - Tree shaking (automatic with Vite)

### CORS Issues

- OpenAI API: Should work (CORS enabled)
- If issues: Check `dangerouslyAllowBrowser: true` is set

---

## 📋 Deployment Checklist

### Pre-Deploy
- [ ] Code is committed to Git
- [ ] Build succeeds locally
- [ ] Tests pass (if any)
- [ ] Documentation updated
- [ ] Dependencies audited (`npm audit`)

### Deploy
- [ ] Choose hosting platform
- [ ] Configure build settings
- [ ] Deploy application
- [ ] Verify deployment

### Post-Deploy
- [ ] Test all features
- [ ] Check performance
- [ ] Verify HTTPS
- [ ] Test on mobile
- [ ] Share with users

### Maintenance
- [ ] Monitor for errors
- [ ] Keep dependencies updated
- [ ] Respond to user feedback
- [ ] Plan feature updates

---

## 🎉 You're Ready to Deploy!

Choose your preferred hosting option and follow the steps above.

**Recommended for beginners:** Netlify or Vercel (easiest, free tier available)

**For enterprise:** AWS S3 + CloudFront or custom infrastructure

---

## 📞 Need Help?

- Check [QUICKSTART.md](QUICKSTART.md) for setup
- Review [README.md](README.md) for overview
- See [USAGE_GUIDE.md](USAGE_GUIDE.md) for features

**Good luck with your deployment!** 🚀
