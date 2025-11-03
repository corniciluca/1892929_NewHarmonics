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
Manages the frontend logic of the application, including webpage display and requests to the API Gateway.

### USER STORIES:
1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22

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

- PAGES: <put this bullet point only in the case of frontend and fill the following table>
    
    | Name            | Description            | Related Microservice | User Stories |
    |-----------------|------------------------|----------------------|--------------|
    | Home            | Home page              |     song-service                 | 6            |
    | Register        | Sign up page           |      user-service                | 1            |
    | Login           | Log in page            |  user-service                    | 4            |
    | UserProfile     | Profile page           |   user-service                   | 9, 13, 18, 21, 22 |
    | EditProfile     | Profile editing form   |       user-service               | 2, 3         |
    | Feed            | Feed page              | user-service, song-service       | 10           |
    | Upload          | Song upload form       |       song-service               | 12           |
    | SongEdit        | Song editing form      |     song-service                 | 15           |
    | SongsManagement | User's songs page      |       song-service               | 13           |
    | SearchResults   | Landing page of search |     elasticsearch                | 10           |
    | Following       | Followed artists page  |       user-service               | 9            |

## CONTAINER_NAME: api-gateway

### DESCRIPTION
Acts as the single entry point for all client requests, handling routing, authentication, and JWT validation before forwarding requests to appropriate microservices.

### USER STORIES
All (1-22)

### PORTS
9000:9000

### PERSISTENCE EVALUATION
This container does not persist data.

### EXTERNAL SERVICES CONNECTIONS
Routes requests to:
- user-service:8080
- song-service:8082
- notification-service:8083

### MICROSERVICES

#### MICROSERVICE: API Gateway
- **TYPE:** Backend (Gateway)
- **DESCRIPTION:** Spring Cloud Gateway handling authentication, routing, and CORS.
- **PORTS:** 9000
- **TECHNOLOGICAL SPECIFICATION:** Built with Spring Cloud Gateway and Spring Security. Uses JWT for authentication.
- **SERVICE ARCHITECTURE:**
  - `config/` - Security and JWT configuration
  - `filter/` - Custom filters (PreAuthFilter for user context)

- **ROUTES:**

    | Route ID            | Path Pattern              | Target Service       | Method  | Auth Required |
    |---------------------|---------------------------|----------------------|---------|---------------|
    | auth-login          | /auth/login               | user-service         | POST    | No            |
    | auth-register       | /auth/register            | user-service         | POST    | No            |
    | songs-public        | /songs/**                 | song-service         | GET     | No            |
    | song-search-public  | /songs/search/**          | song-service         | GET     | No            |
    | auth-protected      | /auth/**                  | user-service         | ALL     | Yes           |
    | user-service-route  | /users/**                 | user-service         | ALL     | Yes           |
    | songs-service-route | /songs/**                 | song-service         | ALL     | Yes           |
    | feed-service-route  | /feed/**                  | song-service         | GET     | Yes           |
    | notification-route  | /notifications/**         | notification-service | ALL     | Yes           |


## CONTAINER_NAME: song-service

### DESCRIPTION: 
Manages song storage, metadata, upload/download, search functionality, and user feeds.

### USER STORIES:
<list of user stories satisfied>

### PORTS: 
8082:8082

### PERSISTENCE EVALUATION
- Song metadata stored in MongoDB
- Audio files and cover images stored in MinIO
- Search index maintained in Elasticsearch
  
### EXTERNAL SERVICES CONNECTIONS
- MongoDB (port 27017)
- Elasticsearch (port 9200)
- MinIO (port 9000)
- RabbitMQ (for song events)

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
    - model, to handle data representation of each song object.
- ENDPOINTS:
    		
    | HTTP METHOD | URL                      | Description                          | User Stories |
    |-------------|--------------------------|--------------------------------------|--------------|
    | GET         | /songs                   | Fetches all songs                    | 6            |
    | GET         | /songs/{id}              | Fetches a specific song              | 16           |
    | GET         | /songs/{id}/download     | Downloads a song file                | 19           |
    | GET         | /songs/{id}/cover        | Fetches the cover image              | 16           |
    | POST        | /songs/upload            | Uploads a song (ARTIST only)         | 12           |
    | POST        | /songs/{id}/update       | Updates a song (ARTIST only)         | 15           |
    | DELETE      | /songs/{id}              | Deletes a song (ARTIST only)         | 14           |
    | GET         | /songs/artist/{artistId} | Fetches all songs by an artist       | 13, 22       |
    | POST        | /songs/{id}/like         | Likes a song                         | 17           |
    | DELETE      | /songs/{id}/like         | Unlikes a song                       | 17           |
    | GET         | /songs/liked             | Fetches all liked songs              | 18           |

- DB STRUCTURE:
  ```json
    {
      "songs": [
        {
          "_id": "ObjectId",
          "title": "string",
          "artist": "string",
          "artistId": "Long",
          "album": "string",
          "genre": "string",
          "fileUrl": "string (MinIO object name)",
          "coverImageUrl": "string (MinIO object name)",
          "playCount": "Long",
          "durationSeconds": "Integer",
          "uploadDate": "LocalDateTime",
          "likedBy": ["Long", "Long", ...],
          "_class": "string"
        }
      ]
    }

#### MICROSERVICE: Feed Service
- TYPE: Backend
- DESCRIPTION: Retrieves the feed of the current user
- PORTS: 8082
- TECHNOLOGICAL SPECIFICATION: Uses WebClient to communicate with User Service, queries MongoDB for songs.
- SERVICE ARCHITECTURE:
  	The service uses four kind of files:
    - config, for configuring interaction with other services;
    - controller, to define the necessary endpoints;
    - service, to implement the logic of each endpoint;
    - model, to handle data representation of each song object.

- ENDPOINTS:
    		
    | HTTP METHOD | URL   | Description                           | User Stories |
    |-------------|-------|---------------------------------------|--------------|
    | GET         | /feed | Fetches the feed for the current user |   10         |

#### MICROSERVICE: Song Search Service
- TYPE: Backend
- DESCRIPTION: Handles song search features using Elasticsearch
- PORTS: 8082
- TECHNOLOGICAL SPECIFICATION: Elasticsearch for indexing and querying.
- SERVICE ARCHITECTURE:
  The service uses four kind of files:
  - `service/SongSearchService.java` - Search logic
  - `repository/SongSearchRepository.java` - Elasticsearch repository
  - `model/SongDocument.java` - Elasticsearch document model

- ENDPOINTS:

    | HTTP METHOD | URL                         | Description                      | User Stories |
    |-------------|-----------------------------|----------------------------------|--------------|
    | GET         | /songs/search               | Full-text search across songs    | 20           |
    | POST        | /songs/search/reindex       | Re-indexes all songs             | -            |
    | GET         | /songs/search/title         | Search by title                  | 20           |
    | GET         | /songs/search/genre/{genre} | Filter by genre                  | 20           |
    | GET         | /songs/search/trending      | Get trending songs               | 6            |
    | GET         | /songs/search/recent        | Get recent uploads               | 6            |


## CONTAINER_NAME: user-service

### DESCRIPTION:
Manages storage of user accounts.

### USER STORIES:
<list of user stories satisfied>

### PORTS:
8080:8080

### PERSISTENCE EVALUATION
This container saves the details of the accounts in an H2 database using a docker volume.

### EXTERNAL SERVICES CONNECTIONS
This container connects to an H2 database and the rabbitmq service.

### MICROSERVICES:

#### MICROSERVICE: User Service
- TYPE: Backend
- DESCRIPTION: Handles CRUD operations for user accounts and JWT generation.
- PORTS: 8080
- TECHNOLOGICAL SPECIFICATION: The service uses the SpringBoot API to implement CRUD operations in a RESTful manner. H2 DB is used to store the data. BCrypt for password encryption.
- SERVICE ARCHITECTURE:
  The service uses four kind of files:
  - `config/` - Security, JWT, and RabbitMQ configuration
  - `controller/` - REST API endpoints
  - `service/` - Business logic layer
  - `model/` - User entity definitions
  - `repository/` - JPA repositories
  - `util/` - JWT utility class

- ENDPOINTS:

    | HTTP METHOD | URL                         | Description                          | User Stories |
    |-------------|-----------------------------|--------------------------------------|--------------|
    | GET         | /users                      | Fetches all users                    | -            |
    | GET         | /users/{id}                 | Fetches a single user                | 21, 22       |
    | POST        | /users                      | Creates a new user                   | 1            |
    | PUT         | /users/{id}                 | Updates a user's details             | 2            |
    | DELETE      | /users/{id}                 | Deletes a user and all their songs   | 3            |
    | POST        | /auth/register              | Registers a new user                 | 1            |
    | POST        | /auth/login                 | Authenticates user and returns JWT   | 4            |
    | GET         | /auth/validate              | Validates JWT token                  | -            |


- DB STRUCTURE:
  **_USERS_** :	| **_ID_** | **_CREATED_AT_** | **_EMAIL_** | **_PASSWORD_** | **_ROLE_** | **_UPDATED_AT_** | **_USERNAME_** |

#### MICROSERVICE: Follow Service
- TYPE: Backend
- DESCRIPTION: Handles the logic related to the following of user accounts.
- PORTS: 8080
- TECHNOLOGICAL SPECIFICATION: The service uses the SpringBoot API to implement CRUD operations in a RESTful manner. H2 DB is used to store the data.
- SERVICE ARCHITECTURE:
  The service uses four kind of files:
    - config, for configuring interaction with other services;
    - controller, to define the necessary endpoints;
    - service, to implement the logic of each endpoint;
    - model, to handle data representation of each user object.
- ENDPOINTS:

  | HTTP METHOD | URL                         | Description                                      | User Stories |
  |-------------|-----------------------------|--------------------------------------------------|--------------|
  | GET         | /users/{artistId}/followers | Fetches the followers of an artist               | -            |
  | GET         | /users/{id}/followed        | Fetches the followed artists of the current user | 9            |
  | POST        | /users/follow/{artistId}    | Follows an artist                                | 7            |
  | DELETE      | /users/unfollow/{artistId}  | Unfollows an artist                              | 8            |

- DB STRUCTURE:

  **_USER_FOLLOWS_** :	| **_FOLLOWER_ID_** | **_ARTIST_ID_** |

## CONTAINER_NAME: notification-service

### DESCRIPTION
Manages user notifications for events like new song uploads from followed artists.

### USER STORIES
11

### PORTS
8083:8083

### PERSISTENCE EVALUATION
Notifications stored in H2 database with notification metadata.

### EXTERNAL SERVICES CONNECTIONS
- H2 database (embedded)
- RabbitMQ (listens to song upload events)
- User Service (fetches followers)

### MICROSERVICES

#### MICROSERVICE: Notification Service
- **TYPE:** Backend
- **DESCRIPTION:** Creates and manages notifications based on RabbitMQ events.
- **PORTS:** 8083
- **TECHNOLOGICAL SPECIFICATION:** Spring Boot with Spring AMQP for RabbitMQ, WebClient for inter-service communication.
- **SERVICE ARCHITECTURE:**
  - `config/` - RabbitMQ configuration
  - `controller/` - REST endpoints
  - `service/` - Notification business logic
  - `listener/` - RabbitMQ event listener
  - `model/` - Notification entity
  - `repository/` - JPA repository

- **ENDPOINTS:**

    | HTTP METHOD | URL                       | Description                        | User Stories |
    |-------------|---------------------------|------------------------------------|--------------|
    | GET         | /notifications            | Get all user notifications         | 11           |
    | GET         | /notifications/unread     | Get unread notifications           | 11           |
    | GET         | /notifications/unread/count | Get unread notification count    | 11           |
    | PUT         | /notifications/{id}/read  | Mark notification as read          | 11           |
    | PUT         | /notifications/read-all   | Mark all notifications as read     | 11           |

- **DB STRUCTURE:**

    **_NOTIFICATIONS_**: | **ID** | **USER_ID** | **TYPE** | **MESSAGE** | **REFERENCE_ID** | **REFERENCE_TYPE** | **IS_READ** | **CREATED_AT** | **ARTIST_ID** | **ARTIST_NAME** | **SONG_TITLE** |

## CONTAINER_NAME: mongo

### DESCRIPTION
MongoDB database for song metadata storage.

### USER STORIES
12, 13, 14, 15, 16, 17, 18

### PORTS
27017:27017

### PERSISTENCE EVALUATION
Stores song documents with metadata. Persisted via Docker volume (`mongo_data`).

### EXTERNAL SERVICES CONNECTIONS
Connected to by song-service.

## CONTAINER_NAME: elasticsearch

### DESCRIPTION
Search engine for song search.

### USER STORIES
6, 20

### PORTS
9200:9200, 9300:9300

### PERSISTENCE EVALUATION
Maintains search index of songs. Persisted via Docker volume (`elasticsearch_data`).

### EXTERNAL SERVICES CONNECTIONS
Connected to by song-service.

## CONTAINER_NAME: minio

### DESCRIPTION
Object storage for audio files and cover images.

### USER STORIES
12, 14, 15, 16, 19

### PORTS
9001:9000 (API), 9090:9090 (Console)

### PERSISTENCE EVALUATION
Stores binary files (audio and images). Persisted via Docker volume (`minio_data`).

### EXTERNAL SERVICES CONNECTIONS
Connected to by song-service.

## CONTAINER_NAME: rabbitmq

### DESCRIPTION
Message broker for asynchronous event handling.

### USER STORIES
3, 11

### PORTS
5672:5672 (AMQP), 15672:15672 (Management UI)

### PERSISTENCE EVALUATION
Queues and exchanges for events:
- `music.exchange` → `song.uploaded` queue (for notifications)
- `user.exchange` → `user.deleted` queue (for cascade deletion)

### EXTERNAL SERVICES CONNECTIONS
Connected to by user-service, song-service, and notification-service.



