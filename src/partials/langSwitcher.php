<?
  function langSwitcher ($buttonLang) {
    $url = $_SERVER['REQUEST_URI'];
    $urlPath = preg_replace('(/en/|/ja/)', '', $url);

    return '/' . $buttonLang . '/' . $urlPath;
  }