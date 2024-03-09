# Running the app:
```bash
pnpm dev
```

# After making changes to backend:
```bash
docker buildx build --platform linux/amd64 --tag andrewkuang/ecs111:__name_your_tag_here__ --load .
docker push andrewkuang/ecs111:__name_your_tag_here__ 
```
- Then ask Andrew to redeploy it on GCP Cloud Run
- 

# After making changes to frontend:
- Vercel automatically deploys when you push to main. 
- I encourage you to work on a separate branch and merge into main when you're confident. 