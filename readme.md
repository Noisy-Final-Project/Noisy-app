# Table of Contents

1.  [Introduction](#org9f62411)
2.  [Controller](#org6626fb7)
    1.  [Built With](#orgc6bd0c2)
    2.  [Controller as a Router](#org5058967)
3.  [Model](#org0ea6f29)
    1.  [The Database](#orga124d95)
    2.  [Interaction with the DB](#orgd4afea9)
4.  [View](#org2a9ca5c)
    1.  [User Interaction](#org5e8d449)
    2.  [Sound Recording](#org7b95fdf)

<a id="org9f62411"></a>

# Introduction

Our project&rsquo;s architecture is based upon MVC architecture. The server side has two components - the Controller and the Model.
In our project, the View (client) is represented by the React Native app and the Model and the controller are submodules of the server.

The Controller purpose is the transfer information/requests between the client and the model, while the Model is responsible for interacting with the database and setting a scaleable interface to process data intercepted by
the database.

<a id="org6626fb7"></a>

# Controller

<a id="orgc6bd0c2"></a>

## Built With

Our development stack is composed by the following libraries:

1.  `Express` - Intercepting and handling `HTTP` packets with `POST/GET` requests from the View, an HTTP server.
2.  `CORS` - Managing the Cross-Origin policy between the server and the client.
3.  `Morgan` - Managing the logging system.

Those tools helped us implement and deliver the basic and necessary conditions for a fully functioning application.

<a id="org5058967"></a>

## Controller as a Router

The essence of the controller is to serve as a &ldquo;router&rdquo; of information from the View to the Model.
It does so by intercepting user requests, evaluating them and calls the corresponding functions from the Model.
After the Model retrieves a result, the controller returns a response.

<a id="org0ea6f29"></a>

# Model

<a id="orga124d95"></a>

## The Database

We use MongoDB as our database, which is hosted over at Atlas servers. The connection is made using the `NodeJS` driver
for MongoDB.

Our first task as database designers was to produce a conceptual data model that reflects the structure of
the information to be held in the database. In the process, we asked our selves - &ldquo;how can the database be scaleable&rdquo; and
in the same time we asked &ldquo;How can we make it as simple enough to make complex queries in the future?&rdquo;.

The result was a database with three base Collections:

1.  `Users` - The users that add reviews using their credentials.
2.  `Locations` - The locations that are enlisted as having reviews.
3.  `Reviews` - The details of each review.

The `Users` collection is composed by documents with the following fields:

    {
        id: <PK>,
        name: <string>,
        date of birth: <string>,
        Email: <string>,
        password (hash): <string>,
        expiration date: <DateTime>
    }

The `Locations` collection is composed by documents with the following fields:

    {
        id: <PK>,
        name: <string>,
        location: <Location Object>,
        address: <string>,
        category: <string>,
        creation date: <DateTime>
    }

The `Reviews` collection is composed by documents with the following fields:

    {
        id: <PK>,
        userID: <string>,
        locationID: <string>,
        userText: <string>,
        Objective Sound: <double>,
        Sound Opinion: <string>,
        Labels attached: <array<string>>,
        creation date: <DateTime>
    }

It is possible to see that structure is lean, intuitive and full - which was one of our goals.

<a id="orgd4afea9"></a>

## Interaction with the DB

The Model in our project is responsible of querying the database (utilizing the MongoDB API) and can be used further
to analyze the data to give statistical information regarding the noise level of different location.

In practice, the Model is receives a set of requests from the Controller. There function that are most used in the
Model are finding all location by a specified area, getting reviews for display and insert a review for registered
users and anonymous users.

<a id="org2a9ca5c"></a>

# View

The View (equivalently, the client) is how the user interacts with our system. The client is based upon React Native
utilizing different packages for sending HTTP requests and authentication. The client is also responsible for one
of our main features: recording the sound in an enviroment and analyzing it.

<a id="org5e8d449"></a>

## User Interaction

User interactions are divided to two sets of functions:

1.  Contribution
    1.  Adding a location to the database.
    2.  Writing a noise review for a location, whether it is in the database or not (resulting in adding it).
    3.  Recording a noise sample of a location, which gives an objective &ldquo;feel&rdquo; for the review.
2.  Consumption
    1.  View different location in a specified area with noise reviews. The user can even filter locations by the labels
        attached to their reviews.
    2.  View detailed reviews of each location in a simplified, easy to read way.

Since the application must be suitable for audiences from different age groups, we aimed at making the application
as simple and information as concise as possible.

<a id="org7b95fdf"></a>

## Sound Recording

Analysis of sound can be a &ldquo;heavy&rdquo; task for the server, if we consider scaleability. We decided then to process the
sound input on the client.

While the creating a new review, a small button should appear with the label &ldquo;Test&rdquo;. That button creates a recording session of 15 seconds. From that recording we sample 75 times for decibel value which will go to further analysis.

Those 75 samples are divided to 6 sets based on their decibel value. Each set contains samples within a certain range of decibels. Then we calculate the following:

$$
\text{SoundValue} = \sum_{i=0}^{5} i \cdot \frac{|S_{i}|}{|S|}
$$

Where $S_i$ is a sample with a certain range of decibels, $S$ is the total sample sets.
The motivation behind that calculation is giving more influence to the set of samples with more elements and less influence for sets with less elements.

The result is floating point number in range $[0,5]$, which represents the &ldquo;noise grade&rdquo; the location will get for that recording.


## [Watch Demo](https://youtu.be/_R10kVTdyZY)


## [Watch Demo](https://youtu.be/_R10kVTdyZY)


