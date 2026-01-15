# generate-descriptions.ps1
$products = @(
    "Bubu Dudu Couple Plush Set",
    "Matching Couple Hoodies - His Bubu Her Dudu",
    "Bubu Dudu Night Light Lamp",
    "Couple Keychain Set - Bear and Panda"
)

foreach ($product in $products) {
    $prompt = @"
Write a compelling e-commerce product description for: $product

Requirements:
- 150-200 words
- Highlight emotional appeal for couples
- Include 3-5 bullet points for features
- Add a call-to-action
- Tone: Cute, warm, romantic
- Target audience: Young couples, gift buyers
"@
    
    Write-Host "Generating description for: $product" -ForegroundColor Cyan
    gemini $prompt --output "descriptions\$($product -replace ' ', '-').txt"
    Start-Sleep -Seconds 2  # Rate limiting
}
