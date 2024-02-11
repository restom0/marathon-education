<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="CodePel">
    <title> Neumorphism Login Form Example </title>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="./css/demo.css">
    <link rel="stylesheet" type="text/css" href="main.css">

    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"
        integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/dist/sweetalert2.all.min.js"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
</head>

<body>
    <main class="cd__main">
        <div class="main">
            <div class="container a-container" id="a-container">
                <form class="form" id="a-form" method="" action="">
                    @csrf
                    <h2 class="form_title title">Create Account</h2>
                    <div class="form__icons"><a href="{{ url('/auth/google') }}"><img class="form__icon"
                                src="/dashboard/assets/img/icons/brands/google.png"></a>
                        <img class="form__icon" src="/dashboard/assets/img/icons/brands/facebook.png">
                        <img class="form__icon" src="/dashboard/assets/img/icons/brands/twitter.png">
                    </div><span class="form__span">or use email for registration</span>
                    <input class="form__input" type="text" id="name" placeholder="Tên">
                    <input class="form__input" type="text" id="phone" placeholder="Số điện thoại">
                    <input class="form__input" type="text" id="email" placeholder="Email">
                    {{-- <input class="form__input" type="password" id="password" placeholder="Password">
                    <input class="form__input" type="password" id="password2" placeholder="Password2"> --}}
                    <button class="form__button button submit" type="submit" id="submitsignupbtn">SIGN UP</button>
                </form>
            </div>
            <div class="container b-container" id="b-container">
                <form class="form" id="b-form" method="" action="">
                    <h2 class="form_title title">Sign in to Website</h2>
                    <div class="form__icons"><a href="{{ url('/auth/google') }}"><img class="form__icon"
                                src="/dashboard/assets/img/icons/brands/google.png"></a>
                        <img class="form__icon" src="/dashboard/assets/img/icons/brands/facebook.png">
                        <img class="form__icon" src="/dashboard/assets/img/icons/brands/twitter.png">
                    </div><span class="form__span">or use your email account</span>
                    <input class="form__input" type="text" id="signinEmail" placeholder="Email">
                    <input class="form__input" type="password" id="signinPassword" placeholder="Password"><a
                        class="form__link">Forgot your
                        password?</a>
                    <button class="form__button button submit" id="submitSignInBtn">SIGN IN</button>
                </form>
            </div>
            <div class="switch" id="switch-cnt">
                <div class="switch__circle"></div>
                <div class="switch__circle switch__circle--t"></div>
                <div class="switch__container" id="switch-c1">
                    <h2 class="switch__title title">Welcome Back !</h2>
                    <p class="switch__description description">To keep connected with us please login with your personal
                        info</p>
                    <button class="switch__button button switch-btn">SIGN IN</button>
                </div>
                <div class="switch__container is-hidden" id="switch-c2">
                    <h2 class="switch__title title">Hello Friend !</h2>
                    <p class="switch__description description">Enter your personal details and start journey with us</p>
                    <button class="switch__button button switch-btn">SIGN UP</button>
                </div>
            </div>
        </div>
    </main>
    <footer class="cd__credit">Author: Ricardo Oliva Alonso - Distributed By: <a title="Free web design code & scripts"
            href="https://www.codepel.com?source=demo-page" target="_blank">CodePel</a></footer>
    <script src="./js/script.js"></script>
    <script>
        $(document).ready(function() {
            register();
            login();
        });

        function login() {
            $('#submitSignInBtn').click(function(e) {
                e.preventDefault();
                var email = $('#signinEmail').val().trim();
                var password = $('#signinPassword').val().trim();
                if (email == '') {
                    alert('Chưa nhập email');
                } else if (password == '') {
                    alert('Chưa nhập mật khẩu');
                } else {
                    $.ajax({
                        type: "post",
                        url: "/checkLogin",
                        data: {
                            email: email,
                            password: password
                        },
                        dataType: "JSON",
                        success: function(res) {
                            if (res.check == false) {
                                alert(res.msg);
                            } else {
                                alert('Đăng nhập thành công');
                                window.location.replace('/users');
                            }
                        }
                    });
                }
            });
        }

        function register() {
            $('#submitsignupbtn').click(function(e) {
                e.preventDefault();
                var name = $('#name').val().trim();
                var phone = $('#phone').val().trim();
                var email = $('#email').val().trim();
                // var password = $('#password').val().trim();
                // var password2 = $('#password2').val().trim();
                if (email == '') {
                    alert('Chưa nhập email');
                    // } else if (password == '' && password2 == '') {
                    //     alert('Chưa nhập 1 trong 2 mật khẩu');
                    // } else if (password != password2) {
                    //     alert('Hai mật khẩu không giống nhau')
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/user",
                        data: {
                            name: name,
                            phone: phone,
                            email: email,
                            // password: password,
                            idRole: 2

                        },
                        dataType: "JSON",
                        success: function(res) {
                            if (res.check == false) {
                                if (res.msg.name) {
                                    alert(res.msg.name);
                                } else if (res.msg.idRole) {
                                    alert(res.msg.idRole);
                                }
                            } else {
                                alert('Đăng ký thành công');
                            }
                        }
                    });
                }
            })
        }
    </script>
</body>

</html>
