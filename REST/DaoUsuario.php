<?php

/**
 * Created by PhpStorm.
 * User: suga
 * Date: 02-Jun-18
 * Time: 1:47 AM
 */
class DaoUsuario
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


    public function existeUsuario($username)    {
        $sql = "SELECT count(id) as count FROM usuario WHERE usuario LIKE '{$username}'";

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

    public function cadastraPreUsuario($user)    {
        $sql = "INSERT INTO usuario (email, senha) 
                VALUES ( '{$user['email']}', '{$user['senha']}' )";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $last_id = $this->db->lastInsertId();

            $user['id'] = $last_id;
            return $user;


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
                  data_nasci = '{$user['datanasci']}', 
                  rg = '{$user['rg']}',
                  cpf = '{$user['cpf']}',
                  cep = '{$user['cep']}',
                  logradouro = '{$user['logradouro']}',
                  bairro = '{$user['bairro']}',
                  cidade = '{$user['cidade']}',
                  estado = '{$user['uf']}',
                  complemento = '{$user['complemento']}',  
                  statuscad = '{$user['statuscad']}',  
                  id_pagarme_contaBank_padrao = '{$user['id_pagarme_contaBank_padrao']}',  
                  id_pagarme_recebedor = '{$user['id_pagarme_recebedor']}',  
                  fbid = '{$user['fbid']}',  
                  googleid = '{$user['googleid']}'  
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

    public function insertCartao($user)
    {
        $sql = "SELECT count(*) as count FROM cartao 
             WHERE usuario_id = {$user['id']} AND numero LIKE '{$user['numCard']}' ";
        $sth = $this->db->prepare($sql);

        $sth->execute();
        list($count) = $sth->fetchAll();

        if ($count['count'] > 0){
            $erro = [];
            $erro['error'] = "warn";
            $erro['msg'] = "Cartão já cadastrado! " . $sql;
            return $erro;

        }


        $sql = "INSERT INTO cartao (usuario_id, numero, ccv, nome, vencimento, cpf, cep, complemento, bandeira) 
                VALUES ( '{$user['id']}', '{$user['numCard']}', '{$user['cvc']}',  '{$user['nome']}',
                 '{$user['expiry']}','{$user['cpf']}', '{$user['cep']}','{$user['complemento']}','{$user['type']}')";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $last_id = $this->db->lastInsertId();

            $sth = $this->db->prepare("SELECT * FROM usuario WHERE id = {$user['id']}");
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

    public function consultaCartoes($uid){
        $sth = $this->db->prepare("SELECT * FROM cartao WHERE usuario_id = {$uid}");
        $sth->execute();
        return $sth->fetchAll();
    }

    public function negocioLogin($args)
    {
        try {
            $sql = "SELECT * FROM usuario 
                 WHERE usuario LIKE  '{$args['email']}'
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

    public function negocioLoginGoogle($userInfo)
    {
        try {
            $sql = "SELECT * FROM usuario 
                 WHERE email LIKE  '{$userInfo['email']}' ";
//                 AND fbid LIKE $args['fbid']";
            $sth = $this->db->prepare($sql);
            $sth->execute();
            list($user) = $sth->fetchAll();

            if ($user){
                $user['googleid'] = $userInfo['googleid'];
                $user = $this->updateUsuario($user);
                $user['success'] = 'success';

                return $user;
            }else{
                $userInfo['senha'] = $userInfo['googleid'];
                $user = $this->cadastraPreUsuario($userInfo);
                $user['nome'] = $userInfo['name'];
                $user['googleid'] = $userInfo['googleid'];
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

    public function existeContaBanco($userid, $bank_code, $agencia, $conta, $conta_dv)
    {
        $sql = "SELECT count(id) as count FROM contabanco WHERE 
                  usuario_id = '{$userid}'
                  AND codigo_banco LIKE '{$bank_code}'
                  AND agencia LIKE '{$agencia}'
                  AND conta LIKE '{$conta}'
                  AND conta_dv LIKE '{$conta_dv}'
               ";

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

    public function cadastraContaBancaria($id, $curl_resp1)
    {
        $sql = "INSERT INTO contabanco (usuario_id, id_pagarme, nome_favorecido, cpf_favorecido, codigo_banco,
                  agencia, conta, conta_dv) 
                VALUES ( 
                '$id', '{$curl_resp1['id']}', '{$curl_resp1['legal_name']}','{$curl_resp1['document_number']}', '{$curl_resp1['bank_code']}',
                 '{$curl_resp1['agencia']}', '{$curl_resp1['conta']}', '{$curl_resp1['conta_dv']}'
                )";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $last_id = $this->db->lastInsertId();

            $user['id'] = $last_id;
            return $user;


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

    public function consultaBancos($uid)
    {
        $sth = $this->db->prepare("SELECT * FROM contabanco WHERE usuario_id = {$uid}");
        $sth->execute();
        return $sth->fetchAll();
    }

    public function insertTransacao($user)
    {
        $sql = "INSERT INTO transacoes (usuario_id, id_pagarme, data_transacao, status, valor) 
                VALUES ( '{$user['id']}', '{$user['id_pagarme']}', '{$user['data_transacao']}',  '{$user['status']}',
                 {$user['valor']} ) ";

        try {
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $last_id = $this->db->lastInsertId();

            return $last_id ;

        }catch(PDOException $e){
            $erro = [];
            $erro['error'] = "error";
            $erro['msg'] = $sql . "<br>" . $e->getMessage();
            return $erro;
        }


    }

    public function consultaTransacoes($uid)
    {
        $sth = $this->db->prepare("SELECT * FROM transacoes WHERE usuario_id = {$uid}");
        $sth->execute();
        return $sth->fetchAll();
    }


}