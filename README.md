# Sagara website redesign 2024

To run project:

1. Open terminal and navigate to the directory
2. Run `npm install`
3. Run `npm test` to **build** and **test** website. Server will reload webpages everytime liquid and javascript files changes. CSS and JS file will have sourcemap for easy debugging. When on development, use this command. Open browser and navigate to <http://localhost:3000> to see the website.
4. or, Run `npm run webp` to run image conversion. Run this command everytime generated "sites" folder is removed to recreate all images.
5. or, Run `npm run build` to build website so it's ready to upload. This will also remove sourcemaps from generated CSS and JavaScript files.
6. or, Run `npm run serve` to build website and test it. Use this to test production ready website. Open browser and navigate to <http://localhost:8080> to see the website.

Other command:

1. `npm run clean` to remove generate "sites" folder.
2. `npm run test:11ty` to build and test website using 11ty server, CSS and JavaScript will not be injected automatically, but liquid scructure changes will be injected automatically. Open browser and navigate to <http://localhost:8080> to see the website.
3. `npm run build:clean` to **remove** generate "sites" folder and then **build** website so it's ready to upload.
4. `npm run serve:clean` to **remove** generate "sites" folder and then **build** and **test** website so it's ready to upload. Open browser and navigate to <http://localhost:3000> to see the website.

For older version of content such as copywriting and images, checkout other tags.
