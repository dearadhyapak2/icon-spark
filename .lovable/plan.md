

## PNG Icon Download App

### Overview
A curated icon library where users can browse, search, and download PNG icons for free. Users create accounts to save favorites and track downloads.

### Pages & Features

**1. Home / Browse Page**
- Hero section with search bar and tagline ("Unlimited Free PNG Icons")
- Category grid (e.g., Social Media, Business, Nature, Technology, UI, Arrows, etc.)
- Trending/popular icons section
- Icon grid with lazy-loading

**2. Category Page**
- Filtered icon grid by category
- Search within category
- Sort options (newest, popular)

**3. Icon Detail Modal**
- Icon preview at multiple sizes (16px, 32px, 64px, 128px, 256px)
- Download button (PNG) with size selector
- Add to favorites button (requires login)
- Tags and related icons

**4. Search Results Page**
- Search by keyword with results grid
- Filter by category

**5. Authentication**
- Sign up / Log in pages (email-based via Supabase)
- Password reset flow

**6. User Dashboard**
- Saved/favorited icons
- Download history

### Built-in Icon Collection
- Bundle ~200+ icons from Lucide (already installed) rendered as PNGs
- Organized into 8-10 categories
- Icons rendered to canvas and exported as PNG for download

### Backend (Supabase)
- **Auth**: Email sign-up/login
- **Profiles table**: username, avatar
- **Favorites table**: user_id, icon_name
- **Download tracking table**: user_id, icon_name, timestamp

### Design
- Clean, minimal white design with grid layout
- Responsive for mobile and desktop
- Dark mode support

