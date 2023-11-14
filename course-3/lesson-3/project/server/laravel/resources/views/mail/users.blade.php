<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <div
        style="width:600px;font-family: Times New Roman, Times, serif; padding: 20px 20px; border-radius: 7px; border:
        1px solid black;">
        <h4 style="font-size: 28px;text-align: center;color: blue;">Đăng ký tài khoản thành công</h4>
        <p style="font-size: 22px;text-align: center;">Tên tài khoản: {{ $mailData['name'] }} </p>
        <p style="font-size: 22px;text-align: center;">Mật khẩu : {{ $mailData['password'] }}</p>
    </div>
</body>

</html>
