for file in dist/**/*.d.ts; do
    [ -f "$file" ] && sed -i 's/    /  /g' "$file"
done
