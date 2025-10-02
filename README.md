# ChurchKit - Essential Tools for Worship Leaders

A comprehensive Next.js platform designed specifically for worship leaders and church musicians. Convert sheet music, find perfect keys, manage setlists, and create chord charts - all in one place.

## 🚀 Features

### AI-Powered Sheet Music Conversion
- Upload sheet music images (JPG, PNG, PDF)
- Convert to Planning Center Services format
- AI-powered chord and lyric extraction
- Batch processing support

### Key Finder for Vocalists
- Find perfect keys for singer's vocal range
- Intelligent recommendations based on comfort level
- Visual range indicators
- Capo position suggestions

### Setlist Timer
- Plan worship set timing
- Drag-and-drop song management
- Time breakdown by song type
- Export functionality

### Chord Chart Generator
- Visual chord placement interface
- Click-to-add chord functionality
- Planning Center format export
- Real-time preview

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 Vision API
- **Database**: Supabase
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Supabase account and project

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd church-tools-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up Supabase database**
   
   Create the following tables in your Supabase project:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE,
     songs_processed INTEGER DEFAULT 0,
     is_pro BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Songs table
   CREATE TABLE songs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     artist TEXT,
     original_key TEXT,
     chords_and_lyrics TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

   -- Create policies (adjust as needed for your auth setup)
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can view own songs" ON songs FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own songs" ON songs FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
church-tools-platform/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── process-sheet/ # Sheet music processing
│   │   └── transpose/     # Chord transposition
│   ├── tools/             # Tool pages
│   │   ├── sheet-music/   # Sheet music converter
│   │   ├── key-finder/    # Key finder tool
│   │   ├── setlist-timer/ # Setlist timer
│   │   └── chord-chart/   # Chord chart generator
│   ├── pricing/           # Pricing page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── Navigation.tsx     # Main navigation
│   ├── ToolCard.tsx       # Tool card component
│   ├── UsageTracker.tsx   # Usage tracking
│   ├── ImageUpload.tsx    # File upload component
│   ├── OutputEditor.tsx   # Text output editor
│   ├── TransposeControls.tsx # Chord transposition
│   └── Footer.tsx         # Footer component
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── openai.ts          # OpenAI client
│   ├── music-theory.ts    # Music theory utilities
│   └── types.ts           # TypeScript types
└── README.md
```

## 🔧 Configuration

### OpenAI API Setup
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file
3. Ensure you have credits in your OpenAI account

### Supabase Setup
1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env.local` file
4. Run the SQL commands above to set up your database

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Usage

### Sheet Music Converter
1. Navigate to `/tools/sheet-music`
2. Upload clear images of your sheet music
3. Click "Process Images" to convert
4. Use transpose controls to adjust key
5. Copy the formatted output

### Key Finder
1. Go to `/tools/key-finder`
2. Set your vocalist's comfortable range
3. Enter the original song key
4. Get recommendations sorted by difficulty

### Setlist Timer
1. Visit `/tools/setlist-timer`
2. Add songs with durations and types
3. Drag to reorder as needed
4. Export your setlist

### Chord Chart Generator
1. Open `/tools/chord-chart`
2. Paste your lyrics
3. Click words to add chords
4. Export in Planning Center format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub
- **Email**: support@churchkit.com (placeholder)

## 🙏 Acknowledgments

- Built with love for worship leaders everywhere
- Powered by OpenAI's GPT-4 Vision API
- Styled with Tailwind CSS
- Icons by Lucide React

---

**Made with ❤️ for worship leaders**
