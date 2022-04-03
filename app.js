const express = require('express');
const app = express();
const path = require('path');
const { db } = require('./DB');
const { db2 } = require('./DBusers');
const sessions = require('express-session')
const bcrypt = require('bcrypt')
const { checkAuth } = require('./src/midlewares/checkAuth')
app.use(express.urlencoded({ extended: true }));
const secretKey = 'qazswdblptsvhfedgsjusavj'
const saltRounds = 10
const hbs = require('hbs');
const { count } = require('console');
const res = require('express/lib/response');

app.use(express.static(path.join(__dirname, "public")))

app.use(sessions({
  name: app.get('cookieName'),
  secret: secretKey,
  resave: false, // Не сохранять сессию, если мы ее не изменим
  saveUninitialized: false, // не сохранять пустую сессию
  // store: new FileStore({ // выбираем в качестве хранилища файловую систему
  //   secret: secretKey,
  // }),
  cookie: { // настройки, необходимые для корректного работы cookie
    // secure: true,
    httpOnly: true, // не разрещаем модифицировать данную cookie через javascript
    maxAge: 86400 * 1e3, // устанавливаем время жизни cookie
  },
}))
app.set('cookieName', 'sid')
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'src', 'views', 'partials'));

app.use((req, res, next) => {

  const currentEmail = req.session?.user?.email

  if (currentEmail) {
    const currentUser = db2.users.find((user) => user.email === currentEmail)

    res.locals.name = currentUser.name
  }

  next()
})

/*
app.get('/secret', (req, res) => {
  const catsQuery = req.query.limit;
  res.render('secret.hbs', { kotiki: db.cats.slice(0, catsQuery) });
});

app.get('/secret', (req, res) => {
  const catsReverse = req.query.reverse;
  const newcats = db.cats.reverse();
  if (catsReverse == true) { res.render('secret.hbs', { kotiki: newcats }); }
});
// если надо включить лимит на посты - раскоментить
*/
app.get('/', (req, res) => {
  res.render('index.hbs',);
});

app.get('/auth/signup', (req, res) => {
  res.render('signUp');
});

app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const hashPass = await bcrypt.hash(password, saltRounds)

  db2.users.push({
    name,
    email,
    password: hashPass,
  });

  req.session.user = {
    email
  }

  res.redirect('/');
});

app.get('/auth/signin', (req, res) => {
  res.render('signin');
});

app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body;

  const currentUser = db2.users.find((user) => user.email === email);

  if (urrentUser) {
    if (await bcrypt.compare(password, currentUser.password)) {

      req.sesion.user = {
        email
      }
      return res.redirect('/');
    }
  }
  return res.redirect('/')
});

app.get("/insta", checkAuth, (req, res) => {
  res.render("insta")
})

app.post('/insta', (req, res) => {
  const dataFromForm = req.body;
  const currentUser = req.session.id
  dataFromForm.sidFromUser1 = currentUser
  db.cats.push(dataFromForm);
  // добавляем новый пост, имя юзера записываем в массив вместе с котиком
  res.redirect('/secret');
});

app.get('/auth/signout', (req, res) => {
  /*const sisFromUserCookie = req.cookies.sid
  
  delete sesions[sisFromUserCookie]
  
  res.clearCookie('sid')
  res.redirect('/')
  */

  req.session.destroy((err) => {
    if (err) return res.redirect('/')

    res.clearCookie(req.app.get('cookieName'))
    return res.redirect('/')
  })

})

app.get("/secret", checkAuth, (req, res) => {
  res.render('secret.hbs', { kotiki: db.cats });
})

/*
app.post("/secret", checkAuth, (req, res) => {
  const dataFromForm = req.body;
  const sidFromUser1 = req.session.user
  if (sidFromUser1 === db.cats.sidFromUser1) {
  db.cats.pop(dataFromForm);
  }
  else  res.send(403)
  res.redirect('/secret');
}) // попытка сделать кнопку удаления поста через кнопку отправки формы
*/

app.patch('/secret/:id', (req, res) => {
  const id = req.params.id
  //const { action } = req.body

  // const curentPost = db.cats.sidFromUser1.find((el) => db.cats.sidFromUser1 === id)
  const curentPostId = db.cats.findIndex((el) => el.sidFromUser1 === id)
  if (req.session.id === id) {

    db.cats.splice(curentPostId, 1)
  }

  else

    res.sendStatus(403)

})
app.listen(3000, () => {
  console.log('server start success');
});
