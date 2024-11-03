#!/bin/bash

# Directory to search in
SEARCH_DIR="./src"

# List of keywords to search for (add keywords here)
KEYWORDS=("map-marker-radius")

# Check if the search directory exists
if [[ ! -d "$SEARCH_DIR" ]]; then
    echo "Directory $SEARCH_DIR does not exist. Please ensure you have the correct path."
    exit 1
fi

# Function to search for each keyword
search_keywords() {
    local keyword=$1
    echo "Searching for keyword: $keyword"
    echo "-----------------------------"
    
    # Find files with matching keyword and print only the filename
    grep -rl "$keyword" "$SEARCH_DIR" 2>/dev/null | while read -r file; do
        echo "$file"
    done
    echo
}

# Loop through each keyword and search
for keyword in "${KEYWORDS[@]}"; do
    search_keywords "$keyword"
done

echo "Keyword search complete."
