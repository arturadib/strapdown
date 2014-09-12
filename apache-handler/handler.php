<?php header('Content-type: text/html; charset=utf-8'); ?>
<!DOCTYPE html>
<html>
<head>
	</script>
	<meta name="content-type" http-equiv="content-type" value="text/html; utf-8"/>
	<?php echo "<title>", basename(realpath($_SERVER['PATH_TRANSLATED'])), "</title>"; ?>
</head>
<body>
	<textarea theme="lumen" style="display: none;">
<?php
	$legalExtensions = array('sd', 'strapdown', 'sdown');
	$file = realpath($_SERVER['PATH_TRANSLATED']);
	if($file && in_array(strtolower(substr($file, strrpos($file, '.') + 1)), $legalExtensions)) 
	{
		echo file_get_contents($file);
	} else {
		echo "<p>Bad filename given</p>";
	}
?>
	</textarea>
	<script type="text/javascript" src="/strapdown/strapdown.js"></script>
</body>
</html>
