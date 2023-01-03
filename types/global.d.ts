interface AssetManifest {
  'main.js': string;
  'main.css': string;
}

interface Window {
  assetManifest: AssetManifest;
}
