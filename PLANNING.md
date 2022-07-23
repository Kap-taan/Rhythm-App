# Database

=> Song
=> Album (Collection of songs and its id is stored in collective documents)
=> Playlists (Collection of songs with a id corresponding to a particular user)
=> Recently Played (Collection of Songs in a document but with a limit)
=> Liked Songs (Collection of Songs in a document)

# Song

    [] title (String)
    [] Singer (Array)
    [] Lyrics (Array)
    [] Music (Array)
    [] link (url)
    [] img (url)
    [] count (Int)
    [] type (String)
    [] release date (date)

# User

    [] name
    [] email
    [] playlists (Document id)
    [] liked songs (Document id)

# Features

    [] Recommendation
    [] Favourite Songs
    [] Infinte Scrolling
    [] New Releases

# Algorithm for Liked Songs

-> Liked Songs
-> Song ka document array of users
-> User_id@likedsongs mei song add kar do

# Algorithm for Unliking the Song

->
