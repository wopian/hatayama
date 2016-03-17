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
          <div class="right">
            <? include("partials/langSwitcher.php"); ?>
            <a class="grey-text text-lighten-4 waves-effect btn-flat" href="<?=langSwitcher('en')?>" >English</a>
            <a class="grey-text text-lighten-4 waves-effect btn-flat" href="<?=langSwitcher('ja')?>">Japanese</a>
          </div>
        </div>
      </div>

    </footer>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" type="text/javascript" data-no-instant></script>
    <script src="/assets/js/app.min.js" type="text/javascript" data-no-instant></script>
    <script type="text/javascript" data-no-instant>
      InstantClick.init();

      $('ul.tabs').tabs();
    </script>

  </body>
</html>