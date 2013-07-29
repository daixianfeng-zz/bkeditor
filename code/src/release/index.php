<?php
/**
 * 整合压缩工具
 * 将所有相关js源码和css文件进行整合和压缩，输出jqeditor-version.min.js
 * js的压缩使用google的compiler.jar工具，需要安装 java 运行环境，
 * 并且在命令行可执行java命令，
 * compiler.jar 所在默认目录 E:\compiler\compiler.jar
 */
set_time_limit(60);

define('BKEDITOR', dirname(dirname(__FILE__)) );

include 'common.php';
include 'config.php';

$source = '';

if( isset($_GET['source']) ){
	$source = $_GET['source'];
}

if(!$source){ $source = 'default'; }

//读取js文件
$script = read_file( file(BKEDITOR."/release/source_{$source}.txt") );

// 2011-07-21 css文件不再和js整合，因为css文件当中的背景图片路径问题
	//读取css文件，和js文件整合
	//$script .= format_css("../skins/content_default.css", 'styleContent');
	//$script .= format_css("../skins/skin_base.css", 'styleBase');

//定义临时文件，运行结束后会删除
$tmp_script_file = BKEDITOR."/release/bkeditor_tmp.js";

//将整合内容写入临时文件
file_put_contents($tmp_script_file, $script);

//定义输出文件
$out_script_file = BKEDITOR."/min/{$version['min']}/bkeditor-$source.min.js";

//构造压缩命令语句
$cmd = "java -jar $compiler --js=$tmp_script_file --js_output_file=$out_script_file";
//执行压缩命令
exec($cmd, $output);


//读取压缩后的内容
$script=file_get_contents($out_script_file);
if( empty($script) ){
//如果没有内容则表示出错
	echo $cmd;
	print_r($output);
	exit('error');
}

//添加copyright头后再写入到$out_script_file
file_put_contents($out_script_file, $copyright.$script);

//完毕
echo 'OK.<br />';

//如果compiler工具压缩过程有提示信息，则输出
if(!empty($output)){
	print_r($output);
}

//删除临时文件
unlink($tmp_script_file);
