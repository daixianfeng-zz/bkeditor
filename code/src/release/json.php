<?php
$config = array(
	'default' => array(
		'in'=>'../skin/default/toolbar.html',
		'out'=>'../skin/default/toolbar.json',
	),
	'base' => array(
		'in'=>'../skin/default/toolbar_base.html',
		'out'=>'../skin/default/toolbar_base.json',
	)
);
$dialog = array(
	'imagedialog' => array(
		'in'=>'../core/ui/image/image.dialog.html',
		'out'=>'../core/ui/image/image.dialog.json',
	),
	'searchdialog' => array(
		'in'=>'../core/ui/search/search.dialog.html',
		'out'=>'../core/ui/search/search.dialog.json',
	),
	'tabledialog' => array(
		'in'=>'../core/ui/table/table.dialog.html',
		'out'=>'../core/ui/table/table.dialog.json',
	)
);

foreach($config as $theme){
	$html = file_get_contents($theme['in']);
	$html = str_replace(array("\r\n", "\t"), "", $html);
	$html_json = json_encode($html);
	
	//$html_js = '(function(E){';
	//$html_js .= 'E.tool ='.$html_json;
	//$html_js .= '})(jQuery.jQEditor);';
	
	file_put_contents($theme['out'],$html_json);
}
foreach($dialog as $key=>$ui){
	$html = file_get_contents($ui['in']);
	$html = str_replace(array("\r\n", "\t"), "", $html);
	$html_json = json_encode($html);
	
	$html_js = '(function(E){';
	$html_js .= 'E.dialogHtml["'.$key.'"] ='.$html_json;
	$html_js .= '})(jQuery.jQEditor);';
	
	file_put_contents($ui['out'],$html_js);
}
echo 'ok';
