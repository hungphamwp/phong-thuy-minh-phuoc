#!/bin/bash
# Script to update footer contact information across all HTML files

# Files to update (excluding admin files and post-detail.html)
files=(
    "gioi-thieu.html"
    "dich-vu.html"
    "lap-la-tu-vi.html"
    "xem-ngay-tot-xau.html"
    "tin-tuc.html"
    "lien-he.html"
)

cd /Users/hungpham/Downloads/phong-thuy-minh-phuoc-main

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Replace Facebook line with two address lines in footer
        sed -i '' '/<li><a href="#"><i class="fab fa-facebook"><\/i> Facebook<\/a><\/li>/c\
                            <li><i class="fas fa-map-marker-alt"></i> 57 Đường 7A phường An Lạc, TP.HCM</li>\
                            <li><i class="fas fa-map-marker-alt"></i> Chùa Quan Âm Cát, xã Phan Rí Cửa, Lâm Đồng</li>
' "$file"
        echo "✓ Updated $file"
    fi
done

echo "Done updating footer addresses!"
