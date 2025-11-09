# NewHarmonics 

New Harmonics is a music sharing web app where users can register either as artists or listeners. Artists can upload songs with basic metadata (title, album, genre), while all users can browse and play music. The system includes a basic dashboard that displays popular songs and tracks from artists the current user is following. Users can also download or like songs in order to save them and get notifications regarding the latest uploads of their followings.
---

## USER STORY 1: Account Creation

### Story
As an unregistered user, I want to create an account, so that I can start using the application.

### Priority: High

### Acceptance Criteria
* User can choose between ARTIST and LISTENER roles.
* Username must be unique.
* Email validation is performed (checks for valid format and uniqueness).
* Password is securely encrypted and stored in the database.

### Non-Functional Requirements
* Password must meet security standards (min 8 characters, 1 uppercase, 1 number).

### Lo-Fi Mockup
**Description:** Registration form with fields for username, email, password, and role selection (radio buttons for ARTIST/LISTENER).

<img width="1390" height="1057" alt="SCR-20251107-ltlt" src="https://github.com/user-attachments/assets/463e6af3-dea2-4bbc-8ecb-b5234fb63249" />

---

## USER STORY 2: Edit Profile

### Story
As a registered user, I want to edit my profile (name, email, password), so that it reflects my preferences.

### Priority: Medium

### Acceptance Criteria
* User can navigate to a "Edit Profile" page.
* User can update their name.
* User can update their email.
* User can change their password.
* A "Save Changes" button persists the new information.
* A success message is shown on successful update.
* Error messages are shown for invalid input.
  
### Non-Functional Requirements
* Password change must follow security standards.
* Email uniqueness check must be efficient.

### Lo-Fi Mockup
**Description:** A profile settings form with fields for "Name," "Email," and a separate "Change Password" section with "Old Password," "New Password," and "Confirm New Password."

<img width="1243" height="949" alt="image" src="https://github.com/user-attachments/assets/77e711ac-2c42-4fed-ac5c-a5e4c1aad8f9" />


---

## USER STORY 3: Delete Account

### Story
As a registered user, I want to delete my account, so that I can permanently remove my profile and songs.

### Priority: Medium

### Acceptance Criteria
* User can find a "Delete Account" option in their profile settings.
* Upon confirmation, the user's account and all associated data are permanently deleted from the database.
* All uploaded songs by the user (if an artist) are also deleted.
* The user is automatically logged out and redirected to the home page.

### Non-Functional Requirements
* Associated data (likes, followers, songs) must be correctly removed via cascading delete or a cleanup job.

### Lo-Fi Mockup
**Description:** A confirmation modal that appears after clicking "Delete Account." It has a strong warning message and a password input field for confirmation.

### Refer to Edit Profile mockup


---

## USER STORY 4: User Login

### Story
As a registered user who is logged out, I want to log in, so that I can access all the features.

### Priority: High

### Acceptance Criteria
* User provides email (or username) and password.
* Credentials are validated against the database.
* On success, a session is created, and the user is redirected to the Home Page.
* On failure, a clear error message is displayed.

### Non-Functional Requirements

### Lo-Fi Mockup
**Description:** A simple login form with "Email," "Password," and "Log In" button.

<img width="1245" height="948" alt="image" src="https://github.com/user-attachments/assets/59b6150b-d6f2-4c04-926a-a7744dc602d1" />


---

## USER STORY 5: User Logout

### Story
As a registered logged-in user, I want to log out, so that I can leave the application securely.

### Priority: High

### Acceptance Criteria
* A "Log Out" button/link is accessible (e.g., in a user profile dropdown).
* Clicking "Log Out" invalidates the user's session on the server.
* The user is redirected to a non-authenticated page (Home Page).

### Non-Functional Requirements
* The action must be immediate.

### Lo-Fi Mockup
**Description:** A dropdown menu from the user's profile icon, showing a "Log Out" link.

### Refer to Edit Profile mockup

---

## USER STORY 6: View Home Page

### Story
As a user, I want to view the Home Page, so that I can explore the newest and most popular uploaded songs.

### Priority: High

### Acceptance Criteria
* The Home Page is accessible to both logged-in and logged-out users.
* A section displays "Newest Uploads" in reverse chronological order.
* A section displays "Most Popular" songs (based on plays/likes).
* Each song is displayed as a card with (at minimum) cover art, title, and artist name.
* Clicking a song card starts playback.
* Clicking the artist's name navigates to the artist's profile page.

### Non-Functional Requirements
* Page load time must be fast, even with many images (use lazy loading).
* The "Popular" algorithm is defined and performs well.

### Lo-Fi Mockup
**Description:** A dashboard-style page with horizontal scrolling carousels for "Newest Uploads" and "Most Popular."

<img width="1244" height="947" alt="image" src="https://github.com/user-attachments/assets/e9e49e21-efb8-4d34-a729-cd001f1cbe66" />


---

## USER STORY 7: Follow Artist

### Story
As a registered user, I want to follow an artist, so that I can quickly access their profiles and music.

### Priority: Medium

### Acceptance Criteria
* When viewing an artist's profile page, a "Follow" button is visible (if not already following).
* Clicking "Follow" adds a record to the database linking the user and the artist.
* The button text changes to "Following" or "Unfollow."

### Non-Functional Requirements
* The action should feel instantaneous to the user.

### Lo-Fi Mockup
**Description:** An artist's profile page with a prominent "Follow" button near their name.

<img width="1246" height="947" alt="image" src="https://github.com/user-attachments/assets/0bcb2c4c-a901-4d7d-a6d3-a05d8038c9b3" />


---

## USER STORY 8: Unfollow Artist

### Story
As a registered user, I want to unfollow an artist, so that I remove them from my following list.

### Priority: Medium

### Acceptance Criteria
* When viewing a followed artist's profile page, an "Unfollow" (or "Following") button is visible.
* Clicking "Unfollow" removes the link between the user and the artist in the database.
* The button text changes back to "Follow."
* The artist's content will no longer appear in the user's Feed.

### Non-Functional Requirements

### Lo-Fi Mockup
**Description:** The same button from User Story 7, but in its "Following" state, which, when clicked, triggers the unfollow action.

### Refer to Follow Artist mockup

---

## USER STORY 9: View Following Page

### Story
As a registered user, I want to open my Following Page, so that I can see the artists I follow.

### Priority: Medium

### Acceptance Criteria
* A link to "Following" is available in the user's profile.
* The page displays a list of all artists the user is currently following.
* Each list item shows the artist's name and profile picture.
* Clicking an artist's name navigates to their profile page.
* An "Unfollow" button is available next to each artist in the list.

### Non-Functional Requirements
* The list should be paginated or use infinite scroll if it can become very long.

### Lo-Fi Mockup

**Description:** A simple list view. Each row contains an artist's circular profile picture, their name, and an "Unfollow" button.

<img width="1245" height="946" alt="image" src="https://github.com/user-attachments/assets/c40671aa-e014-4cfd-9039-8cd925de5962" />


---

## USER STORY 10: View Feed Page

### Story
As a registered user, I want to open my Feed Page, so that I can see the recent uploads from the artists I follow.

### Priority: High

### Acceptance Criteria
* A "Feed" link is prominent in the navigation for logged-in users.
* The page displays a chronological feed of the latest song uploads *only* from artists the user follows.
* Each feed item shows the song, the artist who uploaded it, and the time of upload.

### Non-Functional Requirements

### Lo-Fi Mockup
**Description:** A vertical, timeline-style feed (like Twitter or Facebook) where each post is a new song upload, with cover art, title, and artist.

<img width="1246" height="948" alt="image" src="https://github.com/user-attachments/assets/c321a4a0-993f-4f64-82fb-a7fb974d7ce2" />


---

## USER STORY 11: Upload Notification

### Story
As a registered user, I want to get notified when someone I follow uploads a new song, so that I can listen right away.

### Priority: Medium

### Acceptance Criteria
* When an artist uploads a new song, a notification is generated for all their followers.
* A notification icon (e.g., a "bell") in the app header shows a badge for unread notifications.
* Clicking the bell icon opens a dropdown listing recent notifications (e.g., "Artist X uploaded 'Song Title'").
* Clicking the notification navigates the user to the new song.

### Non-Functional Requirements
* Notification generation should be a background job to not slow down the upload process.
* The system must scale to handle fanning out notifications to millions of followers for a popular artist.
* Real-time updates (e.g., WebSockets) could be used to show the badge instantly.

### Lo-Fi Mockup
**Description:** A "bell" icon in the app's main header. A dropdown list appears when clicked, showing new activity.

<img width="1242" height="946" alt="image" src="https://github.com/user-attachments/assets/0e8f96c2-cac5-4cdb-859a-3888bd67657f" />


---

## USER STORY 12: Upload Song/Podcast

### Story
As an artist, I want to upload a song or podcast, so that others can listen to my content.

### Priority: High (for Artists)

### Acceptance Criteria
* Artists have an "Upload" button in the navigation.
* The upload page has a form to:
    * Upload an audio file (e.g., .mp3, .wav).
    * Upload cover art (e.g., .jpg, .png).
    * Add a title.
    * Add a description.
    * Select a genre.
* Validation ensures all required fields are filled and files are of the correct type.
* An "Upload" button starts the process.
* A success message is shown, and the artist is redirected to the new song's page.

### Non-Functional Requirements
* Audio files must be stored in a scalable object storage (minIO).

### Lo-Fi Mockup
**Description:** A multi-step form. Step 1: "Drag and drop your audio file." Step 2: "Fill in the details (title, genre, cover art)."

<img width="1244" height="946" alt="image" src="https://github.com/user-attachments/assets/21d28fd8-ff4f-4c8b-bc18-85804803db11" />


---

## USER STORY 13: View My Uploaded Songs

### Story
As an artist, I want to see the list of songs I have uploaded, so that I can manage my content.

### Priority: Medium (for Artists)

### Acceptance Criteria
* A "My Uploads" link is available on the artist's profile.
* This page displays a list of all songs uploaded by the artist.
* Each song in the list has an "Edit" and "Delete" button next to it.
* The list also shows basic stats.

### Non-Functional Requirements
* The list should be paginated for artists with many uploads.

### Lo-Fi Mockup
[Insert Balsamiq mockup image here]
**Description:** A table or list view, where each row is a song, showing Title, Upload Date, Plays, Likes, and buttons for "Edit" and "Delete."

<img width="1244" height="948" alt="image" src="https://github.com/user-attachments/assets/9b00d18b-3a94-4e5b-bf28-b8c0e9a1cef8" />


---

## USER STORY 14: Delete Uploaded Song

### Story
As an artist, I want to delete one of my uploaded songs, so that it is no longer available to others.

### Priority: Medium (for Artists)

### Acceptance Criteria
* The "Delete" button is available on the "My Uploaded Songs" list (or song's page).
* On confirmation, the song is permanently removed from the database.
* The associated audio file and cover art are deleted from storage.
* The song is removed from all users' "Liked Songs" lists (or handled gracefully).

### Non-Functional Requirements
* The deletion of files from storage must be handled correctly.

### Lo-Fi Mockup
**Description:** A simple confirmation modal: "Are you sure you want to permanently delete 'Song Title'?" with "Cancel" and "Delete" buttons.

### Refer to My Uploaded Songs mockup

---

## USER STORY 15: Update Song Details

### Story
As an artist, I want to update the details of a song (title, genre, album, cover, audio file), so that the information stays accurate.

### Priority: Medium (for Artists)

### Acceptance Criteria
* The "Edit" button is available on the "My Uploaded Songs" list.
* Clicking "Edit" takes the artist to a form pre-filled with the song's current details (title, genre, etc.).
* The artist can change the text fields.
* The artist can upload a new cover art file to replace the old one.
* The artist can (optionally) upload a new audio file to replace the old one.
* A "Save" button updates the song's information in the database.

### Non-Functional Requirements
* Replacing files (audio/image) must correctly overwrite or delete the old file in storage.

### Lo-Fi Mockup
**Description:** The same form as the "Upload" page, but pre-filled with existing song data and with a "Save Changes" button.

<img width="1244" height="949" alt="image" src="https://github.com/user-attachments/assets/738370d7-1ce4-490b-828c-09e2c79e0563" />


---

## USER STORY 16: Listen to a Song

### Story
As a user, I want to listen to a song available on the platform through the player, so that I can enjoy music from different artists.

### Priority: High

### Acceptance Criteria
* Clicking a "Play" button (on a song card) starts audio playback.
* A persistent audio player (at the bottom of the screen) appears.
* The player shows the current song's cover art, title, and artist.
* The player has controls for Play/Pause, and a volume slider.
* A "scrubber" (timeline) shows the current playback position and is seekable.

### Non-Functional Requirements
* Audio must stream smoothly with minimal buffering.
* The player should persist and continue playing as the user navigates to other pages.

### Lo-Fi Mockup
**Description:** A "sticky" footer bar that contains a play/pause button, song title, and a progress bar.

<img width="1243" height="946" alt="image" src="https://github.com/user-attachments/assets/e1a3b2eb-f4b8-4892-bdfb-416f5b73756e" />


---

## USER STORY 17: Add Song to Favorites (Like)

### Story
As a registered user, I want to add a song to my favorites, so that I can easily find it later.

### Priority: High

### Acceptance Criteria
* A "Like" or "Favorite" button (e.g., a heart icon) is visible next to each song.
* Clicking the button adds the song to the user's "Liked Songs" list.
* The button provides immediate visual feedback (e.g., the heart turns red).
* Clicking the button again removes the song from the list (un-likes it).

### Non-Functional Requirements
* The action should be low-latency.

### Lo-Fi Mockup
**Description:** A "heart" icon next to a song's title, which can be in an "empty" or "filled" state.

<img width="1246" height="947" alt="image" src="https://github.com/user-attachments/assets/ce4b7b1d-6b64-46f6-b56f-1d8b5b82e2e2" />


---

## USER STORY 18: View Liked Songs

### Story
As a registered user, I want to see the list of my liked songs, so that I can quickly access my favorite music.

### Priority: Medium

### Acceptance Criteria
* A "Liked Songs" or "Favorites" link is available in the user's navigation or profile.
* The page displays a list of all songs the user has "liked."
* Each song in the list is playable.
* The user can "unlike" a song directly from this list.

### Non-Functional Requirements
* The list should be paginated or use infinite scroll.

### Lo-Fi Mockup
**Description:** A playlist-style view, showing a numbered list of songs with title, artist, and a "heart" (like) button.

<img width="1246" height="949" alt="image" src="https://github.com/user-attachments/assets/fb4de998-6b44-4799-a5da-3e656fff0d28" />


---

## USER STORY 19: Search

### Story
As a user, I want to search for songs by title, artist, or genre, so that I can find the music I want.

### Priority: High

### Acceptance Criteria
* A search bar is present in the application header.
* Pressing "Enter" or clicking "Search" navigates to a search results page.
* The search matches titles, artist names, and genre tags.
* A "No results found" message is shown if the query yields no matches.

### Non-Functional Requirements
* Search must be fast and return relevant results.
* This may require a dedicated search index (Elasticsearch) rather than simple SQL `LIKE` queries for performance.

### Lo-Fi Mockup
**Description:** A search bar at the top of the site. A results page with tabbed sections for "Songs," "Artists," etc.

### Refer to Homepage mockup

---

## USER STORY 20: View My Profile Page

### Story
As a registered user, I want to access my Profile Page, so that I can see my details, favorite songs and followed artists.

### Priority: Medium

### Acceptance Criteria
* A "My Profile" link is available in the user navigation.
* The page displays the user's information.
* The page contains (or links to):
    * A list/grid of their "Liked Songs."
    * A list/grid of the "Artists They Follow."
    * (If an artist) A list/grid of "Their Uploads."
* An "Edit Profile" button is visible.

### Non-Functional Requirements
* The page aggregates data from multiple sources, so queries must be efficient.

### Lo-Fi Mockup
**Description:** A profile page with a user avatar and name at the top, followed by tabbed content for "Likes," "Following," and "Uploads."

<img width="1012" height="949" alt="image" src="https://github.com/user-attachments/assets/1721f29c-e464-4625-b44f-dea31b57528e" />


---

## USER STORY 21: View Artist's Profile Page

### Story
As a user, I want to visit an artist's Profile Page, so that I can see their uploaded music.

### Priority: High

### Acceptance Criteria
* Clicking an artist's name anywhere in the app navigates to their profile page.
* The page displays the artist's name, profile picture, and bio.
* The page shows their total number of followers.
* A "Follow/Unfollow" button is visible (for registered users).
* The main content of the page is a list of all songs/podcasts uploaded by that artist.

### Non-Functional Requirements
* The page should load quickly.

### Lo-Fi Mockup
**Description:** A banner-style page with the artist's cover photo, profile picture, and name, with a "Follow" button. Below this is a grid or list of all their songs.

### Refer to Follow Artist mockup

---

# Effort estimation

![FP](https://github.com/user-attachments/assets/724e4ce1-3cb8-4975-83eb-624b4746fe18)

# COCOMO II

![COCOMO II](https://github.com/user-attachments/assets/f88b7917-ba2e-4e10-9283-b74858198bad)

# System architecture

The system architetture is composed of an orchestration of docker's containers, each of them contain an indipendent microservice with its own database, following the Database per Service pattern.

![sysArch](https://github.com/user-attachments/assets/a0692e19-f248-4c54-9f8b-0a39d302b892)

**Frontend**: offer a single-page react served via Node.js. this service will interacts exclusively with the API Gateway, having no direct contant with other services.

**API Gateway** : implemented via Spring Cloud Gateway, it handles: JWT validation,CORS and request routing toward proper micro-service.

**Song Service**: Song CRUD, playback, feed generation. It interact with MinIO for file storage, with MongoDB to save song's metadata and with elasticsearch for search functionalities. Song Service publishes events to RabbitMQ on two topics: music.exchange (for notifications) and index.exchange (for Elasticseach indexing songs)

**User Service**: Authentication, user management, follow/unfollow. User Service publishes events to RabbitMQ on user.exchange topic whenever a user delete his account, consequently the song service, that is listening on the same queue, delete deletes all songs by that artist from MongoDB and MinIO.

**Notification Service**: Push notifications for followers

# Sprint analytics
# Burndown data
# Burndown chart

