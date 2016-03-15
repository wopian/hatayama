<?
  require_once("partials/header.php");

  if (isset($_GET['view'])) {
    $view = preg_replace('/[^-a-zA-Z0-9_]/', '', $_GET['view']);

    switch ($view) {
      case 'nation':
        // Goto Nation page
        echo "Nation";
        break;
      case 'prefecture':
        // Goto Prefecture page
        echo "Prefecture";
        break;
      case 'municipal':
        // Goto Municipal page
        echo "Municipal";
        break;
      case 'military':
        // Goto Municipal page
        echo "Military";
        break;
      case 'misc':
        // Goto Municipal page
        echo "Misc";
        break;
      default:
        // If this point has been reached, something is not right
        echo "Error: Invalid page.";
        break;
    }
  } else {
    require_once("views/dashboard.php");
  }

  require_once("partials/footer.php");
?>
