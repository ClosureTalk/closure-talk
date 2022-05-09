rm -r ../closuretalk.github.io/static
npm run build && cp -r build/* ../closuretalk.github.io/ && rm -r build
