<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"
    integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/dist/sweetalert2.all.min.js"></script>
</head>
<body>
    <form action="/marathon-education/course-3/lesson-1/controller.php" method="post">
        <input type="text" id="username" name="username">
        <button type="submit" id="submitbtbn">Thêm</button>
    </form>
    <script>
        $(document).ready(function (e){
            $('#submitbtbn').click(function (e){
                e.preventDefault();
                var username=$('$username').val().trim();
                if(username==''){
                    alert('Thiếu username');
                }
                else{
                    $.ajax({
                        type: "post",
                        url: "controller.php",
                        data: {
                            username:username
                        },
                        dataType: "JSON",
                        success: function (res) {
                            
                        }
                    });
                }
            })
        })
    </script>
</body>
</html>