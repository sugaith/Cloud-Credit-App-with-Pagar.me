<?php

/**
 * Created by PhpStorm.
 * User: suga
 * Date: 02-Jun-18
 * Time: 1:47 AM
 */
class DaoUsuarioXapps
{
    public $db;
    public $y;
    public $z;                  // the x coordinate of this Point.

    /*
     * use the x and y variables inherited from Point.php.
     */
    public function __construct($db)
    {
        $this->db = $db;
    }

    public function consultaTodos(){

        $sth = $this->db->prepare("SELECT * FROM usuario");
        $sth->execute();
        $todos = $sth->fetchAll();

        return $todos;
    }



    public function existeEmail($email)    {
        $sql = "SELECT count(id) as count FROM usuario WHERE email LIKE '{$email}'";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();
            list($result) = $sth->fetchAll();

            return $result['count'];
        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }
    }





    public function updateUsuario($user)
    {
        $sql = "UPDATE usuario SET   
                  nome = '{$user['nome']}', 
                  senha = '{$user['senha']}', 
                  email = '{$user['email']}',
                  age = '{$user['age']}',
                  countryOri = '{$user['countryOri']}',
                  gender = '{$user['gender']}',
                  country = '{$user['country']}',
                  city = '{$user['city']}',
                  salary = '{$user['salary']}',
                  addCashAllowance = '{$user['addCashAllowance']}',  
                  paymonth = '{$user['paymonth']}',  
                  avatar = '{$user['avatar']}',  
                  statuscad = '{$user['statuscad']}',  
                  linkedin_id = '{$user['linkedin_id']}',  
                  
                  WHERE id = {$user['id']}";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();

            return $user;


        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }
    }

    public function updateImgsUsuario($id, $avatar, $rg)    {
        $sql = "UPDATE usuario SET ";

        if ($avatar){
            $sql .= "avatar = '{$avatar}' ";
            if ($rg)
                $sql .= ", ";
        }
        if ($rg){
            $sql .= "rgImg = '{$rg}' ";
        }

        $sql .= "WHERE id = {$id}";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();

            $sth = $this->db->prepare("SELECT * FROM usuario WHERE id = {$id}");
            $sth->execute();
            list($user) = $sth->fetchAll();

            return $user;
        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }

    }



    public function negocioLoginFB($userInfo)
    {
        try {
            $sql = "SELECT * FROM usuario 
                 WHERE email LIKE  '{$userInfo['email']}' ";
//                 AND fbid LIKE $args['fbid']";
            $sth = $this->db->prepare($sql);
            $sth->execute();
            list($user) = $sth->fetchAll();

            if ($user){
                $user['fbid'] = $userInfo['fbid'];
                $user = $this->updateUsuario($user);
                $user['success'] = 'success';

                return $user;
            }else{
                $userInfo['senha'] = $userInfo['fbid'];
                $user = $this->cadastraPreUsuario($userInfo);
                $user['nome'] = $userInfo['name'];
                $user['fbid'] = $userInfo['fbid'];
                $user['statuscad'] = 0;

                $user = $this->updateUsuario($user);

                //AVATAR
                $dir = '/var/www/girorest/src/public/avatarImgs/';
                $filename = $user['id'] . '_avatar.jpg';
                copy($userInfo['picurl'], $dir . $filename);

                $user = $this->updateImgsUsuario($user['id'], $filename, null);

                $user['success'] = 'success';

//                $erro = [];
//                $erro['error'] = "warn";
//                $erro['msg'] = "Complete seu cadastro!";
                return $user;
            }
        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }
    }




    public function consultaUserid($id)
    {
        try {

            $sth = $this->db->prepare("SELECT * FROM usuario where id = '{$id}'");
            $sth->execute();
            list($todos) = $sth->fetchAll();

            return $todos;


        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = "<br>" . $e->getMessage();
            return $erro;
        }

    }

    public function cadastraPreUsuario($user)    {
        $sql = "INSERT INTO usuario (email, senha, nome, statuscad) 
                VALUES ( '{$user['email']}', '{$user['password']}', '{$user['name']}', 1 )";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $last_id = $this->db->lastInsertId();

            if ($last_id > 0){
                $retUser = $this->consultaUserid( $last_id );

                return $retUser;
            }else{
                $erro = [];
                $erro['error'] = "warn";
                $erro['msg'] = "Error on registering user";
                return $erro;
            }

        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }
    }

    public function updateUserInfo($user)
    {
        $sql = "UPDATE usuario SET                
                  age = '{$user['age']}',
                  countryOri = '{$user['countryOrigin']}',
                  gender = '{$user['gender']}',
                  country = '{$user['country']}',
                  city = '{$user['city']}',
                  salary = '{$user['salary']}',
                  addCashAllowance = '{$user['addCashAllowance']}',  
                  paymonth = '{$user['paymonth']}',
                  statuscad = 2                   
                  WHERE id = {$user['user']['id']}";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();

            return $this->consultaUserid( $user['user']['id'] );


        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }
    }

    public function cadastraUserFeelJob($data)
    {
        $sql = "INSERT INTO feel_job (user_id, level, datetime) 
                VALUES ( '{$data['user']['id']}', '{$data['selectedIndex']}', NOW())";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();

            return $this->consultaUserid( $data['user']['id'] );


        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }

    }

    public function cadastraSendNotes($data)
    {
        $sql = "UPDATE usuario SET send_notes = {$data['send']} WHERE id = {$data['user']['id']}";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();

            return $this->consultaUserid( $data['user']['id'] );


        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }

    }

    public function negocioLogin($args)
    {
        try {
            $sql = "SELECT * FROM usuario 
                 WHERE email LIKE  '{$args['email']}'
                 AND senha LIKE '{$args['senha']}'";

            $sth = $this->db->prepare($sql);

            $sth->execute();
            list($user) = $sth->fetchAll();

            if ($user){
                $user['success'] = 'success';
                return $user;
            }else{
                $erro = [];
                $erro['error'] = "warn";
                $erro['msg'] = "Usuário não existe";
                return $erro;
            }

        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }
    }



}