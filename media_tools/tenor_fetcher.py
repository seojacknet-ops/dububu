"""
Tenor GIF Fetcher for DuBuBu.com
Fetches Bubu Dudu GIFs from Tenor API
"""

import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local')

TENOR_API_KEY = os.getenv('TENOR_API_KEY')
BASE_URL = "https://tenor.googleapis.com/v2"

class TenorFetcher:
    def __init__(self):
        self.api_key = TENOR_API_KEY
        if not self.api_key:
            print("Warning: TENOR_API_KEY not set. Using direct URLs instead.")
    
    def search_gifs(self, query: str, limit: int = 20) -> list:
        """Search for GIFs on Tenor"""
        if not self.api_key:
            return []
        
        params = {
            "key": self.api_key,
            "q": query,
            "limit": limit,
            "media_filter": "gif,tinygif,webp"
        }
        
        response = requests.get(f"{BASE_URL}/search", params=params)
        
        if response.status_code == 200:
            data = response.json()
            return self._extract_urls(data.get("results", []))
        else:
            print(f"Error: {response.status_code}")
            return []
    
    def _extract_urls(self, results: list) -> list:
        """Extract GIF URLs from API results"""
        gifs = []
        for result in results:
            media_formats = result.get("media_formats", {})
            gif_data = {
                "id": result.get("id"),
                "title": result.get("title", ""),
                "gif": media_formats.get("gif", {}).get("url"),
                "webp": media_formats.get("webp", {}).get("url"),
                "tiny_gif": media_formats.get("tinygif", {}).get("url"),
                "preview": media_formats.get("tinygif_transparent", {}).get("url"),
            }
            gifs.append(gif_data)
        return gifs
    
    def get_bubu_dudu_gifs(self, category: str = None, limit: int = 20) -> list:
        """Get Bubu Dudu GIFs by category"""
        query = "bubu dudu"
        if category:
            query = f"bubu dudu {category}"
        return self.search_gifs(query, limit)
    
    def download_gif(self, url: str, save_path: str) -> bool:
        """Download a GIF to local storage"""
        try:
            response = requests.get(url, stream=True)
            if response.status_code == 200:
                Path(save_path).parent.mkdir(parents=True, exist_ok=True)
                with open(save_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return True
        except Exception as e:
            print(f"Download error: {e}")
        return False
    
    def save_gif_catalog(self, output_file: str = "gif_catalog.json"):
        """Save a catalog of all Bubu Dudu GIFs"""
        categories = ["love", "kiss", "hug", "sleep", "cute", "dance", "fighting"]
        catalog = {}
        
        for category in categories:
            print(f"Fetching {category} GIFs...")
            catalog[category] = self.get_bubu_dudu_gifs(category, limit=10)
        
        with open(output_file, 'w') as f:
            json.dump(catalog, f, indent=2)
        
        print(f"Catalog saved to {output_file}")
        return catalog


# Hardcoded GIF URLs (no API key required)
PRESET_GIFS = {
    "love": [
        "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
        "https://media.tenor.com/vJRHkcdlEQQAAAAm/casal-dudu.webp",
        "https://media.tenor.com/JcPATwwdUOQAAAAm/bubu-dudu-sseeyall.webp",
        "https://media.tenor.com/90xN7I6NjecAAAAm/bubu-dudu-sseeyall.webp",
    ],
    "hug": [
        "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
        "https://media.tenor.com/skrULsl5twcAAAAm/bubududukiwi-twitter.webp",
        "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp",
    ],
    "sleep": [
        "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp",
        "https://media.tenor.com/oPHqTKxUDo4AAAAm/bubu-dudu-sleep-funny-bubu-dudu-love.webp",
        "https://media.tenor.com/qQNt-BqDtE8AAAAm/bubu-fun-sleep-bubu-dudu-love.webp",
    ],
    "cute": [
        "https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp",
        "https://media.tenor.com/cwNYjFIdTZ4AAAAm/bubu-cute-bubu-dudu.webp",
        "https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp",
    ],
    "fun": [
        "https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp",
        "https://media.tenor.com/27dQ8ddrv3AAAAAm/wee.webp",
        "https://media.tenor.com/arLtVbLvu10AAAAm/bubu-dudu-sseeyall.webp",
    ]
}

def get_preset_gif(category: str, index: int = 0) -> str:
    """Get a preset GIF URL without API"""
    gifs = PRESET_GIFS.get(category, PRESET_GIFS["cute"])
    return gifs[index % len(gifs)]


if __name__ == "__main__":
    # Example usage
    fetcher = TenorFetcher()
    
    # If API key available, fetch from API
    if TENOR_API_KEY:
        gifs = fetcher.get_bubu_dudu_gifs("love", limit=5)
        for gif in gifs:
            print(f"Title: {gif['title']}")
            print(f"URL: {gif['gif']}")
            print("---")
    else:
        # Use preset GIFs
        print("Using preset GIFs (no API key):")
        for category, urls in PRESET_GIFS.items():
            print(f"\n{category.upper()}:")
            for url in urls:
                print(f"  {url}")
