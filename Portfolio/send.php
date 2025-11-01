<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $to = "paveldoubravsky@seznam.cz"; // 👈 tvůj e-mail
    $from    = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST["message"]);

    $subject = "Nová zpráva z portfolia";
    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $message, $headers)) {
        $status = "success";
    } else {
        $status = "error";
    }
}
?>

<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <title>Odeslání zprávy</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="d-flex justify-content-center align-items-center vh-100">
  <div class="text-center">
    <?php if ($status === "success"): ?>
      <h2 class="text-success">✅ Děkuji! Zpráva byla úspěšně odeslána.</h2>
    <?php else: ?>
      <h2 class="text-danger">❌ Omlouvám se, ale nastala chyba při odesílání.</h2>
    <?php endif; ?>
    <a href="index.html" class="btn btn-primary mt-3">Zpět na hlavní stránku</a>
  </div>
</body>
</html>