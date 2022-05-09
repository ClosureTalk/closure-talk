SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
python3 -m http.server --bind 127.0.0.1 --directory "$SCRIPT_DIR/../closuretalk.github.io"
