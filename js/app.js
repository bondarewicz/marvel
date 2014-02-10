App = Ember.Application.create({});

var api_key = "2e14a11f2b56be7a8aba0882c8c0a5f8";

/*var posts = [{
  id: '1',
  title: "Rails is Omakase",
  author: { name: "d2h" },
  date: new Date('12-27-2012'),
  excerpt: "There are lots of à la carte software environments in this world. Places where in order to eat, you must first carefully look over the menu of options to order exactly what you want.",
  body: "I want this for my ORM, I want that for my template language, and let's finish it off with this routing library. Of course, you're going to have to know what you want, and you'll rarely have your horizon expanded if you always order the same thing, but there it is. It's a very popular way of consuming software.\n\nRails is not that. Rails is omakase."
}, {
  id: '2',
  title: "The Parley Letter",
  author: { name: "d2h" },
  date: new Date('12-24-2012'),
  excerpt: "My [appearance on the Ruby Rogues podcast](http://rubyrogues.com/056-rr-david-heinemeier-hansson/) recently came up for discussion again on the private Parley mailing list.",
  body: "A long list of topics were raised and I took a time to ramble at large about all of them at once. Apologies for not taking the time to be more succinct, but at least each topic has a header so you can skip stuff you don't care about.\n\n### Maintainability\n\nIt's simply not true to say that I don't care about maintainability. I still work on the oldest Rails app in the world."  
}];*/

App.Router.map(function() {
  this.resource('about');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' });
  });
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return jQuery.getJSON("http://gateway.marvel.com:80/v1/public/characters?apikey="+api_key).then(function(data) {
      
      //alert(data.data.results);

      return data.data.results.map(function(post) {


        console.log(data.data.results);
        //if data comes in diffferent firm than expected do mapping here
        post.body = post.name;
        post.id = post.id;
        post.title = post.name;
        post.date = post.modified
        post.image = post.thumbnail.path+'/standard_small.'+post.thumbnail.extension;

        return post;
      });
    });
  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
    //return posts.findBy('id', params.post_id);
    //
    return jQuery.getJSON("http://gateway.marvel.com:80/v1/public/characters/"+params.post_id+"?apikey="+api_key).then(function(data) {
      
        console.log('PostRoute', data.data.results[0]);
        //if data comes in diffferent firm than expected do mapping here
        data.body = data.data.results[0].description;
        data.id = data.data.results[0].id;
        data.title = data.data.results[0].name;
        data.date = data.data.results[0].modified;
        data.image = data.data.results[0].thumbnail.path+'/landscape_incredible.'+data.data.results[0].thumbnail.extension;
        data.excerpt = '';

        posts = [];
        posts = data;

        return data;
      
    });

  }
});

App.PostController = Ember.ObjectController.extend({
  isEditing: false,

  edit: function() {
    this.set('isEditing', true);
  },

  doneEditing: function() {
    this.set('isEditing', false);
    this.get('store').commit();
  }
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});
