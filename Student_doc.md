# SYSTEM DESCRIPTION:
New Harmonics is a music sharing web app where users can register either as artists or listeners. Artists can upload songs with basic metadata (title, album, genre), while all users can browse and play music. The system includes a basic dashboard that displays popular songs and tracks from artists the current user is following. Users can also download or like songs in order to save them and get notifications regarding the latest uploads of their followings.

# USER STORIES:
1. As an unregistered user, I want to create an account, so that I can start using the application.
2. As a registered user, I want to edit my profile (name, email, password), so that it reflects my preferences. 
3. As a registered user, I want to delete my account, so that I can permanently remove my profile and songs.
4. As a registered user who is logged out, I want to log in, so that I can access all the features.  
5. As a registered logged-in user, I want to log out, so that I can leave the application securely.  
6. As a user, I want to view the Home Page, so that I can explore the newest and most popular uploaded songs.  
7. As a registered user, I want to follow an artist, so that I can quickly accessa their profiles and music.
8. As a registered user, I want to unfollow an artist, so that I remove them from my following list
9. As a registered user, I want to open my Following Page, so that I can see the artists I follow.
10. As a registered user, I want to open my Feed Page, so that I can see the recent uploads from the artists I follow.
11. As a registered user, I want to get notified when someone I follow uploads a new song, so that I can listen right away.  
12. As an artist, I want to upload a song or podcast, so that others can listen to my content.  
13. As an artist, I want to see the list of songs I have uploaded, so that I can manage my content.  
14. As an artist, I want to delete one of my uploaded songs, so that it is no longer available to others.  
15. As an artist, I want to update the details of a song (title, genre, album, cover, audio file), so that the information stays accurate.  
16. As a user, I want to listen to a song available on the platform through the player, so that I can enjoy music from different artists.  
17. As a registered user, I want to add a song to my favorites, so that I can easily find it later.
18. As a registered user, I want to see the list of my liked songs, so that I can quickly access my favorite music.
19. As a user, I want to download a song, so that I can keep it stored in my system.
20. As a user, I want to search for songs by title, artist, or genre, so that I can find the music I want.  
21. As a registered user, I want to access my Profile Page, so that I can see my details, favorite songs and followed artists.  
22. As a user, I want to visit an artist's Profile Page, so that I can see their uploaded music.  

# CONTAINERS:

## CONTAINER_NAME: frontend

### DESCRIPTION: 
Manages the frontend logic of the application, including webpage display and requests.

### USER STORIES:
<list of user stories satisfied>

### PORTS: 
3000:3000

### PERSISTENCE EVALUATION
This container does not use any persitent data.

### EXTERNAL SERVICES CONNECTIONS
This container does not connect to any external service.

### MICROSERVICES:

#### MICROSERVICE: Frontend
- TYPE: Frontend
- DESCRIPTION: Shows webpages and sends requests to the API gateway
- PORTS: 3000
- TECHNOLOGICAL SPECIFICATION: The frontend was realized with Node.js and starts a webserver on local port 3000.
- SERVICE ARCHITECTURE:
  	The service uses three kind of files:
  		- api, used to handle the logic of the requests;
  		- components, used to display a specific key element of the page layout;
  		- routes, used to contain the logic needed to display each page.

- ENDPOINTS: <put this bullet point only in the case of backend and fill the following table>
		
	| HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
    | ... | ... | ... | ... |

- PAGES: <put this bullet point only in the case of frontend and fill the following table>
    
    | Name            | Description            | Related Microservice | User Stories |
    |-----------------|------------------------|----------------------|--------------|
    | Home            | Home page              |                      |              |
    | Register        | Sign up page           |                      |              |
    | Login           | Log in page            |                      |              |
    | UserProfile     | Profile page           |                      |              |
    | EditProfile     | Profile editing form   |                      |              |
    | Feed            | Feed page              |                      |              |
    | Upload          | Song upload form       |                      |              |
    | SongEdit        | Song editing form      |                      |              |
    | SongsManagement | Song editing page      |                      |              |
    | SearchResults   | Landing page of search |                      |              |
    | Following       | Followed artists page  |                      |              |

- DB STRUCTURE: <put this bullet point only in the case a DB is used in the microservice and specify the structure of the tables and columns>

	**_<name of the table>_** :	| **_id_** | <other columns>




## CONTAINER_NAME: song-service

### DESCRIPTION: 
Manages storage of song details, upload and deletion of songs.

### USER STORIES:
<list of user stories satisfied>

### PORTS: 
8082:8082

### PERSISTENCE EVALUATION
This container saves the details of the various uploaded songs in JSON format inside a MongoDB database.

### EXTERNAL SERVICES CONNECTIONS
This container does not connect to any extrnal service.

### MICROSERVICES:

#### MICROSERVICE: Song Management Service
- TYPE: Backend
- DESCRIPTION: Handles the logic related to the management of songs.
- PORTS: 8082
- TECHNOLOGICAL SPECIFICATION: The service uses the SpringBoot API to implement CRUD operations in a RESTful manner. MongoDB is used to store JSON data and MinIO handles the storage.
- SERVICE ARCHITECTURE:
  	The service uses four kind of files:
  		- config, for configuring interaction with other services;
  		- controller, to define the necessary endpoints;
  		- service, to implement the logic of each endpoint;
  		- model, to handle data represantion of each song object.

- ENDPOINTS:
    		
    | HTTP METHOD | URL                      | Description                                     | User Stories |
    |-------------|--------------------------|-------------------------------------------------|--------------|
    | GET         | /songs/{id}              | Fetches a song                                  |              |
    | GET         | /songs/{id}/download     | Downloads a song                                |              |
    | GET         | /songs/{id}/cover        | Fetches the cover image of a song               |              |
    | POST        | /songs/upload            | Uploads a song                                  |              |
    | POST        | /songs/{id}/update       | Updates a song                                  |              |
    | DELETE      | /songs/{id}              | Deletes a song                                  |              |
    | GET         | /songs/artist/{artistId} | Fetches all songs by an artist                  |              |
    | POST        | /songs/{id}/like         | Likes a song                                    |              |
    | DELETE      | /songs/{id}/like         | Unlikes a song                                  |              |
    | GET         | /songs/liked             | Fetches all the songs liked by the current user |              |

- DB STRUCTURE:
    ```json
    {
      songs:
          [
              {
                _id: ,
                title: ...,
                artist: ...,
                artistId: ...,
                album: ..,
                genre: ..,
                fileUrl: ...,
                coverImageUrl: ...,
                playCount: ...,
                durationSeconds: ...,
                uploadDate: ...,
                likedBy: [ userId, userId, ... ],
                _class: ...
              },
            ...
          ]
      }
    ```