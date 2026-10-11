# Probashi Seba Malaysia (প্রবাসী সেবা মালয়েশিয়া)
## Blogger-Powered Expatriate News, Notices & Services Portal

A modern, responsive, bilingual (Bengali & English) web application for Bangladeshi expatriates living and working in Malaysia. All news, notices, circulars, and announcements are directly published and managed via **Blogger** (Google Blogspot), loaded in real-time, safely sanitized, and cached inside this application.

---

### 1. Centralized Blogger Configuration

The Blogger website URL is managed centrally in:
- **`src/data/blogger-config.ts`**:
  ```ts
  export const DEFAULT_BLOGGER_SITE_URL = "https://probashisebamalaysia.blogspot.com";
  ```
- **Live in the Admin Panel**: Admins can also update and test any Blogspot address live from `/admin` without rebuilding the app.

---

### 2. Supported Feed Formats & Retrieval Strategy

- **Blogger JSON Feed**: `https://[BLOGGER_URL]/feeds/posts/default?alt=json&max-results=30`
- **Retrieval Architecture**:
  1. Direct client-side fetch from Blogger JSON endpoint.
  2. Automatic failover to same-origin proxy `/api/blogger-feed` (compatible with Express and Vercel serverless functions in `api/blogger-feed.ts` and `server.ts`) when CORS restrictions occur.
  3. Safe HTML sanitization using `DOMPurify` to eliminate malicious scripts, event handlers, and embeds while keeping safe formatting and images.
  4. LocalStorage and memory caching with 5-minute TTL.

---

### 3. Blogger Category Labels Mapping

When publishing articles on Blogger, assign one or more of these labels in the **Labels** section:

| Blogger Label (বাংলা) | English Equivalent | App Slug | Emergency Highlight |
|---|---|---|---|
| **জরুরি নোটিশ** | Emergency Notices | `emergency` | Yes (Red Alert Banner) |
| **মালয়েশিয়া সংবাদ** | Malaysia News | `malaysia-news` | No |
| **ভিসা ও ইমিগ্রেশন** | Visa and Immigration | `visa` | No |
| **মেডিকেল আপডেট** | Medical Updates | `medical` | No |
| **চাকরির খবর** | Job News | `jobs` | No |
| **BMET ও BOESL** | BMET and BOESL | `bmet-boesl` | No |
| **দূতাবাসের নোটিশ** | Embassy Notices | `embassy` | No |
| **প্রবাসীদের অধিকার** | Expatriate Rights | `rights` | No |
| **রেমিট্যান্স ও কারেন্সি** | Remittance and Currency | `remittance` | No |
| **সাধারণ তথ্য** | General Information | `general` | No |

*Note: Posts without matching labels will automatically be categorized under **"অন্যান্য" / "Other"**.*

---

### 4. Admin Panel Access & GitHub Updates

- **URL**: Navigate to `/admin`
- **Username**: `mirrabbihossain`
- **Password**: `Rabbi@198027`

#### Features in Admin Panel:
1. **Blogger URL Configurator**: Test feed connection, view post count, check response latency, and save new Blogger URLs.
2. **Cache Management**: Instant cache flush to immediately pull fresh articles.
3. **Blogger Publishing Guide**: Visual 3-step publishing instructions with one-click copyable label tags.
4. **GitHub Push Assistant**: Generates commit messages and terminal commands (`git add .`, `git commit -m "..."`, `git push origin main`) to push application updates to GitHub.

---

### 5. Mobile App Installation (PWA)

Users can install the application directly to their smartphone home screen via:
- The **"অ্যাপ ইনস্টল করুন"** button in the header, footer, and the **About Us** modal.
- Native PWA `beforeinstallprompt` support and pictorial guides for Android (Chrome) and iOS (Safari).

---

### 6. Development & Deployment

```bash
# Run full-stack dev server (port 3000)
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```
