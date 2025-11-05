@echo off
echo ================================================
echo BallonMail Production Deployment
echo ================================================
echo.

echo Step 1: Deploying Cloudflare Worker...
cd cloudflare
call wrangler deploy --config wrangler-ballonmail.toml

echo.
echo ================================================
echo Deployment Complete!
echo ================================================
echo.
echo Next Steps:
echo 1. Set environment variables:
echo    wrangler secret put RESEND_API_KEY --name ballonmail-api
echo    wrangler secret put FROM_EMAIL --name ballonmail-api
echo.
echo 2. Your API is now live at:
echo    https://tempmailgb.com/api/send-bulk
echo.
echo 3. Test your BallonMail at:
echo    https://tempmailgb.com/ballonmail
echo.
echo Read BALLONMAIL-PRODUCTION.md for complete setup guide
echo ================================================

pause
