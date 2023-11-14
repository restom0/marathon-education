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
                    $password = password_hash($password, PASSWORD_BCRYPT, [10]);
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
        case 'checkLogin':
            if (isset($_POST['email']) && $_POST['password']) {
                $email = $_POST['email'];
                $password = $_POST['password'];
                $sql = "SELECT * FROM users WHERE email='" . $email . "'";
                $result = pdo_query_one($sql);
                if ($result == false) {
                    $data = ["check" => false, "msg" => "Tài khoản không tồn tại"];
                    header("Content-type: application/json");
                    echo json_encode($data);
                    exit();
                } else {
                    $password = $result['password'];
                    $id = $result['id'];
                    $check = password_verify($_POST['password'], $password);
                    if ($check == true) {
                        $_SESSION['id'] = $id;
                        $_SESSION['username'] = $result['name'];
                        $data = ['check' => true];
                        header("Content-type: application/json");
                        echo json_encode($data);
                        exit();
                    } else {
                        $data = ["check" => false, "msg" => "Mật khẩu không đúng"];
                        header("Content-type: application/json");
                        echo json_encode($data);
                        exit();
                    }
                }
            }
        case 'submitmess':
            if (isset($_POST['mess']) && $_POST['mess'] !== '' && isset($_SESSION['id'])) {
                $mess = $_POST['mess'];
                $id = $_SESSION['id'];
                $sql = "SELECT  responsive from responses where questions like '%'" . $_POST['mess'] . "%'";
                $check = count(pdo_query($sql));
                if ($check == 0) {
                    $id = $_SESSION['id'];
                    $sql = "INSERT into chat_tbl(user_id, questions,bot_response) VALUES (" . $id . ",'" . $_POST['mess'] . "','Tôi không hiểu bạn đang hỏi gì'";
                    pdo_execute($sql);
                } else {
                    $response = pdo_query_value($sql);
                    $id = $_SESSION['id'];
                    $sql = "INSERT into chat_tbl(user_id, question,bot_response) VALUES (" . $id . ",'" . $_POST['mess'] . "','" . $response . "')";
                    pdo_execute($sql);
                }
                $sql = "SELECT question,bot_response,created_at from chat_tbl where user_id =" . $_SESSION['id'];
                $result = pdo_query($sql);
                $arr = [];
                foreach ($result as $key => $value) {
                    $item = [$value['question'], $value['bot_response'], $value['created_at']];
                    array_push($arr, $item);
                }
                $data = $arr;
                header("Content-type: application/json");
                echo json_encode($data);
                exit();
            }
            break;
        case 'submitmess':
            $sql = "SELECT question,bot_response,created_at from chat_tbl where user_id=" . $_SESSION['id'];
            $result = pdo_query(($sql));
            $arr = [];
            foreach ($result as $key => $value) {
                $item = [$value['question'], $value['bot_response'], $value['created_at']];
                array_push($arr, $item);
            }
            $data = $arr;
            header("Content-type: application/json");
            echo json_encode($data);
            exit();
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