<?php
ini_set('display_errors', 0);
include('../config/setting.php');
include('../class/TwitterAPIExchange.php');



/** Set access tokens **/
$settings = array(
    'oauth_access_token' => _oauth_access_token,
    'oauth_access_token_secret' => _oauth_access_token_secret,
    'consumer_key' => _consumer_key,
    'consumer_secret' => _consumer_secret
);

$geocode = trim($_REQUEST[inp_geocode]);

$distance = $_REQUEST[distance];

if (($distance == '') || ($distance == 0)){
	$distance = 50;
}

$limit_feed = 300;

$geocode = html_entity_decode($geocode);
$geocode = str_replace(' ','',$geocode);


/** Perform a GET request and echo the response **/

$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?geocode='.$geocode.','.$distance.'km&count='.$limit_feed; //&q=River
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
$data = $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();
			 
echo $data; 