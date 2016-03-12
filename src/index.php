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
          <a href="#" data-activates="slide-out" class="button-collapse"><i class="material-icons">menu</i></a>
          <a href="/" class="brand-logo">ハタヤマ</a>
          <ul class="right hide-on-med-and-down">
            <li><a href="#"><? $L(">navNational") ?></a></li>
            <li><a href="#"><? $L(">navPrefectural") ?></a></li>
            <li><a href="#"><? $L(">navMunicipal") ?></a></li>
            <li><a href="#"><? $L(">navMilitary") ?></a></li>
          </ul>
        </div>

        <ul id="slide-out" class="side-nav">
          <li><a href="#"><? $L(">navNational") ?></a></li>
          <li><a href="#"><? $L(">navPrefectural") ?></a></li>
          <li><a href="#"><? $L(">navMunicipal") ?></a></li>
          <li><a href="#"><? $L(">navMilitary") ?></a></li>
        </ul>

      </nav>
    </header>

    <main class="container">

      <p class="flow-text">
        <? $L(">introduction") ?>
      </p>

      <div class="row">

        <div class="col s12 m6 l4">
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img class="activator" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Osaka_Prefecture.svg/1920px-Flag_of_Osaka_Prefecture.svg.png">
            </div>
            <div class="card-content">
              <span class="card-title activator grey-text text-darken-4"><? $L(">osaka") ?><i class="material-icons right">keyboard_arrow_up</i></span>
            </div>
            <div class="card-reveal">
              <span class="card-title grey-text text-darken-4"><? $L(">osaka") ?><i class="material-icons right">close</i></span>
              <p>Meaning of Ōsaka's flag:</p>
              <p>The blue stands for cleanness, freshness and intelligence and also represents the sky and sea due to Ōsaka City having both an airport and seaport. The blue also represents Ōsaka's nickname water city, due to having many rivers and facing two seas. The mon represents calabash, the symbol of Toyotomi Hideyoshi. Circles also mean the letter O.</p>
              <p><a href="#">More Information</a></p>
            </div>
          </div>
        </div>

      </div>

    </main>

    <footer class="page-footer">
      <div class="container">
        <div class="row">
          <div class="col 16 s12">
            <h5 class="white-text">Hatayama</h5>
            <p class="grey-text text-lighten-4">Hello world.</p>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <div class="container">
          Made with love by <a href="//github.com/wopian">wopian</a>
          <a class="grey-text text-lighten-4 right" href="/en">EN</a>&nbsp;
          <a class="grey-text text-lighten-4 right" href="/ja">JA</a>
        </div>
      </div>
    </footer>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" type="text/javascript" data-no-instant></script>
    <script src="/assets/js/app.min.js" type="text/javascript" data-no-instant></script>
    <script type="text/javascript" data-no-instant>InstantClick.init();</script>
    <script data-no-instant>
      // Initialize collapse button
      $(".button-collapse").sideNav();
    </script>

  </body>
</html>
