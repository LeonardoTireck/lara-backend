# API Endpoint Roadmap

This document outlines the API endpoints for the application, based on the
development roadmap.

## Currently Implemented (Internal Routes)

These routes are currently implemented for initial development but do not follow
the final API design.

| Status        | Method | Endpoint   | Description        |
| :------------ | :----- | :--------- | :----------------- |
| `Implemented` | `POST` | `/newUser` | Create a new user. |

---

## Future Authenticated Endpoints

### Admin Routes (Phase 2)

| Status    | Method   | Endpoint                                            | Description                        | Relevant Use Case                  |
| :-------- | :------- | :-------------------------------------------------- | :--------------------------------- | :--------------------------------- |
| `Planned` | `GET`    | `/api/v1/admin/clients/:clientId`                   | Get a specific client by their ID. | `GetClientById.usecase.ts`         |
| `Planned` | `POST`   | `/api/v1/admin/clients/:clientId/training-sessions` | Create a new training session.     | `CreateTrainingSession.usecase.ts` |
| `Planned` | `PUT`    | `/api/v1/admin/training-sessions/:sessionId`        | Update a training session.         | `UpdateTrainingSession.usecase.ts` |
| `Planned` | `DELETE` | `/api/v1/admin/training-sessions/:sessionId`        | Delete a training session.         | `DeleteTrainingSession.usecase.ts` |

### Client Routes (Phase 2)

| Status    | Method | Endpoint                       | Description                               | Relevant Use Case                     |
| :-------- | :----- | :----------------------------- | :---------------------------------------- | :------------------------------------ |
| `Planned` | `GET`  | `/api/v1/me`                   | Get the current user's profile.           | `GetMyProfile.usecase.ts`             |
| `Planned` | `PUT`  | `/api/v1/me/personal-info`     | Update the current user's info.           | `UpdateClientPersonalInfo.usecase.ts` |
| `Planned` | `POST` | `/api/v1/me/parq`              | Submit the PAR-Q form.                    | `SubmitParq.usecase.ts`               |
| `Planned` | `GET`  | `/api/v1/me/training-sessions` | Get the current user's training sessions. | `GetMyTrainingSessions.usecase.ts`    |
| `Planned` | `GET`  | `/api/v1/me/plan`              | Get the current user's active plan.       | `GetMyActivePlan.usecase.ts`          |
| `Planned` | `GET`  | `/api/v1/me/past-plans`        | Get the current user's past plans.        | `GetMyPastPlans.usecase.ts`           |

### Video Content Routes (Phase 3)

| Status    | Method | Endpoint                            | Description                             | Relevant Use Case                   |
| :-------- | :----- | :---------------------------------- | :-------------------------------------- | :---------------------------------- |
| `Planned` | `POST` | `/api/v1/videos/upload-url`         | Generate a presigned URL for S3 upload. | `GeneratePresignedUrl.usecase.ts`   |
| `Planned` | `POST` | `/api/v1/videos/metadata`           | Save video metadata to the database.    | `SaveVideoMetadata.usecase.ts`      |
| `Planned` | `GET`  | `/api/v1/videos/search`             | Search for videos.                      | `SearchVideos.usecase.ts`           |
| `Planned` | `GET`  | `/api/v1/videos/category/:category` | Get all videos by category.             | `GetAllVideosByCategory.usecase.ts` |
| `Planned` | `GET`  | `/api/v1/videos/:videoId/stream`    | Get a streaming URL for a video.        | `GetVideoStream.usecase.ts`         |

### Payment & Subscription Routes (Phase 4)

| Status    | Method | Endpoint                            | Description                          | Relevant Use Case                  |
| :-------- | :----- | :---------------------------------- | :----------------------------------- | :--------------------------------- |
| `Planned` | `POST` | `/api/v1/payments/checkout-session` | Create a new checkout session.       | `CreateCheckoutSession.usecase.ts` |
| `Planned` | `GET`  | `/api/v1/me/subscription`           | Get the current user's subscription. | `GetMySubscription.usecase.ts`     |
| `Planned` | `POST` | `/api/v1/subscriptions/cancel`      | Cancel a subscription.               | `CancelSubscription.usecase.ts`    |

---

## Webhooks (Not directly called by frontend)

| Status    | Method | Endpoint               | Description                                     | Service |
| :-------- | :----- | :--------------------- | :---------------------------------------------- | :------ |
| `Planned` | `POST` | `/api/webhooks/stripe` | Handle payment events from the payment gateway. | Stripe  |
