# Project Introduction
### Project Name: Chithi
Chithi is a social media application designed to provide a smooth and engaging user experience using modern technologies. It includes features for authentication, chat, user profiles, posts, comments, reactions, notifications, and follower/block management.

| **Feature**           | **Sub-feature**                              |
| --------------------- | -------------------------------------------- |
| **Authentication**    | 1. Sign Up                                   |
|                       | 2. Sign In                                   |
|                       | 3. Log Out                                   |
|                       | 4. Password Reset                            |
| **Chat**              | 1. Private messages                          |
|                       | 2. Add Message Reaction                      |
|                       | 3. Send Image in Message                     |
|                       | 4. Mark Message as Read                      |
|                       | 5. Delete Message self / both                |
|                       | 6. Search User for chat                      |
| **User**              | 1. Get Single User Profile                   |
|                       | 2. Get Multiple User with infinite scrolling |
|                       | 3. Get Random Suggested Users                |
|                       | 4. Edit Profile                              |
|                       | 5. Add Cover Page                            |
| **Post**              | 1. Create Post (also With Image)             |
|                       | 2. Get All Post (Based on following, public) |
|                       | 3. Update Post                               |
|                       | 4. Edit Post                                 |
| **Comments**          | 1. Add Comment                               |
|                       | 2. Delete Comment                            |
| **Reactions**         | 1. Add Post Reaction                         |
|                       | 2. Show All Post Reaction                    |
|                       | 3. Remove Self Reaction                      |
| **Notification**      | 1. Notification Setting                      |
|                       | 2. Send Notification on Action               |
|                       | 3. Mark read as notification                 |
|                       | 4. Display All Notifications                 |
| **Followers & Block** | 1. Follow User                               |
|                       | 2. UnFollow User                             |
|                       | 3. Show all Follower and Following List      |
|                       | 4.Block User                                 |
|                       | 5.Unblock User                               |

Technology Stack

| ![Image 1](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868436/Chithi%20Presentation/png-clipart-angularjs-typescript-javascript-vue-js-others-blue-angle-thumbnail_n2iccr.png) | ![Image 2](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868436/Chithi%20Presentation/React-Symbol_sonbkt.png) | ![Image 3](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868615/Chithi%20Presentation/640px-Sass_Logo_Color.svg_tm10qs.png) |
|-------------------------|-------------------------|-------------------------|
| ![Redux](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868437/Chithi%20Presentation/1_AJpFZrofvxMn3MHh9p3i_Q_yfsq0q.jpg) | ![Axios](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868809/Chithi%20Presentation/57233884-20344080-6fe5-11e9-8df3-0df1282e1574_s5jj1m.png) | ![Socket.io](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868436/Chithi%20Presentation/socket-io_rurvrn.png) |
|-------------------------|-------------------------|-------------------------|
| ![Redux](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868437/Chithi%20Presentation/1_AJpFZrofvxMn3MHh9p3i_Q_yfsq0q.jpg) | ![Axios](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868809/Chithi%20Presentation/57233884-20344080-6fe5-11e9-8df3-0df1282e1574_s5jj1m.png) | ![Socket.io](https://res.cloudinary.com/dyn3w0n6w/image/upload/v1717868436/Chithi%20Presentation/socket-io_rurvrn.png) |


1. Typescript
2. React 18
3. Node.js
4. Express.js
5. Mongoose
6. Redux Toolkit
7. Jest
8. Vitest
9. React Testing Library
10. Redis
11. Socket IO
12. MSW (API Mock)
13. BullMQ (Implementing Message Queue )
14. PM2
15. Cloudinary
16. MongoDB
17. Nodemailer
18. BREVO(SMTP)

## Requirements

1. **Node.js**
   - Install Node.js from [nodejs.org](https://nodejs.org/).

2. **Giphy API Key**
   - Sign up on [Giphy Developers](https://developers.giphy.com/) to get an API key.

3. **Cloudinary**
   - Use the same Cloudinary cloud name as the backend for storage. Sign up at [Cloudinary](https://cloudinary.com/) if needed.

4. **Environment Variables**
   - Copy all environment variables from `.env.example` and update the `.env` file with your credentials.

## Installation

1. **Clone the Repository and Install Dependencies**
   ```bash
   git clone <this_url> && cd <repo_name>
   npm i
   ```

2. **Create and Configure the `.env` File**
   - Create a `.env` file in the root directory.
   - Add the following environment variables and update them with your credentials:
     ```env
     VITE_BASE_ENDPOINT=<Your Backend URL>
     VITE_ENVIRONMENT=<development | production | test>
     VITE_CLOUD_NAME=<Your Cloudinary Cloud Name>
     VITE_GIPHY_API_KEY=<Your Giphy API Key>
     ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```