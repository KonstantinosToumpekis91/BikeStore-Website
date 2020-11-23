const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

const aboutContent =
  "Η ενασχόλησή μας με το ποδήλατο ξεκίνησε από τον αείμνηστο Βασίλειο Τουμπέκη ο οποίος από το 1945 ξεκινάει τις μεταφορές προΐόντων και πολιτών με μοτοποδήλατα. Τα μοτοποδήλατα εκείνη την εποχή αποτελούσαν και μέσα μεταφοράς των πολιτών. Ο Βασίλης Τουμπέκης πολύ γρήγορα ανοίγει ένα κατάστημα στην οδό Πατρών & Εθνικής Αντιστάσεως και ασχολείται με το εμπόριο και επισκευές ποδηλάτων και μοτοποδηλάτων, ενοικιάσεις και μεταφορές.Ο γιος του Γιώργος λάτρης του δικύκλου και του μηχανοκίνητου αθλητισμού γενικότερα, μαθαίνει και συνεχίζει το επάγγελμα του πατέρα του. Μεταφέρει το κατάστημα στον σημερινό χώρο, επί της Τάκη Πετροπούλου 5, και επεκτείνει τις δραστηριότητές του αντιπροσωπεύοντας νέες φίρμες ποδηλάτων και μοτό. Λάτρης του παλαιού, κλασικού ποδηλάτου και μοτοποδηλάτου  ο Γιώργος Β. Τουμπέκης ασχολείται με ιδαίτερη φροντίδα και αγάπη, με την αναπαλαίωση μοναδικών και σπάνιων κομματιών. Τα τελευταία χρόνια ένα νέο μέλος της οικογένειας Τουμπέκη έχει αναλάβει να συνεχίσει επάξια, για τρίτη γενιά, την οικογενειακή παράδοση.";

const serviceContent =
  "Στο κατάστημά μας, σας παρέχουμε όλες τις δυνατές υπηρεσίες επισκευής για το ποδήλατό σας, στις καλύτερες τιμές. Επίσης σε εμάς, θα βρείτε μεγάλη γκάμα ανταλλακτικων και αξεσουαρ θα χρειαστείτε. Τα πάντα φυσικά σε άριστη ποιότητα!";

const contactContent =
  "Μπορείτε να μας βρέιτε στο κατάστημά μας στην οδό Τάκη Πετροπούλου 5 στον Πύργο." +
  "Τηλέφωνο επικοινωνίας: 26210-34709";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/bikeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = {
  title: String,
  content: String,
};

const bikeSchema = {
  url: String,
  type: String,
  model: String,
  manufacturer: String,
  price: Number,
};

const Post = mongoose.model("Post", postSchema);
const Bike = mongoose.model("Bike", bikeSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/news", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("news", { posts: posts });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/service", function (req, res) {
  res.render("service", { serviceContent: serviceContent });
});

app.get("/products", function (req, res) {
  Bike.find({}, function (err, bikes) {
    res.render("products", { bikes: bikes });
  });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/news");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.listen(port, function () {
  console.log(`Your server is running on port ${port}`);
});
