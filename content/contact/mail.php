<div class="hero-unit">
  <p>
<?
if($_POST['message'] != "" && $_POST['mail'] != "")
{
  mail("julien+contact@danjou.info",
       "Contact JDI",
       "Last name: " . $_POST['lastname'] . "\n" .
       "First name: " . $_POST['firstname'] . "\n" .
       "Company: " . $_POST['company'] . "\n" .
       "Phone: " . $_POST['phone'] . "\n" .
       "Message:\n" . $_POST['message'],
       "From: " . $_POST['firstname'] . " " . $_POST['lastname'] . " <" . $_POST['mail'] . ">");

  print "Your mail has been sent successfully! I'll get back to you in the next 48 hours.</p>";
}
else
{
  echo "<span class=\"alert-error\">Your mail hasn't been sent!</span></p>";
  echo "<a href=\"/contact\"><span class=\"btn btn-warning\">Return to contact form</span></a>";
}
?>

</div>
