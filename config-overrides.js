module.exports = {
  webpack: (config, env) => {
    // disable source map for html-to-image
    // https://github.com/bubkoo/html-to-image/issues/142#issuecomment-1120583566
    config.module.rules.push(
      {
        test: /\.js$/,
        enforce: "pre",
        use: [
          {
            loader: "source-map-loader",
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                if (/\/html-to-image\/.*\.js$/.test(resourcePath)) {
                  return false;
                }

                return true;
              },
            },
          },
        ],
      }
    );
    return config;
  }
};
