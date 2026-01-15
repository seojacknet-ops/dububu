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
