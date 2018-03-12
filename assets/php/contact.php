<?php

	if ($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$name = strip_tags(trim($_POST["f_name"]));
		$name = str_replace(array("\r", "\n",), array(" ", " "), $name);
		$email = filter_var(trim($_POST["f_email"]), FILTER_SANITIZE_EMAIL);
		$message = trim($_POST["f_message"]);	
		if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL))
		{
			http_response_code(400);
			echo "There was a problem with your submission. Please try again.";
			exit;
		}
		$recipient = "hello@adamfranco.ca";
		$subject = "New message from $name via contact form submission.";
		$email_content = "NAME: $name\n";
		$email_content .= "EMAIL: $email\n\n";
		$email_content .= "MESSAGE:\n$message\n";
		$headers = "From: $name <$email>";
		if (mail($recipient, $subject, $email_content, $headers))
		{
			http_response_code(200);
			echo "Thank you for your message! If you need to send another, refresh the page.";
		}
		else
		{
			http_response_code(500);
			echo "Something went wrong and your message could not be sent.";
		}
	}
	else
	{
		http_response_code(403);
		echo "There was a problem with your submission. Please try again.";
	}

?>