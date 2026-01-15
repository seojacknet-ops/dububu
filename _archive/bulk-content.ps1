# bulk-content.ps1 - Generate multiple content pieces

param(
    [string]$ContentType = "product-description",
    [string]$InputFile = "products.csv",
    [string]$OutputDir = ".\output"
)

# Create output directory
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# Read products from CSV
$products = Import-Csv $InputFile

foreach ($product in $products) {
    $prompt = switch ($ContentType) {
        "product-description" {
            "Write a 150-word product description for: $($product.Name). Price: $($product.Price). Category: $($product.Category)"
        }
        "social-post" {
            "Write an Instagram caption for: $($product.Name). Include emojis, hashtags, and a call to action. Keep under 200 characters."
        }
        "email-feature" {
            "Write an email product feature section for: $($product.Name). Include headline, 50-word description, and CTA button text."
        }
    }
    
    $outputFile = Join-Path $OutputDir "$($product.SKU)-$ContentType.txt"
    gemini $prompt --output $outputFile
    
    Write-Host "Generated: $outputFile" -ForegroundColor Green
    Start-Sleep -Seconds 1
}

Write-Host "Bulk generation complete!" -ForegroundColor Cyan
