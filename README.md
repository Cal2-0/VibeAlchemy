# VibeAlchemy 🎬✨

**Your Cinematic Sidekick.** Discover movies based on "vibes", moods, and even the webpage you're currently browsing.

![VibeAlchemy](https://via.placeholder.com/800x400?text=VibeAlchemy+Banner)

## 🌟 Key Features

### 🧠 AI-Powered Vibe Search
Type anything: *"cyberpunk noir detective"*, *"uplifting 80s sports movie"*, or abstract concepts like *"minecraft,cars"* to get curated recommendations.

### 🎲 Surprise Me & Infinite Scroll
-   **Instant Vibes:** Open the extension to see 6 random masterpieces instantly.
-   **Load More:** Scroll down and click **"✨ Load More Vibes"** to keep the list growing.

### 📺 Context Awareness (New in V4!)
Watching a movie on **Netflix**, **Prime Video**, or checking **IMDb**?
-   Click the **"📺 Match Tab"** button in the header.
-   VibeAlchemy reads the page title and instantly finds similar movies!

### 👆 Click & Watch
Found a gem? **Click any movie card** to instantly search for it on Google/JustWatch.

---

## 🚀 Installation Guide

### Prerequisites
-   **Node.js & npm**
-   **Python 3.8+ & pip**
-   **API Keys:**
    -   [TMDB API Key](https://www.themoviedb.org/settings/api) (for posters)
    -   [Together AI Key](https://api.together.xyz/) (for the brain)

### 1. Backend Setup (The "Brain") 🧠

1.  Navigate to the server directory:
    ```bash
    cd VibeAlchemy/server
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure API Keys in `.env`:
    ```env
    TMDB_API_KEY=your_tmdb_key_here
    TOGETHER_API_KEY=your_together_key_here
    ```
4.  Start the server:
    ```bash
    python app.py
    ```
    ✅ Runs on `http://localhost:5000`

### 2. Frontend Setup (The Extension) 🖥️

1.  Navigate to the extension directory:
    ```bash
    cd VibeAlchemy/extension
    ```
2.  Install & Build:
    ```bash
    npm install
    npm run build
    ```
    ✅ Creates a `dist/` folder.

### 3. Load into Chrome 🌐

1.  Open Chrome and go to `chrome://extensions`.
2.  Toggle **Developer mode** (top right).
3.  Click **Load unpacked**.
4.  Select the `VibeAlchemy/extension/dist` folder.
5.  **Pin** the VibeAlchemy icon for easy access!

---

## 🛠️ Troubleshooting

-   **"No movies found"**: 
    -   Try a different vibe.
    -   Check if the backend terminal shows any errors.
-   **"Could not connect to Brain"**:
    -   Ensure `python app.py` is running.
-   **"Context search only works..."**:
    -   The "📺 Match Tab" button only works when installed as a Chrome Extension (not in local dev mode).

## 🛡️ Privacy & Security

-   **Local Processing:** Your API keys never leave your machine (stored in backend `.env`).
-   **Minimal Permissions:** We only access `activeTab` when you explicitly click "Match Tab".

---

*Powered by Apriel 1.6 Thinker & TMDB.*
