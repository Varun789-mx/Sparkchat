# 💬 Sparkchat

A modern, intelligent chatbot application built with Next.js. Sparkchat provides a seamless conversational interface with AI-powered responses, designed for smooth user interactions and real-time communication.

## ✨ What It Does

Sparkchat is an interactive chatbot that allows users to have natural conversations through a clean, modern web interface. The application provides:

- **Intelligent Conversations** - Natural language understanding and contextual responses
- **Real-time Interaction** - Instant message processing with smooth UI updates
- **User-Friendly Interface** - Intuitive chat interface that works on any device
- **Modern Architecture** - Built on Next.js 14+ for optimal performance
- **Responsive Design** - Seamlessly adapts to desktop, tablet, and mobile screens

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Varun789-mx/Sparkchat.git
   cd Sparkchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your configuration:
   ```env
   API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Alternative package managers
yarn dev            # Using Yarn
pnpm dev            # Using pnpm
bun dev             # Using Bun
```

## 🛠️ Built With

- **[Next.js](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Geist Font](https://vercel.com/font)** - Modern font family by Vercel

## 📁 Project Structure

```
Sparkchat/
├── app/              # Next.js App Router
│   ├── page.tsx      # Main chat interface
│   ├── layout.tsx    # Root layout
│   └── api/          # API routes
├── components/       # React components
├── lib/              # Utilities and helpers
├── public/           # Static assets
├── styles/           # Global styles
├── .env.example      # Environment variables template
└── package.json      # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# API Configuration
API_KEY=your_api_key_here

# Optional: Custom configuration
NEXT_PUBLIC_APP_NAME=Sparkchat
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository on [Vercel](https://vercel.com/new)
3. Configure environment variables
4. Deploy

For other platforms, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 💡 Usage

1. Start the application using `npm run dev`
2. Open http://localhost:3000 in your browser
3. Type your message in the chat input
4. Press Enter or click Send to submit
5. View AI-generated responses in real-time
6. Continue your conversation naturally

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Harsh pandey**
- GitHub: [@Varun789-mx](https://github.com/Varun789-mx)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

⭐ If you find this project useful, please consider giving it a star!
