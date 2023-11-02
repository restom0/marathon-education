<?php
require_once('pdo.php');
if (isset($_GET['action']) && $_GET['action'] != '') {
    switch ($_GET['action']) {
        case 'register':
            if (isset($_POST['email']) && isset($_POST['password'])) {
                $email = $_POST['email'];
                $password = $_POST['password'];
                $sql = "SELECT * FROM users WHERE email='" . $email . "'";
                $result = pdo_query($sql);
                $count = count($result);
                if ($count != 0) {
                    $data = ['check' => false, 'msg' => "Đã tồn tại email"];
                    header(("Content-type: application/json"));
                    echo json_encode($data);
                    exit();
                } else {
                    $password = password_hash($password,PASSWORD_BCRYPT,[10]);
                    $data = "INSERT INTO users(email,password) VALUES ('" . $email . "','" . $password . "')";
                    pdo_execute($data);
                    $data = ['check' => true];
                    header(("Content-type: application/json"));
                    echo json_encode($data);
                    exit();
                }
            } else {
                $data = ['check' => false, 'msg' => "Thiếu thông tin"];
                header(("Content-type: application/json"));
                echo json_encode($data);
                exit();
            }
            break;

        default:
            # code...
            break;
    }
}
// if (isset($_POST['username']) && isset($_POST['username']) != '') {
//     echo $_POST['username'];
// } else {
//     echo "Chưa có username";
// }
