#!/bin/bash

# Find and clean up TypeScript files in the 'dist' directory
find dist -name '*.*' | while read -r file; do
    if [ -f "$file" ]; then
        # Replace four spaces with two spaces
        sed -i 's/    /  /g' "$file"
        echo "Cleaned $file"
    fi
done
