<?
  session_start();

  if (isset($_GET['language'])) {
    $lang = $_GET['language'];

    // Register the session and set the cookie
    $_SESSION['language'] = $lang;
    setcookie('language', $lang, time() + (3600 * 24 * 30));
  } else if (isset($_SESSION['language'])) {
    $lang = $_SESSION['language'];
  } else if ($_GET['language'] !== ('en' || 'ja')) {
    $lang = 'en';
  }

  include_once "languages/$lang.php";