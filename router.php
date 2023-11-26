<?php
    $explode = explode("?", trim($_SERVER["REQUEST_URI"]));
    $url = $explode[0];

    if (preg_match('/\.(?:png|jpg|jpeg|gif|svg|js|css|map|woff|io|webp|webmanifest)/', $url)) {
		return false;
	} else {
        $files = explode(".php", $url);

        $explode = explode("/", $files[0]);

        if ($explode[sizeof($explode) - 1] == "") $url .= "index.php";
        else $url .= ".php";

        foreach ($_GET as $key => $value) {
            $_GET[$key] = $value;
        }
        foreach ($_POST as $key => $value) {
            $_POST[$key] = $value;
        }

		if (file_exists($_SERVER['DOCUMENT_ROOT'] . $url) == true)
            include $_SERVER['DOCUMENT_ROOT'] . $url;
		else {
            include $_SERVER['DOCUMENT_ROOT'] . "/";
		}
	}
?>