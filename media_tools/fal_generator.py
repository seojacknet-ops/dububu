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
