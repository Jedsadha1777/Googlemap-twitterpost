# Google Map Twitter Post

The Google Map Twitter Post give you showing location based Tweets.

##How to use?
###
- Browse to the /index.html put google put a Google API Key in this line 
```php
http://maps.googleapis.com/maps/api/js?key=YOU_API_KEY
```
- Browse to the /config/setting.php and put you twitter API Key 
```php
define('_oauth_access_token'  , ’TWITTER_ACCESS_TOKEN’);
define('_oauth_access_token_secret'    , ‘TWITTER_ACCESS_TOKEN_SECRET’);
define('_consumer_key'     , ‘CONSUMER_KEY’);
define('_consumer_secret'  , ‘CUNSUMER_SECRET’);
```
- Browse to the /common/js/map.js for config distance , template
```php
var tweets_distance = 50; 
var map_template = [];
```
