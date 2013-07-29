<?php
/**
 * 格式化CSS文件，去掉CSS文件内容当中的空格
 */
function format_css($inFile, $name){
	$style = file_get_contents($inFile);
	$style = preg_replace("/\s*([{;:])\s*/",'$1',$style);
	$style = preg_replace("/\s+\}/","}",$style);
	$style = preg_replace("/\}\s+/","}\n",$style);
	
	$style = preg_replace("/ +/",' ',$style);
	$style = preg_replace("/;\}/",'}',$style);
	
	$style_list=explode("\n", $style);
	$style_json=json_encode($style_list);
	
	return "\n(function(E){E.$name=$style_json;})(jQEditor);";
}

/**
 * 读取文件内容
 * @param string|array $file|$file_list
 *		文件名或文件名数组
 * @return string
 */
function read_file($file){
	if(is_string($file) && is_file($file)){
	//读取一个文件
		return file_get_contents($file);
	}else if(is_array($file)){
	//读取一个文件数组，将所有内容连在一起返回
		$s='';
		foreach($file as $f){
			$f = trim($f);
			if( is_file($f)){
				$s .= file_get_contents($f);
			}else if($f){
				echo "$f<br>";
			}
		}
		
		return $s;
	}else{
	//其他返回错误
		return 0;
	}
}