<? include("classes/lang.php"); ?>
<!DOCTYPE html>
<html>
  <head>
    <title>Hatayama</title>

    <meta charset="UTF-8">
    <meta name="theme-color" content="#3949ab">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Hatayama">
    <meta name="author" content="James Harris">

    <link href="/assets/css/styles.min.css" rel="stylesheet" type="text/css" media="screen,projection">
  </head>

  <body>

    <header class="navbar-fixed">
      <nav>
        <div class="container nav-wrapper">
          <a href="/<?=$lang?>/" class="brand-logo">ハタヤマ</a>
          <ul class="right hide-on-med-and-down">
            <li><a class="waves-effect waves-block" href="#"><?= NAV_NATION ?></a></li>
            <li><a class="waves-effect waves-block" href="#"><?= NAV_PREFECTURE ?></a></li>
            <li><a class="waves-effect waves-block" href="#"><?= NAV_MUNICIPAL ?></a></li>
            <li><a class="waves-effect waves-block" href="#"><?= NAV_MILITARY ?></a></li>
            <li><a class="waves-effect waves-block" href="#"><?= NAV_MISC ?></a></li>
          </ul>
        </div>
        <ul class="tabs hide-on-large-only">
          <li class="tab waves-effect waves-block">
            <a class="hide-on-small-only" href="#"><?= NAV_NATION ?></a>
            <a class="hide-on-med-and-up" href="#"><?= NAV_NATION_ABBR ?></a>
          </li>
          <li class="tab waves-effect waves-block">
            <a class="hide-on-small-only" href="#"><?= NAV_PREFECTURE ?></a>
            <a class="hide-on-med-and-up" href="#"><?= NAV_PREFECTURE_ABBR ?></a>
          </li>
          <li class="tab waves-effect waves-block">
            <a class="hide-on-small-only" href="#"><?= NAV_MUNICIPAL ?></a>
            <a class="hide-on-med-and-up" href="#"><?= NAV_MUNICIPAL_ABBR ?></a>
          </li>
          <li class="tab waves-effect waves-block">
            <a class="hide-on-small-only" href="#"><?= NAV_MILITARY ?></a>
            <a class="hide-on-med-and-up" href="#"><?= NAV_MILITARY_ABBR ?></a>
          </li>
          <li class="tab waves-effect waves-block">
            <a class="hide-on-small-only" href="#"><?= NAV_MISC ?></a>
            <a class="hide-on-med-and-up" href="#"><?= NAV_MISC_ABBR ?></a>
          </li>
        </ul>
      </nav>
    </header>

    <main class="container">
