# Mohit Vault - Frontend

A modern, minimal image gallery application built with Next.js 16, featuring JWT authentication and a clean aesthetic design.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your API URL
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Quick Deploy to Vercel

See [QUICK_DEPLOY.md](../QUICK_DEPLOY.md) for 5-minute deployment guide.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── login/          # Login page
│   ├── page.tsx        # Home/Gallery page
│   ├── layout.tsx      # Root layout with providers
│   └── globals.css     # Global styles
├── components/
│   ├── ImageCard.tsx   # Image card component
│   ├── ImageModal.tsx  # Image modal viewer
│   ├── MasonryGrid.tsx # Grid layout
│   ├── Navbar.tsx      # Navigation bar
│   ├── ProtectedRoute.tsx # Auth guard
│   ├── SortDropdown.tsx   # Sort selector
│   ├── ThemeToggle.tsx    # Dark mode toggle
│   └── UploadZone.tsx     # Upload button
├── lib/
│   ├── api.ts          # Axios instance with interceptors
│   ├── auth.tsx        # Auth context provider
│   ├── config.ts       # Environment configuration
│   └── utils.ts        # Utility functions
├── .env.example        # Environment template
├── .env.local          # Local environment (create this)
└── vercel.json         # Vercel configuration
```

## 🔐 Authentication

JWT token-based authentication with:
- Automatic token validation
- Token refresh on app load
- Secure logout with token revocation
- Protected routes

## 🎨 Features

- ✨ Minimal, aesthetic design
- 🌙 Dark mode support
- 📱 Fully responsive
- ♾️ Infinite scroll pagination
- 📤 Image upload
- 🖼️ Image modal viewer
- 🗑️ Image management (view, download, delete)
- 🔄 Sorting options
- 🔒 Protected routes

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description | No |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Theme**: next-themes
- **Icons**: Lucide React

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed guide.

### Other Platforms

```bash
npm run build
```

Deploy the `.next` folder to your hosting platform.

## 🔧 Configuration

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 🐛 Troubleshooting

**Build fails:**
- Check all environment variables are set
- Run `npm run build` locally
- Check Node.js version (>=18.17.0)

**API not connecting:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings
- Ensure backend is accessible

**Images not loading:**
- Check backend image URLs
- Verify CORS headers

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please submit a Pull Request.

---

**Need help?** Check [DEPLOYMENT.md](../DEPLOYMENT.md) for full documentation.

