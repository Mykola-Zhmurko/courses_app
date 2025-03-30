const exphbs = require("express-handlebars");
const express = require("express");
require('dotenv').config(); 
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");  
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const { default: helmet } = require("helmet");
const compression = require("compression");
const csrf = require("csurf"); 
const flash = require("connect-flash");

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.SECRET_KEY;


const app = express();

const hbs = exphbs.create({
  defaultLayout: "main", 
  extname: "hbs",
  helpers: require("./utils/hbs-helpers"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, 
  }
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views"); 

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGO_URI, 
})

app.use(express.static(path.join(__dirname, "public"))); 
app.use("/images",express.static(path.join(__dirname, "images")))

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware)
app.use(userMiddleware)


app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(errorHandler)
  


async function start() {
  try {
    await mongoose.connect(MONGO_URI); 
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
