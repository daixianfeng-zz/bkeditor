<?php
date_default_timezone_set('Asia/Chongqing');
$version = array(
	'min'=>'0.1.0',
	'core'=>'0.1.0',
	'plugin'=>'0.1.0',
);
$date = date("Y-m-d", time());
$compiler = 'D:\compiler\compiler.jar';
if( !is_file( $compiler ) ){
	exit('config.php: D:\compiler\compiler.jar not exist.');
}

$copyright="/**
 * BKEditor - WYSIWYG HTML Editor for Internet
 * Copyright (c) 2011, baike.com All rights reserved.
 * MIT Licensed.
 * Depends: jQuery1.44+
 * Date: $date
 * Version: $version
 *
 */
";