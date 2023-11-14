<?php
function goimail($email,$name,$password){ 
    require "PHPMailer/src/PHPMailer.php";  //nhúng thư viện vào để dùng, sửa lại đường dẫn cho đúng nếu bạn lưu vào chỗ khác
    require "PHPMailer/src/SMTP.php"; //nhúng thư viện vào để dùng
    require 'PHPMailer/src/Exception.php'; //nhúng thư viện vào để dùng
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);  //true: enables exceptions
      try {
            $mail->SMTPDebug = 0;  // 0,1,2: chế độ debug. khi mọi cấu hình đều tớt thì chỉnh lại 0 nhé
            $mail->isSMTP();  
            $mail->CharSet  = "utf-8";
            $mail->Host = 'smtp.gmail.com';  //SMTP servers
            $mail->SMTPAuth = true; // Enable authentication
            $nguoigui = 'trungthanh01233@gmail.com';
            $matkhau = 'vjiqefvvrualacit';
            $tennguoigui = 'Leo';
            $mail->Username = $nguoigui; // SMTP username
            $mail->Password = $matkhau;   // SMTP password
            $mail->SMTPSecure = 'ssl';  // encryption TLS/SSL 
            $mail->Port = 465;  // port to connect to                
            $mail->setFrom($nguoigui, $tennguoigui ); 
            $to = $email;
            $to_name = $name;
            
            $mail->addAddress($to, $to_name); //mail và tên người nhận  
            $mail->isHTML(true);  // Set email format to HTML
            $mail->Subject = 'Gửi thư từ php';      
            $noidungthu = '
                <div style="width:600px;font-family: "Times New Roman", Times, serif; padding: 20px 20px; border-radius: 7px; border: 1px solid black;">
                <h4 style="font-size: 28px;text-align: center;color: blue;">Đăng ký tài khoản thành công</h4>
                <p style="font-size: 22px;text-align: center;">Tên tài khoản : '.$name.' </p>
                <p style="font-size: 22px;text-align: center;">Mật khẩu  : '.$password.'</p>
                </div>
            ';
            $mail->Body = $noidungthu;

            // Rules
            $mail->smtpConnect( array(
                "ssl" => array(
                    "verify_peer" => false,
                    "verify_peer_name" => false,
                    "allow_self_signed" => true
                )
            ));
            $mail->send();
      } catch (Exception $e) {
          echo 'Mail không gửi được. Lỗi: ', $mail->ErrorInfo;
      }
}

?>