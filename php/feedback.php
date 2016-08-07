<?
$to ="tymchenko.anastasiia@gmail.com";
$subject = "бронировка столика";
$letter = "Новая бронировка столика:";

function sendMail($to,$subject,$letter){
	$name 	= $_POST["name"];
	$email 	= $_POST["email"];
	$message= $_POST["message"];
	$letter.= $name;
	$headers = "MIME-Version: 1.0\r\n
   Content-type: text/html; charset=utf-8\r\n 
   From: mysite.com <info@mysite.com>\r\n";
	$messages = array(
					"feedbackMessageOk" 		=> "Ваше собщение отправлено"
					,"feedbackMessageError" 	=> "Вы не заполнили поля формы"
				);
	
	$form_ok = $name && $email && $message;
	
	if($form_ok){
		mail($to, $subject, $letter, $headers);
		$currentMessage = $messages["feedbackMessageOk"];
	}
	else{
		$currentMessage = $messages["feedbackMessageError"];
	}
	
	print json_encode(array('feedbackMessage' => $currentMessage));
}

sendMail($to,$subject,$letter);
//print json_encode(array('test' => 'test1'));
?>