from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import json
import re
from together import Together

load_dotenv()

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

print(f"DEBUG: TMDB_API_KEY Loaded? {'Yes' if TMDB_API_KEY else 'No'}")
print(f"DEBUG: TOGETHER_API_KEY Loaded? {'Yes' if TOGETHER_API_KEY else 'No'}")

# Initialize Together Client
try:
    if TOGETHER_API_KEY:
        client = Together(api_key=TOGETHER_API_KEY)
        print("DEBUG: Together Client Initialized")
    else:
        print("DEBUG: Together Client Skipped (No Key)")
        client = None
except Exception as e:
    print(f"Warning: Together Client not initialized. {e}")
    client = None

@app.route('/')
def home():
    return jsonify({
        "status": "VibeAlchemy Brain is Active 🧠",
        "message": "The UI is in your Chrome Extension. backend is running."
    })

def get_recs_from_llm(vibe):
    """
    Calls the Apriel 1.5 Thinker model via Together AI to get movie recommendations.
    """
    print(f"DEBUG: Getting recommendations for vibe: {vibe}")
    if not vibe:
        vibe = "A random selection of cinematographic masterpieces from different genres and eras."
    
    # Reduced count to 6 for speed
    system_prompt = """You are the VibeAlchemy Engine.
Your goal is to return 6 movie recommendations based on the user's "vibe".

Instructions:
1.  **Analyze the Vibe:** Look for genre, mood, visual style, or specific keywords (e.g., "minecraft" -> blocky, survival, crafting, pixel art).
2.  **Be Creative:** If the input is odd (e.g., "minecraft,cars"), find movies that share *any* DNA (e.g., "Tron" for digital world, "Mad Max" for vehicles/survival).
3.  **ALWAYS Return JSON:** You must return a valid JSON array. Never refuse.
4.  **Format:** [{"title": "Title", "year": "Year", "reason": "Reason"}].
5.  **No Fluff:** Output ONLY the JSON. No intro, no outro."""

    user_prompt = f"Find movies with this vibe: {vibe}"

    # Mock response if no API key is set
    if not TOGETHER_API_KEY or TOGETHER_API_KEY == "your_together_key_here":
        print("DEBUG: Using Mock LLM Response due to missing/default TOGETHER_API_KEY")
        return [
            {"title": "In the Mood for Love", "year": "2000", "reason": "Matches the longing and aesthetic beauty of your vibe."},
            {"title": "Blade Runner 2049", "year": "2017", "reason": "Matches the neon-soaked loneliness and visual splendor."},
            {"title": "Lost in Translation", "year": "2003", "reason": "Explores connection and isolation in a foreign city."},
            {"title": "Her", "year": "2013", "reason": "A futuristic love story with a distinct, soft visual palette."},
            {"title": "Chungking Express", "year": "1994", "reason": "Fast-paced, colorful, and emotionally resonant."},
            {"title": "Moonlight", "year": "2016", "reason": "A tender, visually stunning coming-of-age story."}
        ]

    try:
        print("DEBUG: Sending request to Together AI...")
        response = client.chat.completions.create(
            model="ServiceNow-AI/Apriel-1.5-15b-Thinker",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            stream=False
        )
        
        content = response.choices[0].message.content
        print(f"DEBUG: LLM Raw Output: {content}") 

        # Super Robust JSON Extraction (Stack-based)
        try:
            start_index = content.find('[')
            if start_index == -1:
                print("ERROR: No '[' found in output")
                raise ValueError("No JSON list start found")

            depth = 0
            end_index = -1
            
            for i, char in enumerate(content[start_index:], start_index):
                if char == '[':
                    depth += 1
                elif char == ']':
                    depth -= 1
                    if depth == 0:
                        end_index = i + 1
                        break
            
            if end_index != -1:
                json_str = content[start_index:end_index]
                # specific cleanup for trailing commas if any
                json_str = re.sub(r',\s*]', ']', json_str)
                return json.loads(json_str)
            else:
                raise ValueError("No matching ']' found")

        except Exception as e:
            print(f"ERROR: JSON Parsing failed: {e}")
            # FALLBACK IF PARSING FAILS
            print("DEBUG: Returning Fallback Movies due to parsing error.")
            return [
                {"title": "Everything Everywhere All At Once", "year": "2022", "reason": "A chaotic, genre-bending masterpiece that fits any wild vibe."},
                {"title": "Spider-Man: Into the Spider-Verse", "year": "2018", "reason": "Visually stunning animation that feels like a living comic book."},
                {"title": "Mad Max: Fury Road", "year": "2015", "reason": "High-octane visual storytelling at its absolute peak."},
                {"title": "Pulp Fiction", "year": "1994", "reason": "Cool, non-linear, and effortlessly stylish."},
                {"title": "Spirited Away", "year": "2001", "reason": "A magical journey that fits dreamy and fantastical vibes."},
                {"title": "The Grand Budapest Hotel", "year": "2014", "reason": "Perfect symmetry and quirky humor for a unique aesthetic."}
            ]
            
    except Exception as e:
        print(f"ERROR: LLM General Error: {e}")
        return [
             {"title": "Parasite", "year": "2019", "reason": "A universal masterpiece of tension and class struggle."},
             {"title": "Inception", "year": "2010", "reason": "Mind-bending sci-fi that fits 'complex' or 'dreamy' vibes."},
             {"title": "The Dark Knight", "year": "2008", "reason": "The definitive gritty superhero crime saga."},
             {"title": "Interstellar", "year": "2014", "reason": "Epic exploration of love, time, and space."},
             {"title": "Whiplash", "year": "2014", "reason": "Intense, rhythmic, and obsessed with perfection."},
             {"title": "La La Land", "year": "2016", "reason": "A colorful, musical celebration of dreams and romance."}
        ]

def get_tmdb_poster(title, year=None):
    """
    Fetches the poster URL for a movie from TMDB.
    """
    if not TMDB_API_KEY or TMDB_API_KEY == "your_tmdb_key_here":
        return "https://via.placeholder.com/300x450?text=No+TMDB+Key"

    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={title}"
    if year:
        url += f"&year={year}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data['results']:
            poster_path = data['results'][0].get('poster_path')
            if poster_path:
                return f"https://image.tmdb.org/t/p/w500{poster_path}"
    except Exception as e:
        print(f"TMDB Error: {e}")
    
    return "https://via.placeholder.com/300x450?text=Poster+Not+Found"

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    vibe = data.get('vibe', '')
    
    # 1. Get Recommendations from LLM
    movies = get_recs_from_llm(vibe)
    
    # 2. Enrich with Posters
    enriched_movies = []
    for movie in movies:
        poster = get_tmdb_poster(movie['title'], movie.get('year'))
        movie['poster'] = poster
        enriched_movies.append(movie)
        
    return jsonify({"movies": enriched_movies})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
