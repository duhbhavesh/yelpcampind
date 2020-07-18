# YelpCampind
Best Indian Campsites WebApp

**Live at -** http://yelpcampind.herokuapp.com/

# ![YelpCamp India](https://res.cloudinary.com/dws2yfkqq/image/upload/v1587536264/YelpCamp_npbwdy.png)

YelpCamp is a web application built using NodeJS, ExpressJS, RESTFUL Routes, Embedded JavaScript (EJS) with a few more frameworks and middle-wares used as the application is developed. 
This application is a clone of Yelp, a US based, popular social networking site, that focuses on reviewing businesses and sharing information about them.

## Technology Description:

- [ExpressJS](http://expressjs.com/) is used for Server Side Routing applications.
- [MongooseJS](http://mongoosejs.com/) is used for Back-End Database operations with MongoDB NoSQL Database.
- [Body-Parser](https://github.com/expressjs/body-parser/) is used to parse the data that was received as a result of HTTP POST request.
- [Express.Static()](https://expressjs.com/en/starter/static-files.html) is used to serve the Static files CSS, JS, etc. in the directory as specified.
- [Embedded JavaScript](https://github.com/abhishek363036/YelpCamp/blob/master) is used to embed the JavaScript within the HTML tags to implement the logic.
- [PassportJS](https://github.com/abhishek363036/YelpCamp/blob/master/www.passportjs.org) is used to provide user authentication to the application.
- **Sanitizer** to sanitize the values of the HTML input that arrives as a result of POST request.
- **module.exports** to refactor the app.js file into multiple sub-files.
- Some other self-defined **middlewares** to improve the application such as:
    - to prevent unauthorised access to POST routes.
    - to check whether a user has logged in or not.
- Feature to be added **Google Maps** location for a Campground.
- Applied **dotenv** to keep the Google API key safe and hidden.
- Time functionality created using **MomentJS.**
- Image upload functionality for a Campground created using [Cloudinary](https://cloudinary.com/), a cloud service for hosting images.
- Used **nodemailer** to have a Reset Password functionality if a User forgets his/her password.
- Used **req.originalUrl** and saved it to **req.session.redirectTo** to redirect back to the previous URL after successful authentication.


## RESTful Routes

Application of Representational State Transfer (REST)

**Campground Routes**

| Name          | Path                       | HTTP <br>Verb| Purpose                                                       | Mongoose Method               |
| --------------|:--------------------------:|:------------:|---------------------------------------------------------------|:-----------------------------:|
| Index         | `/campgrounds`             | GET          | List all the campgrounds                                      | Campground.find()             | 
| New           | `/campgrounds/new`         | GET          | Show a form to add a <br>new campground                       | N/A                           | 
| Create        | `/campgrounds`             | POST         | Create a new campground, <br>then redirect somewhere          | Campground.create()           |
| Show          | `/campgrounds`             | GET          | Show info about one <br>specific campground                   | Campground.findById()         |
| Edit          | `/campgrounds/:id/edit`    | GET          | Show edit form about one <br>specific campground              | Campground.findById()         |
| Update        | `/campgrounds/:id`         | PUT          | Update a particular campground, <br>then redirect somewhere   | Campground.findByIdAndUpdate()|
| Destroy       | `/campgrounds/:id`         | DELETE       | Delete a particular campground, <br>then redirect somewhere   | Campground.findByIdAndUpdate()|


## License

MIT
