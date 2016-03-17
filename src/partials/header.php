<?
  include("classes/lang.php");
  $L = new LangQuery();
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Hatayama</title>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Hatayama">
    <meta name="author" content="James Harris">

    <link href="/assets/css/styles.min.css" rel="stylesheet" type="text/css" media="screen,projection">
  </head>

  <body>

    <header class="navbar-fixed">
      <nav>
        <div class="container nav-wrapper">
          <a href="/" class="brand-logo">ハタヤマ</a>
          <ul class="right hide-on-med-and-down">
            <li><a class="waves-effect waves-block" href="#"><? $L(">navNational") ?></a></li>
            <li><a class="waves-effect waves-block" href="#"><? $L(">navPrefectural") ?></a></li>
            <li><a class="waves-effect waves-block" href="#"><? $L(">navMunicipal") ?></a></li>
            <li><a class="waves-effect waves-block" href="#"><? $L(">navMilitary") ?></a></li>
          </ul>
        </div>
        <ul class="tabs hide-on-large-only">
          <li class="tab waves-effect waves-block"><a href="#"><? $L(">navNational") ?></a></li>
          <li class="tab waves-effect waves-block"><a href="#"><? $L(">navPrefectural") ?></a></li>
          <li class="tab waves-effect waves-block"><a href="#"><? $L(">navMunicipal") ?></a></li>
          <li class="tab waves-effect waves-block"><a href="#"><? $L(">navMilitary") ?></a></li>
        </ul>
      </nav>
    </header>

    <main class="container">