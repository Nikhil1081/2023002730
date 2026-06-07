# AffordMed Assessment Frontend

This workspace contains the two-stage solution structure you provided.

## Structure

- `stage1/` - simple Python notification-priority logic
- `stage2/` - React/Next.js frontend with Material UI

## Stage 1

Run:

```bash
cd stage1
python main.py
```

## Stage 2

Run:

```bash
cd stage2
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Optional API configuration

If the notifications API requires a bearer token, set these in a local environment file inside `stage2/`:

```env
NOTIFICATION_API_URL=http://4.224.186.213/evaluation-service/notifications
NOTIFICATION_API_TOKEN=your-token-if-needed
```

Stage 2 now fetches through a local proxy route at `/api/notifications`, so the browser does not call the protected API directly.

## Notes

- The home page shows all notifications with filtering and paging.
- The priority page sorts notifications by type and recency.
- The UI uses Material UI and is kept intentionally simple for a student-style submission.
