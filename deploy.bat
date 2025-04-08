@echo off
echo Building calculator...
set NODE_OPTIONS=--openssl-legacy-provider
call npm run build

echo Deploying to Netlify...
call netlify deploy --prod --dir=build

echo Deployment complete!
pause