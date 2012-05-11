---
extends:
---
<?
if($_POST['message'] != "" && $_POST['mail'] != "")
{
  if(mail("julien+contact@danjou.info",
          "Contact JDI",
          "Last name: " . $_POST['lastname'] . "\n" .
          "First name: " . $_POST['firstname'] . "\n" .
          "Company: " . $_POST['company'] . "\n" .
          "Phone: " . $_POST['phone'] . "\n" .
          "Message:\n" . $_POST['message'],
          "From: " . $_POST['firstname'] . " " . $_POST['lastname'] . " <" . $_POST['mail'] . ">"))
     { echo "OK"; }
}
?>