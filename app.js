const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
let PORT = process.env.PORT || 4000;
const app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', (req, res, error) => {
  const items = []
  axios.get('https://www.behance.net/galleries/xd')
    .then((response) => {
      const $ = cheerio.load(response.data);
      const bodyEl = $('.qa-grid-item')

      bodyEl.each((index, element) => {
        let $this = $(element);
        let $src = $this.find('img').attr('src');
        let $link = $this.find('.js-project-link').attr('href');
        let $userImage = $this.find('.OwnersNeue-ownerImage-2kF').find('img').attr('src');
        let $name = $this.find('.OwnersNeue-ownerImage-2kF').next().text();
        let $likes = $this.find('.Stats-stats-1iI').find('span').eq(0).text();
        let $views = $this.find('.Stats-stats-1iI').find('span').eq(1).text();

        let post = {
          preview_image: $src,
          href: $link,
          user_image: $userImage,
          author_name: $name.length >= 1 ? $name : "Multiple Owners",
          likes: $likes,
          views: $views
        }

        items.push(post);

      })
      res.json(items)
    })
    .catch((error) => {
      console.log('error')
    })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))