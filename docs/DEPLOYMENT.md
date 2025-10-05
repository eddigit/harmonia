# Guide de Déploiement Harmonia

Ce guide détaille les différentes options pour déployer Harmonia en production.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Déploiement avec Docker](#déploiement-avec-docker)
3. [Déploiement Manuel](#déploiement-manuel)
4. [Déploiement Cloud](#déploiement-cloud)
5. [Configuration Production](#configuration-production)
6. [Monitoring et Logs](#monitoring-et-logs)
7. [Sécurité](#sécurité)

---

## 🔧 Prérequis

### Serveur Minimum
- CPU : 2 cores
- RAM : 4 GB
- Stockage : 20 GB
- OS : Linux (Ubuntu 20.04+ recommandé)

### Logiciels Requis
- Docker & Docker Compose (pour déploiement Docker)
- Node.js 18+ (pour déploiement manuel)
- Python 3.9+ (pour déploiement manuel)
- Nginx (recommandé comme reverse proxy)

### Dépendances Système (pour traitement audio)
```bash
sudo apt-get update
sudo apt-get install -y \
    libsndfile1 \
    ffmpeg \
    rubberband-cli
```

---

## 🐳 Déploiement avec Docker

### Option 1 : Docker Compose (Recommandé)

1. **Cloner le repository**
```bash
git clone https://github.com/your-org/harmonia.git
cd harmonia
```

2. **Configuration**
```bash
# Frontend
cp frontend/.env.example frontend/.env
# Modifier VITE_API_URL avec votre domaine

# Backend
cp backend/.env.example backend/.env
```

3. **Build et démarrage**
```bash
docker-compose up -d --build
```

4. **Vérifier les logs**
```bash
docker-compose logs -f
```

### Option 2 : Docker Production

Créer un `docker-compose.prod.yml` :

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.votre-domaine.com/api
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - backend_uploads:/app/uploads
      - backend_outputs:/app/outputs
    restart: unless-stopped

volumes:
  backend_uploads:
  backend_outputs:

networks:
  harmonia_network:
    driver: bridge
```

Démarrage :
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔨 Déploiement Manuel

### Backend (Python Flask)

1. **Installation**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Configuration**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs de production
```

3. **Utiliser Gunicorn pour la production**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

4. **Service Systemd**
Créer `/etc/systemd/system/harmonia-backend.service` :

```ini
[Unit]
Description=Harmonia Backend Service
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/harmonia/backend
Environment="PATH=/var/www/harmonia/backend/venv/bin"
ExecStart=/var/www/harmonia/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 "app:create_app()"
Restart=always

[Install]
WantedBy=multi-user.target
```

Activer le service :
```bash
sudo systemctl enable harmonia-backend
sudo systemctl start harmonia-backend
```

### Frontend (React)

1. **Build**
```bash
cd frontend
npm install
npm run build
```

2. **Servir avec Nginx**
Créer `/etc/nginx/sites-available/harmonia` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/harmonia/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts pour le traitement audio
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }

    # Limite de taille des fichiers uploadés
    client_max_body_size 100M;
}
```

Activer le site :
```bash
sudo ln -s /etc/nginx/sites-available/harmonia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. **SSL avec Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

---

## ☁️ Déploiement Cloud

### AWS (Elastic Beanstalk)

1. **Installation AWS EB CLI**
```bash
pip install awsebcli
```

2. **Initialisation**
```bash
cd backend
eb init -p python-3.9 harmonia-backend
```

3. **Déploiement**
```bash
eb create harmonia-prod
eb deploy
```

### Heroku

1. **Backend**
```bash
cd backend
heroku create harmonia-backend
git push heroku main
```

2. **Frontend (Vercel)**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### DigitalOcean

1. **App Platform**
   - Connecter votre repository GitHub
   - Configurer les composants (frontend + backend)
   - Déployer automatiquement

---

## ⚙️ Configuration Production

### Variables d'Environnement

**Backend (.env)**
```env
FLASK_ENV=production
SECRET_KEY=votre-clé-secrète-très-longue-et-aléatoire
MAX_UPLOAD_SIZE=104857600
CORS_ORIGINS=https://votre-domaine.com

# Si base de données
DATABASE_URL=postgresql://user:pass@host/db

# Stockage S3 (optionnel)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=harmonia-audio
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://api.votre-domaine.com/api
```

### Optimisations Production

1. **Frontend**
   - Minification automatique avec Vite
   - Code splitting
   - Lazy loading des composants

2. **Backend**
   - Utiliser Gunicorn avec plusieurs workers
   - Activer la mise en cache
   - Compression gzip

3. **CDN**
   - Utiliser CloudFlare ou AWS CloudFront
   - Cache des assets statiques

---

## 📊 Monitoring et Logs

### Logs Backend

**Avec systemd :**
```bash
sudo journalctl -u harmonia-backend -f
```

**Avec Docker :**
```bash
docker-compose logs -f backend
```

### Monitoring

**Installation de monitoring basique :**
```bash
# Prometheus + Grafana
docker run -d -p 9090:9090 prom/prometheus
docker run -d -p 3001:3000 grafana/grafana
```

**Métriques importantes :**
- Temps de traitement audio
- Taille des fichiers traités
- Erreurs API
- Utilisation CPU/RAM
- Espace disque

### Alertes

Configurer des alertes pour :
- Erreurs 500
- Espace disque < 10%
- CPU > 90%
- Temps de réponse > 30s

---

## 🔒 Sécurité

### Checklist Sécurité

- [ ] HTTPS activé (SSL/TLS)
- [ ] Firewall configuré (UFW)
- [ ] Limites de rate limiting
- [ ] Validation des entrées utilisateur
- [ ] CORS configuré correctement
- [ ] Secrets en variables d'environnement
- [ ] Logs de sécurité activés
- [ ] Mises à jour régulières
- [ ] Backups automatiques

### Configuration Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### Rate Limiting

Ajouter dans Nginx :
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api {
    limit_req zone=api burst=20;
    # ... reste de la config
}
```

### Nettoyage des Fichiers Temporaires

Créer un cron job :
```bash
# /etc/cron.daily/harmonia-cleanup
#!/bin/bash
find /var/www/harmonia/backend/uploads -type f -mtime +1 -delete
find /var/www/harmonia/backend/outputs -type f -mtime +1 -delete
```

---

## 🔄 Mises à Jour

### Avec Docker

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Manuel

```bash
# Backend
cd backend
source venv/bin/activate
git pull origin main
pip install -r requirements.txt
sudo systemctl restart harmonia-backend

# Frontend
cd frontend
git pull origin main
npm install
npm run build
```

---

## 📱 Scaling

### Horizontal Scaling

1. **Load Balancer** (Nginx)
```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

2. **Redis pour sessions** (si authentification)
```python
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.from_url('redis://localhost:6379')
```

### Vertical Scaling

- Augmenter les workers Gunicorn
- Augmenter la RAM du serveur
- Utiliser un CPU plus puissant

---

## 🆘 Dépannage

### Problèmes Courants

1. **Erreur "File too large"**
   - Augmenter `client_max_body_size` dans Nginx
   - Augmenter `MAX_UPLOAD_SIZE` dans le backend

2. **Timeout pendant le traitement**
   - Augmenter les timeouts Nginx
   - Augmenter le timeout Gunicorn

3. **Erreur FFmpeg/Rubberband**
   - Vérifier l'installation des dépendances système
   - Vérifier les permissions

---

## 📞 Support

Pour toute question sur le déploiement :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**Bonne chance avec votre déploiement ! 🚀**
