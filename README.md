# DastKari - South Asian Artisanal Marketplace

<div align="center">
  <h3>دستکاری</h3>
  <p><em>Where Heritage Meets Innovation</em></p>
</div>

## 🎯 Overview

DastKari (دستکاری) is a premium e-commerce platform dedicated to preserving and promoting South Asian artisanal craftsmanship. Our platform connects master artisans with global audiences, offering carefully curated artifacts while telling the stories behind each piece.

## 💫 Our Story

The idea for DastKari was born from a profound realization: while South Asia's rich artisanal heritage spans millennia, these incredible craft traditions were struggling to find their place in the digital age. During a journey through remote villages in Pakistan, our founders witnessed master artisans creating breathtaking pieces, yet struggling to reach markets beyond their local communities. They saw how traditional crafts, passed down through generations, were at risk of being lost as younger generations moved away from these ancestral professions.

This challenge sparked an innovative solution: what if we could use cutting-edge technology to not only preserve these ancient crafts but also make them accessible and appealing to a global audience? What if we could use AI and AR to help people appreciate the intricate details of handcrafted pieces, just as they would in person?

DastKari emerged from this vision - a platform that bridges the gap between ancient craftsmanship and modern technology, between traditional artisans and contemporary consumers, between cultural heritage and digital innovation.

## 🤖 AI & Immersive Technology

DastKari leverages cutting-edge artificial intelligence and augmented reality to revolutionize how people experience traditional craftsmanship:

### AI-Powered Features

- **Intelligent Product Recommendations**: Our AI assistant analyzes user preferences, cultural interests, and browsing patterns to suggest perfectly matched artisanal pieces
- **Cultural Context Engine**: AI-driven insights that explain the historical and cultural significance of each artifact
- **Automatic 3D Model Generation**: Revolutionary AI technology that creates detailed 3D models of artisanal pieces from regular prompts
- **Personalized Cultural Journey**: AI-curated content that helps users discover and learn about different craft traditions

### Augmented Reality Experience

- **Virtual Try-On**: Place artifacts in your space using AR technology to see exactly how they'll look
- **Interactive 3D Viewing**: Examine every detail of artisanal pieces in 3D from any angle
- **Craft Process Visualization**: AR demonstrations of traditional crafting techniques
- **Size and Scale Visualization**: Accurate AR scaling to understand the true dimensions of pieces
- **Environmental Integration**: See how pieces interact with different lighting conditions in your space

## 🌟 Our Vision

DastKari envisions a world where traditional craftsmanship thrives in the digital age. We aim to:

- Preserve centuries-old artistic traditions through technological innovation
- Create sustainable livelihoods for artisan communities
- Bridge the gap between ancient craftsmanship and modern consumers
- Document and digitize traditional design techniques for future generations
- Empower artisans with digital tools and global market access

## 🏺 Cultural Impact & Heritage Preservation

DastKari revolutionizes the preservation of South Asian heritage through:

### Digital Documentation

- Detailed documentation of traditional techniques and processes
- High-quality visual archives of regional design patterns
- Recording oral histories and artisan narratives
- Creating a living library of craft traditions
- AI-powered pattern recognition for design preservation
- 3D scanning and modeling of historical artifacts
- Virtual reality archives of workshop environments
- Interactive tutorials preserving traditional techniques

### Artisan Empowerment

- Direct market access for remote artisan communities
- Fair trade practices and transparent pricing
- Skills development and digital literacy programs
- Community-based quality control systems

### Cultural Education

- Interactive learning experiences about craft traditions
- Virtual workshops with master artisans
- Cultural context for each artifact
- Regional craft mapping and documentation

## ✨ Core Features

### For Customers

- **Curated Marketplace**: Browse authentic South Asian artifacts with detailed provenance
- **Interactive 3D Previews**: AI-powered 3D model generation for selected products
- **Cultural Blog**: In-depth articles about heritage, techniques, and artisan stories
- **Smart Chat Assistant**: Context-aware product recommendations and cultural insights
- **Virtual Try-On**: Preview artifacts in your space using AR technology
- **Secure Checkout**: Multiple payment options with robust security

### For Administrators

- **Comprehensive Dashboard**: Real-time analytics and sales tracking
- **Inventory Management**: Track stock levels and manage product listings
- **Content Management**: Blog post editor with rich media support
- **Order Processing**: Streamlined order fulfillment and tracking

## 🛠 Technical Architecture

### Client Application (`/Client`)

```typescript
// Next.js 14 with TypeScript
// Key dependencies:
{
  "next": "14.1.0",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^11.0.6",
  "@react-three/fiber": "^8.17.14",
  "zustand": "^4.5.1"
}
```

### Server Application (`/Server`)

```javascript
// Node.js with Express
// Key dependencies:
{
  "express": "^4.19.2",
  "mongoose": "^8.6.1",
  "openai": "^4.82.0",
  "jsonwebtoken": "^9.0.2"
}
```

### Admin Dashboard (`/Admin`)

```typescript
// Next.js with TypeScript
// Key dependencies:
{
  "next": "^14.2.4",
  "apexcharts": "^3.45.2",
  "@tinymce/tinymce-react": "^5.1.1"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn
- Git

### Environment Setup

1. **Client Environment Variables** (`Client/.env`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_preset
NEXT_PUBLIC_MESHY_API_KEY=your_meshy_key
```

2. **Server Environment Variables** (`Server/.env`):

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

3. **Admin Environment Variables** (`Admin/.env`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_preset
```

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dastkari.git
cd dastkari
```

2. Install dependencies for all applications:

```bash
# Client
cd Client && npm install

# Server
cd ../Server && npm install

# Admin
cd ../Admin && npm install
```

3. Start development servers:

```bash
# Server (Port 4000)
cd Server && npm run dev

# Client (Port 3000)
cd Client && npm run dev

# Admin (Port 3001)
cd Admin && npm run dev
```

## 📁 Project Structure

```
dastkari/
├── Client/                 # Customer-facing Next.js application
│   ├── app/               # Next.js 14 app directory
│   ├── components/        # Reusable UI components
│   └── public/            # Static assets
│
├── Server/                # Express.js backend
│   ├── controllers/       # Request handlers
│   ├── models/           # MongoDB schemas
│   └── routes/           # API routes
│
└── Admin/                # Administrative dashboard
    ├── src/              # Source code
    ├── components/       # Admin UI components
    └── public/           # Static assets
```

## 🔒 Security Measures

- JWT-based authentication
- Secure password hashing with bcrypt
- Rate limiting on sensitive endpoints
- XSS protection
- CORS configuration
- Input validation and sanitization
- Secure HTTP headers

## 🎨 Design System

- **Typography**: Custom font stack with Satoshi and traditional Urdu fonts
- **Color Palette**: Rich earthy tones inspired by South Asian crafts
- **Components**: Custom UI components with cultural motifs
- **Animations**: Smooth transitions using Framer Motion
- **Responsive Design**: Mobile-first approach

## 📈 Performance Optimization

- Image optimization with next/image
- Lazy loading of components
- Code splitting
- Server-side rendering
- Caching strategies
- CDN integration

## 👥 Team

- Product Manager: [Name]
- Lead Developer: [Name]
- UI/UX Designer: [Name]
- Backend Developer: [Name]

For support, please email support@dastkari.com
