<?php
$lang = $_COOKIE["lang"] ? $_COOKIE["lang"] : $_SERVER['HTTP_ACCEPT_LANGUAGE'];

print_r($_COOKIE["lang"]);
print_r($lang);

switch ($lang) {
    case "id-ID":
        header("Location: /id/");
        break;
    default:
        header("Location: /en/");
        break;
}
