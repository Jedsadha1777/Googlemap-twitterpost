<?php

$data = file_get_contents('http://www.765space.com/twitter/process/feed_twitter.php?inp_geocode='.$_REQUEST[inp_geocode]);
echo $data;

?>
