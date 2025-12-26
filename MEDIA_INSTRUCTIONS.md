# Media Assets Guide
## DuBuBu.com - GIFs, Images & AI-Generated Content

---

## 1. Overview

This guide covers sourcing and generating media assets for DuBuBu.com:

1. **Tenor GIFs** - Bubu Dudu animated content (free, API available)
2. **fal.ai** - AI image generation for custom product mockups, banners, social content

---

## 2. Tenor GIF Integration

### 2.1 Source URL
**Main Search:** https://tenor.com/search/bubu-dudu-gifs

### 2.2 Available GIF Categories

| Category | Search URL | Use Case |
|----------|------------|----------|
| Love | `/search/bubu-dudu-love-gifs` | Romance products, Valentine's |
| Kiss | `/search/bubu-dudu-kiss-gifs` | Couple items, romantic |
| Hug | `/search/bubu-dudu-hug-gifs` | Comfort products, plushies |
| Sleep | `/search/bubu-dudu-sleep-gifs` | Pajamas, blankets, pillows |
| Good Night | `/search/bubu-dudu-good-night-gifs` | Night lamps, bedding |
| Dance | `/search/bubu-dudu-dance-gifs` | Celebrations, sales |
| Fighting | `/search/bubu-dudu-fighting-gifs` | Playful, humorous content |
| Cute | `/search/bubu-dudu-cute-gifs` | General use |

### 2.3 Direct GIF URLs (Ready to Use)

```
# Romantic / Love
https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif
https://media.tenor.com/vJRHkcdlEQQAAAAm/casal-dudu.webp
https://media.tenor.com/ySITUM2KYHYAAAAm/dudu-bubu.webp
https://media.tenor.com/JcPATwwdUOQAAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/90xN7I6NjecAAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/wIx44jsp4DMAAAAm/kiss.webp
https://media.tenor.com/I_rw0vcOXJYAAAAm/dudu-bubu-cute-kiss.webp

# Hugging / Cuddling
https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif
https://media.tenor.com/skrULsl5twcAAAAm/bubududukiwi-twitter.webp
https://media.tenor.com/qQmsOJoeMoMAAAAm/dudu-bubu.webp
https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp
https://media.tenor.com/OrxXcqX25KcAAAAm/dudu-bubu-love-gif.webp
https://media.tenor.com/PXKZhCEfEfsAAAAm/bubu-bubu-dudu.webp

# Sleeping / Cozy
https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp
https://media.tenor.com/oPHqTKxUDo4AAAAm/bubu-dudu-sleep-funny-bubu-dudu-love.webp
https://media.tenor.com/5hmbYHBTdtQAAAAm/dudu-bubu-camping-dudu.webp
https://media.tenor.com/qQNt-BqDtE8AAAAm/bubu-fun-sleep-bubu-dudu-love.webp
https://media.tenor.com/8NdKLwX37kAAAAAm/dudu-sleep-dudu-bubu.webp
https://media.tenor.com/K-ncuqnX30EAAAAm/bubu.webp

# Cute / General
https://media.tenor.com/KNiXTCA36YYAAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/dHSIL5HUotgAAAAm/hold-dudu-shake-hand.webp
https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/cwNYjFIdTZ4AAAAm/bubu-cute-bubu-dudu.webp
https://media.tenor.com/cVzKULzKpVgAAAAm/bubu-dudu-images-bubu-dudu-love.webp
https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp

# Playful / Fun
https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp
https://media.tenor.com/arLtVbLvu10AAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/oW_yTsmU7C0AAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/27dQ8ddrv3AAAAAm/wee.webp
https://media.tenor.com/l7Vy_FXqo4kAAAAm/dudu-boll-dudu-bubu.webp

# Food / Eating
https://media.tenor.com/xB-m15Hb-UkAAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/FpRtffe30hMAAAAm/pizza.webp

# Expressions
https://media.tenor.com/FCH04yiJT7IAAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/DXs3gd7Ce0kAAAAm/bubu-dudu-sseeyall.webp
https://media.tenor.com/U7yqdWZSvEYAAAAm/dudu-butt.webp
https://media.tenor.com/wA5xWw0tNBwAAAAm/hêh.webp
```

### 2.4 Tenor API Integration (Optional)

**Get API Key:** https://tenor.com/developer/keyregistration

**Environment Setup:**
```env
# .env.local
TENOR_API_KEY=your-tenor-api-key
```

**Python Script - `tenor_fetcher.py`:**
```python
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
```

### 2.5 Website Integration Examples

**HTML - Hero Section with GIF:**
```html
<section class="hero">
    <div class="hero-gif">
        <img 
            src="https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif" 
            alt="Bubu and Dudu cuddling"
            loading="lazy"
        />
    </div>
    <h1>Where Every Day is a Love Story 💕</h1>
    <a href="/shop" class="cta-button">Shop the Collection</a>
</section>
```

**React Component:**
```jsx
import { useState } from 'react';

const CATEGORY_GIFS = {
    love: "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
    hug: "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
    sleep: "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp",
    cute: "https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp",
};

export function CategoryCard({ category, title, link }) {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <a 
            href={link}
            className="category-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="category-image">
                {isHovered ? (
                    <img src={CATEGORY_GIFS[category]} alt={title} />
                ) : (
                    <img src={`/images/categories/${category}.jpg`} alt={title} />
                )}
            </div>
            <h3>{title}</h3>
        </a>
    );
}
```

**Shopify Liquid:**
```liquid
{% comment %} Add GIF to product page {% endcomment %}
<div class="product-gif-accent">
    {% case product.type %}
        {% when 'Plushies' %}
            <img src="https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif" alt="Cute hug">
        {% when 'Pajamas' %}
            <img src="https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp" alt="Sleepy time">
        {% when 'Couple Sets' %}
            <img src="https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif" alt="Love">
        {% else %}
            <img src="https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp" alt="Cute">
    {% endcase %}
</div>
```

---

## 3. fal.ai Image Generation

### 3.1 Overview

**fal.ai** provides fast, affordable AI image generation APIs. Perfect for:
- Product mockups
- Social media graphics
- Banner images
- Marketing materials
- Custom illustrations

**Website:** https://fal.ai
**Docs:** https://fal.ai/docs

### 3.2 Setup

**Install Dependencies:**
```powershell
# Create virtual environment (recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install packages
pip install fal-client python-dotenv requests Pillow
```

**Environment Configuration:**
```env
# .env.local
FAL_KEY=your-fal-api-key-here
```

### 3.3 Main Python Script - `fal_generator.py`

```python
"""
fal.ai Image Generator for DuBuBu.com
Generates custom images for products, marketing, and social media
"""

import os
import fal_client
import requests
import json
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from typing import Optional, List, Dict

# Load environment variables
load_dotenv('.env.local')

# Configure fal.ai
FAL_KEY = os.getenv('FAL_KEY')
if FAL_KEY:
    os.environ['FAL_KEY'] = FAL_KEY


class DuBuBuImageGenerator:
    """Image generator for DuBuBu.com using fal.ai"""
    
    # Preset style modifiers for consistent branding
    STYLE_PRESETS = {
        "kawaii": "kawaii style, cute, pastel colors, soft lighting, adorable, chibi",
        "product": "product photography, white background, professional, clean, e-commerce",
        "social": "vibrant, eye-catching, social media style, modern, trendy",
        "banner": "wide format, promotional, bold text space, gradient background",
        "romantic": "soft pink tones, hearts, romantic atmosphere, dreamy, love theme",
        "cozy": "warm lighting, comfortable, homey, soft textures, inviting",
    }
    
    # Character descriptions for consistency
    CHARACTERS = {
        "bubu": "cute brown teddy bear character, round face, small ears, friendly expression",
        "dudu": "adorable white panda character, black and white, gentle expression, cute",
        "both": "cute bear and panda couple, brown teddy bear and white panda together, adorable duo",
    }
    
    def __init__(self):
        if not FAL_KEY:
            raise ValueError("FAL_KEY not found in environment variables. Add it to .env.local")
        
        self.output_dir = Path("generated_images")
        self.output_dir.mkdir(exist_ok=True)
    
    def generate_image(
        self,
        prompt: str,
        style: str = "kawaii",
        character: str = "both",
        model: str = "fal-ai/flux/schnell",
        size: str = "square_hd",
        num_images: int = 1,
        save: bool = True
    ) -> List[Dict]:
        """
        Generate images using fal.ai
        
        Args:
            prompt: Base description of what to generate
            style: Style preset (kawaii, product, social, banner, romantic, cozy)
            character: Which character (bubu, dudu, both)
            model: fal.ai model to use
            size: Image size (square_hd, portrait_4_3, landscape_4_3, landscape_16_9)
            num_images: Number of images to generate
            save: Whether to save images locally
        
        Returns:
            List of generated image data
        """
        
        # Build enhanced prompt
        full_prompt = self._build_prompt(prompt, style, character)
        
        print(f"Generating image with prompt:\n{full_prompt}\n")
        
        try:
            result = fal_client.subscribe(
                model,
                arguments={
                    "prompt": full_prompt,
                    "image_size": size,
                    "num_images": num_images,
                    "enable_safety_checker": True,
                },
                with_logs=True
            )
            
            images = []
            for i, img in enumerate(result.get("images", [])):
                img_data = {
                    "url": img.get("url"),
                    "width": img.get("width"),
                    "height": img.get("height"),
                    "prompt": full_prompt,
                    "timestamp": datetime.now().isoformat()
                }
                
                if save and img_data["url"]:
                    local_path = self._save_image(img_data["url"], prompt, i)
                    img_data["local_path"] = str(local_path)
                
                images.append(img_data)
            
            return images
            
        except Exception as e:
            print(f"Error generating image: {e}")
            return []
    
    def _build_prompt(self, base_prompt: str, style: str, character: str) -> str:
        """Build a full prompt with style and character modifiers"""
        
        style_mod = self.STYLE_PRESETS.get(style, self.STYLE_PRESETS["kawaii"])
        char_mod = self.CHARACTERS.get(character, self.CHARACTERS["both"])
        
        return f"{base_prompt}, featuring {char_mod}, {style_mod}, high quality, detailed"
    
    def _save_image(self, url: str, prompt: str, index: int) -> Path:
        """Download and save image locally"""
        
        # Create filename from prompt
        safe_name = "".join(c if c.isalnum() else "_" for c in prompt[:50])
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_name}_{timestamp}_{index}.png"
        filepath = self.output_dir / filename
        
        response = requests.get(url)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"Saved: {filepath}")
        
        return filepath
    
    # ==========================================
    # PRESET GENERATORS FOR DUBUBU.COM
    # ==========================================
    
    def generate_product_mockup(
        self,
        product_type: str,
        description: str = "",
        background: str = "white"
    ) -> List[Dict]:
        """Generate product mockup images"""
        
        prompts = {
            "plush": f"plush toy {description}, soft stuffed animal, product photo on {background} background",
            "tshirt": f"t-shirt {description}, flat lay, clothing product photo on {background} background",
            "hoodie": f"hoodie sweatshirt {description}, apparel product photo on {background} background",
            "mug": f"ceramic coffee mug {description}, drinkware product photo on {background} background",
            "blanket": f"soft fleece blanket {description}, cozy home product on {background} background",
            "pillow": f"throw pillow {description}, home decor product on {background} background",
            "keychain": f"metal keychain {description}, accessory product photo on {background} background",
            "phone_case": f"smartphone case {description}, tech accessory on {background} background",
        }
        
        base_prompt = prompts.get(product_type, f"{product_type} {description}")
        
        return self.generate_image(
            prompt=base_prompt,
            style="product",
            character="both",
            size="square_hd"
        )
    
    def generate_social_post(
        self,
        theme: str,
        platform: str = "instagram",
        text_overlay: str = ""
    ) -> List[Dict]:
        """Generate social media post images"""
        
        sizes = {
            "instagram": "square_hd",
            "instagram_story": "portrait_4_3",
            "facebook": "landscape_4_3",
            "pinterest": "portrait_4_3",
            "twitter": "landscape_16_9",
        }
        
        themes = {
            "valentines": "Valentine's Day theme, hearts, pink and red colors, romantic",
            "christmas": "Christmas theme, festive, snow, holiday decorations, cozy",
            "sale": "sale promotion, exciting, bold colors, shopping theme",
            "new_arrival": "new product showcase, fresh, exciting, spotlight",
            "couple_goals": "cute couple moment, romantic, relationship goals, love",
            "cozy_vibes": "cozy atmosphere, warm, comfortable, hygge aesthetic",
        }
        
        theme_prompt = themes.get(theme, theme)
        prompt = f"social media graphic, {theme_prompt}"
        
        if text_overlay:
            prompt += f", space for text overlay saying '{text_overlay}'"
        
        return self.generate_image(
            prompt=prompt,
            style="social",
            character="both",
            size=sizes.get(platform, "square_hd")
        )
    
    def generate_banner(
        self,
        banner_type: str,
        headline: str = "",
        size: str = "landscape_16_9"
    ) -> List[Dict]:
        """Generate website banners"""
        
        types = {
            "hero": "website hero banner, large promotional image, welcoming",
            "collection": "collection banner, category header, themed",
            "sale": "sale banner, promotional, urgent, exciting deals",
            "seasonal": "seasonal banner, holiday themed, festive",
        }
        
        prompt = types.get(banner_type, banner_type)
        if headline:
            prompt += f", with space for headline text: {headline}"
        
        return self.generate_image(
            prompt=prompt,
            style="banner",
            character="both",
            size=size
        )
    
    def generate_email_header(self, campaign_type: str) -> List[Dict]:
        """Generate email marketing headers"""
        
        campaigns = {
            "welcome": "welcoming, friendly, warm introduction, hello theme",
            "abandoned_cart": "missing you, come back, reminder, friendly nudge",
            "promotion": "special offer, exciting deal, limited time",
            "newsletter": "monthly update, news, friendly communication",
            "thank_you": "gratitude, appreciation, happy, thank you theme",
        }
        
        prompt = f"email header graphic, {campaigns.get(campaign_type, campaign_type)}"
        
        return self.generate_image(
            prompt=prompt,
            style="romantic",
            character="both",
            size="landscape_16_9"
        )
    
    def generate_pattern(self, style: str = "seamless") -> List[Dict]:
        """Generate patterns for product designs"""
        
        prompt = f"{style} pattern, repeating design, tileable, print-ready"
        
        return self.generate_image(
            prompt=prompt,
            style="kawaii",
            character="both",
            size="square_hd"
        )
    
    def batch_generate(self, tasks: List[Dict]) -> List[Dict]:
        """
        Batch generate multiple images
        
        Args:
            tasks: List of task dictionaries with keys:
                   - type: 'product', 'social', 'banner', 'email', 'pattern'
                   - params: dict of parameters for that type
        
        Returns:
            List of all generated images
        """
        
        all_results = []
        
        for i, task in enumerate(tasks):
            print(f"\n[{i+1}/{len(tasks)}] Processing task: {task.get('type')}")
            
            task_type = task.get('type')
            params = task.get('params', {})
            
            if task_type == 'product':
                results = self.generate_product_mockup(**params)
            elif task_type == 'social':
                results = self.generate_social_post(**params)
            elif task_type == 'banner':
                results = self.generate_banner(**params)
            elif task_type == 'email':
                results = self.generate_email_header(**params)
            elif task_type == 'pattern':
                results = self.generate_pattern(**params)
            else:
                results = self.generate_image(prompt=params.get('prompt', ''), **params)
            
            all_results.extend(results)
        
        return all_results


# ==========================================
# CLI INTERFACE
# ==========================================

def main():
    """Command-line interface for image generation"""
    import argparse
    
    parser = argparse.ArgumentParser(description="DuBuBu.com Image Generator")
    parser.add_argument('--type', '-t', choices=['product', 'social', 'banner', 'email', 'pattern', 'custom'],
                        default='custom', help='Type of image to generate')
    parser.add_argument('--prompt', '-p', type=str, help='Custom prompt for generation')
    parser.add_argument('--style', '-s', choices=['kawaii', 'product', 'social', 'banner', 'romantic', 'cozy'],
                        default='kawaii', help='Style preset')
    parser.add_argument('--character', '-c', choices=['bubu', 'dudu', 'both'],
                        default='both', help='Character to feature')
    parser.add_argument('--size', choices=['square_hd', 'portrait_4_3', 'landscape_4_3', 'landscape_16_9'],
                        default='square_hd', help='Image size')
    parser.add_argument('--count', '-n', type=int, default=1, help='Number of images')
    parser.add_argument('--product-type', type=str, help='Product type for mockup')
    parser.add_argument('--theme', type=str, help='Theme for social/banner')
    parser.add_argument('--platform', type=str, default='instagram', help='Social platform')
    
    args = parser.parse_args()
    
    generator = DuBuBuImageGenerator()
    
    if args.type == 'product' and args.product_type:
        results = generator.generate_product_mockup(args.product_type, args.prompt or '')
    elif args.type == 'social' and args.theme:
        results = generator.generate_social_post(args.theme, args.platform)
    elif args.type == 'banner' and args.theme:
        results = generator.generate_banner(args.theme, args.prompt or '')
    elif args.type == 'email' and args.theme:
        results = generator.generate_email_header(args.theme)
    elif args.type == 'pattern':
        results = generator.generate_pattern(args.style)
    else:
        if not args.prompt:
            args.prompt = "cute scene with characters"
        results = generator.generate_image(
            prompt=args.prompt,
            style=args.style,
            character=args.character,
            size=args.size,
            num_images=args.count
        )
    
    print("\n" + "="*50)
    print("GENERATION COMPLETE")
    print("="*50)
    for result in results:
        print(f"URL: {result.get('url')}")
        print(f"Local: {result.get('local_path', 'Not saved')}")
        print()


if __name__ == "__main__":
    main()
```

### 3.4 Usage Examples

**Command Line:**
```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Generate custom image
python fal_generator.py --prompt "holding hands walking in the park" --style romantic

# Generate product mockup
python fal_generator.py --type product --product-type plush --prompt "couple plush set"

# Generate social media post
python fal_generator.py --type social --theme valentines --platform instagram

# Generate website banner
python fal_generator.py --type banner --theme hero --prompt "Welcome to DuBuBu"

# Generate email header
python fal_generator.py --type email --theme welcome

# Generate multiple images
python fal_generator.py --prompt "cute date at cafe" --count 4
```

**Python Script Usage:**
```python
from fal_generator import DuBuBuImageGenerator

gen = DuBuBuImageGenerator()

# Single product mockup
images = gen.generate_product_mockup("plush", "couple holding hands")

# Social media post
images = gen.generate_social_post("valentines", platform="instagram")

# Website banner
images = gen.generate_banner("hero", headline="Shop the Cutest Couple Merch")

# Batch generation
tasks = [
    {"type": "product", "params": {"product_type": "tshirt", "description": "matching couple"}},
    {"type": "product", "params": {"product_type": "mug", "description": "his and hers"}},
    {"type": "social", "params": {"theme": "sale", "platform": "instagram"}},
    {"type": "banner", "params": {"banner_type": "collection", "headline": "New Arrivals"}},
]
all_images = gen.batch_generate(tasks)
```

### 3.5 Batch Generation Script - `batch_media.py`

```python
"""
Batch Media Generator for DuBuBu.com
Generate all needed images in one run
"""

from fal_generator import DuBuBuImageGenerator
import json
from datetime import datetime

def generate_launch_media():
    """Generate all media needed for store launch"""
    
    gen = DuBuBuImageGenerator()
    results = {"generated_at": datetime.now().isoformat(), "images": []}
    
    # ========================================
    # WEBSITE BANNERS
    # ========================================
    print("\n📸 Generating Website Banners...")
    
    banners = [
        {"banner_type": "hero", "headline": "Where Every Day is a Love Story"},
        {"banner_type": "collection", "headline": "Matching Couple Sets"},
        {"banner_type": "collection", "headline": "Cozy Home Collection"},
        {"banner_type": "sale", "headline": "Valentine's Day Sale"},
    ]
    
    for banner in banners:
        imgs = gen.generate_banner(**banner)
        for img in imgs:
            img["category"] = "banner"
            img["subcategory"] = banner["banner_type"]
            results["images"].append(img)
    
    # ========================================
    # PRODUCT MOCKUPS
    # ========================================
    print("\n📸 Generating Product Mockups...")
    
    products = [
        {"product_type": "plush", "description": "couple set bear and panda"},
        {"product_type": "tshirt", "description": "matching his and hers"},
        {"product_type": "hoodie", "description": "oversized cozy"},
        {"product_type": "mug", "description": "couple mug set"},
        {"product_type": "blanket", "description": "soft throw"},
        {"product_type": "pillow", "description": "decorative cushion"},
        {"product_type": "keychain", "description": "matching set"},
        {"product_type": "phone_case", "description": "cute design"},
    ]
    
    for product in products:
        imgs = gen.generate_product_mockup(**product)
        for img in imgs:
            img["category"] = "product"
            img["subcategory"] = product["product_type"]
            results["images"].append(img)
    
    # ========================================
    # SOCIAL MEDIA CONTENT
    # ========================================
    print("\n📸 Generating Social Media Content...")
    
    social_posts = [
        {"theme": "couple_goals", "platform": "instagram"},
        {"theme": "cozy_vibes", "platform": "instagram"},
        {"theme": "valentines", "platform": "instagram"},
        {"theme": "new_arrival", "platform": "instagram"},
        {"theme": "couple_goals", "platform": "pinterest"},
        {"theme": "cozy_vibes", "platform": "facebook"},
    ]
    
    for post in social_posts:
        imgs = gen.generate_social_post(**post)
        for img in imgs:
            img["category"] = "social"
            img["subcategory"] = post["platform"]
            img["theme"] = post["theme"]
            results["images"].append(img)
    
    # ========================================
    # EMAIL HEADERS
    # ========================================
    print("\n📸 Generating Email Headers...")
    
    email_types = ["welcome", "abandoned_cart", "promotion", "newsletter", "thank_you"]
    
    for email_type in email_types:
        imgs = gen.generate_email_header(email_type)
        for img in imgs:
            img["category"] = "email"
            img["subcategory"] = email_type
            results["images"].append(img)
    
    # ========================================
    # SAVE RESULTS
    # ========================================
    output_file = f"media_catalog_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Generation complete!")
    print(f"📁 Total images: {len(results['images'])}")
    print(f"📄 Catalog saved: {output_file}")
    
    return results


if __name__ == "__main__":
    generate_launch_media()
```

**Run batch generation:**
```powershell
python batch_media.py
```

---

## 4. File Organization

### 4.1 Recommended Directory Structure
```
dububu-project/
├── media/
│   ├── gifs/
│   │   ├── love/
│   │   ├── hug/
│   │   ├── sleep/
│   │   └── cute/
│   ├── generated/
│   │   ├── banners/
│   │   ├── products/
│   │   ├── social/
│   │   └── email/
│   └── catalog.json
├── scripts/
│   ├── tenor_fetcher.py
│   ├── fal_generator.py
│   └── batch_media.py
├── .env.local
└── requirements.txt
```

### 4.2 requirements.txt
```
fal-client>=0.4.0
python-dotenv>=1.0.0
requests>=2.31.0
Pillow>=10.0.0
```

---

## 5. Best Practices

### 5.1 Image Optimization
```python
from PIL import Image
import os

def optimize_image(input_path: str, output_path: str, max_size: int = 1200):
    """Optimize image for web use"""
    
    img = Image.open(input_path)
    
    # Resize if too large
    if max(img.size) > max_size:
        img.thumbnail((max_size, max_size), Image.LANCZOS)
    
    # Convert to RGB if necessary
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Save optimized
    img.save(output_path, 'JPEG', quality=85, optimize=True)
    
    original_size = os.path.getsize(input_path)
    new_size = os.path.getsize(output_path)
    print(f"Optimized: {original_size/1024:.1f}KB → {new_size/1024:.1f}KB")
```

### 5.2 Rate Limiting
```python
import time
from functools import wraps

def rate_limit(calls_per_minute: int = 10):
    """Decorator to rate limit API calls"""
    min_interval = 60.0 / calls_per_minute
    last_call = [0.0]
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_call[0]
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)
            last_call[0] = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Usage
@rate_limit(calls_per_minute=10)
def generate_with_limit(*args, **kwargs):
    return generator.generate_image(*args, **kwargs)
```

### 5.3 Error Handling
```python
import time
from typing import Optional

def generate_with_retry(
    generator,
    prompt: str,
    max_retries: int = 3,
    delay: int = 5
) -> Optional[list]:
    """Generate image with retry logic"""
    
    for attempt in range(max_retries):
        try:
            return generator.generate_image(prompt=prompt)
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
    
    print("All retries failed")
    return None
```

---

## 6. Quick Reference

### Tenor GIF Categories
| Category | URL Suffix | Best For |
|----------|------------|----------|
| Love | `/bubu-dudu-love-gifs` | Romance, couples |
| Kiss | `/bubu-dudu-kiss-gifs` | Valentine's |
| Hug | `/bubu-dudu-hug-gifs` | Comfort, plushies |
| Sleep | `/bubu-dudu-sleep-gifs` | Bedding, pajamas |
| Good Night | `/bubu-dudu-good-night-gifs` | Night lamps |
| Dance | `/bubu-dudu-dance-gifs` | Celebrations |
| Cute | `/bubu-dudu-cute-gifs` | General use |

### fal.ai Commands
```powershell
# Product mockup
python fal_generator.py -t product --product-type plush

# Social post
python fal_generator.py -t social --theme valentines

# Banner
python fal_generator.py -t banner --theme hero

# Custom
python fal_generator.py -p "your prompt" -s kawaii -c both
```

### Environment Variables
```env
# .env.local
FAL_KEY=your-fal-api-key
TENOR_API_KEY=your-tenor-api-key (optional)
```

---

## Document Info
**Version:** 1.0  
**Created:** December 2025  
**Platform:** Windows (Python 3.10+)  
**Project:** DuBuBu.com Media Assets  

---

*Use this guide to source and generate all visual assets for DuBuBu.com. Combine Tenor GIFs for animations and fal.ai for custom static images.* 🎨✨
