for file in `find dist -name '*.d.ts'`; do
    [ -f "$file" ] && sed -i 's/    /  /g' "$file"
done
