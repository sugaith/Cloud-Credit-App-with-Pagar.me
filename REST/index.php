<?php
//objetos de response e request
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
//use \Psr\Http\Message\UploadedFileInterface as UploadedFile;

//require '../vendor/pagarme/pagarme-php/lib/Pagarme.php';

//auto load do Slim.. obrigatorio
require '../vendor/autoload.php';
//use Slim\Http\UploadedFile;
//require '../vendor/slim/slim/Slim/Http/UploadedFile.php';

require 'DaoUsuario.php';
require 'DaoUsuarioXapps.php';
require 'Uteis.php';
//esta flag é para desenvolvimento, em produção voce vmai querer deixar todas em false, para que
// nao fique aparecendo erros e avisos aos usuarios finals e para que o tamanho do header nao seja divulgado
$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

//dados de conexao do banco de dados PARA GIRO
$config['db']['host']   = 'localhost';
$config['db']['user']   = 'thiago';
$config['db']['pass']   = 'thiago123.';
$config['db']['dbname'] = 'girodb';

//PARA XAPPS
//$config['db']['host']   = 'localhost';
//$config['db']['user']   = 'xapps';
//$config['db']['pass']   = 'xapps';
//$config['db']['dbname'] = 'xapps';

#$app = new \Slim\App; //use esta linha caso nao precise fas configuracoes
$app = new \Slim\App(['settings' => $config]);


//Container para instanciamento das classes. Todas as classes adicionadas e instanciadas no container
// sao acessiveis atravez de this->
$container = $app->getContainer();

//$container['avatar_dir'] = __DIR__ . '/avatarImgs';
$container['avatar_dir'] = '/var/www/girorest/src/public/avatarImgs';


//CHAVES DO PAGARME
$container['pagarme_prod'] = 'ak_live_ziZ8rx6kvDtbeedxRAJtA9Yyc5sAZk';
$container['pagarme_prod_crip'] = 'ek_live_MVoijflgvJcm7Nz2RHiyoCwuvogLqo';
$container['pagarme_teste'] = 'ak_test_ED7pkGAn73iTqzsEUAQxNK5J5GfFg6';
$container['pagarme_teste_crip'] = 'ek_test_b7DwzjOUXMWGXZq2A3qqBGd0vQxjDt';


$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};


//Abaixo são as rotas.. para mais info veja documentacao do SLIM..
//É aqui que vem a vantagem do SLIM!!



//GET - OLÁ MUNDO
$app->get('/{name}/', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("OLÁ, $name");

    return $response;
});


//GET try  bd class
$app->get('/consulta', function (Request $request, Response $response) {

//    $sth = $this->db->prepare("SELECT * FROM usuario");
//    $sth->execute();
//    $todos = $sth->fetchAll();
//    $response->withJson($todos);
//    $response->getBody()->write($todos);
//
    $db = new DaoUsuario($this->db);

    return $response->withJson($db->consultaTodos());
});

//GET - NEGOCIO LOGIN FACEBOOK
$app->post('/loginFB/', function (Request $request, Response $response, array $args) {
    $db = new DaoUsuario($this->db);
//    $response->getBody()->write("OLÁ, $name");
//    return $response;

    return $response->withJson($db->negocioLoginFB(  $request->getParsedBody() ));
});

//GET - NEGOCIO LOGIN GOOGLE
$app->post('/loginGoogle/', function (Request $request, Response $response, array $args) {
    $db = new DaoUsuario($this->db);
//    $response->getBody()->write("OLÁ, $name");
//    return $response;

    return $response->withJson($db->negocioLoginGoogle(  $request->getParsedBody() ));
});

//GET - NEGOCIO LOGIN
$app->get('/login/{usuario}/{senha}/', function (Request $request, Response $response, array $args) {
    $db = new DaoUsuario($this->db);
//    $response->getBody()->write("OLÁ, $name");
//    return $response;

    return $response->withJson($db->negocioLogin($args));
});

//GET - CONSULTA TODOS OS CARTOES DE ALGUEM USUARIO
$app->get('/select/cartoes/{uid}', function (Request $request, Response $response, array $args) {
    $db = new DaoUsuario($this->db);
//    $response->getBody()->write("OLÁ, $name");
//    return $response;

    return $response->withJson($db->consultaCartoes($args['uid']));
});

    //GET - CONSULTA TODOS OS BANCOS DE ALGUEM USUARIO
$app->get('/select/bancos/{uid}', function (Request $request, Response $response, array $args) {
    $db = new DaoUsuario($this->db);
//    $response->getBody()->write("OLÁ, $name");
//    return $response;

    return $response->withJson($db->consultaBancos($args['uid']));
});

//GET - CONSULTA TODOS OS TRANSACOES DE ALGUEM USUARIO
$app->get('/select/transacoes/{uid}', function (Request $request, Response $response, array $args) {
    $db = new DaoUsuario($this->db);
//    $response->getBody()->write("OLÁ, $name");
//    return $response;

    return $response->withJson($db->consultaTransacoes($args['uid']));
});


/*
 *
 * ROTAS PARA PAGARME
 *
 */

//CADASTRA BANKS ACCOUNTS...
$app->post('/pagarme/insert/bank_accounts/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];
    $db = new DaoUsuario($this->db);
    //dados do user
    $user['id'] = filter_var($data['user']['id'], FILTER_SANITIZE_NUMBER_INT);

    //dados do bank
//    bank_code: '341', //itau
//            agencia: '8294',
//            agencia_dv: '',
//            conta: "04436",
//            conta_dv: "0",
//            legal_name: "THIAGO CORREA LIMA DA SILVA",
//            document_number: "04809304906",
//            type: 'conta_corrente'

    //CONFERE SE CONTA BANCO JA FOI INSERIDA
    //SE FOI, RETORNA AVISO QUE JA FOI INSERIDO
    $count = $db->existeContaBanco($user['id'], $data['bank_code'], $data['agencia'],$data['conta'], $data['conta_dv'] );
//    return $response->withJson($count);

    if (intval($count ) > 0){
        $erro['error'] = "warn";
        $erro['msg'] = "Conta bancária já cadastrada";
        return $response->withJson($erro);
    }

    //SE NAO FOI, INSERE NO PAGARME E SALVA AQUI
    $params=['api_key'=> $this->get('pagarme_prod'),
        'bank_code'=>$data['bank_code'],
        'agencia'=>$data['agencia'],
        'agencia_dv'=>$data['agencia_dv'],
        'conta'=>$data['conta'],
        'conta_dv'=>$data['conta_dv'],
        'legal_name'=>$data['legal_name'],
        'document_number'=>$data['cpf'],
        'type'=>$data['type'],

    ];
//    return $response->withJson($params);
    $payload = json_encode( $params );

    //cadastrar a conta
    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, "https://api.pagar.me/1/bank_accounts" );
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json') );
    curl_setopt( $ch, CURLOPT_POST, $payload );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    //FAZ A TRANSACAO!!!!
    $curl_resp1 = curl_exec($ch);
    curl_close($ch);
//    return $response->withJson(json_decode($curl_resp1, true));
//    return $response->getBody()->write($curl_resp1, true);

    //SALVA RETORNO DO PAGARME NO BANCO LOCAL
    $curl_resp1 = json_decode($curl_resp1, true);
    if ($curl_resp1['object'] === 'bank_account'){
        $ret_cadconta = $db->cadastraContaBancaria($user['id'], $curl_resp1);
//        return $response->withJson($ret_cadconta);

        if (intval($ret_cadconta['id']) < 1){//ERRO AO CADASTRAR
            $erro['error'] = "warn";
            $erro['msg'] = "Erro ao cadastrar conta bancaria:" . $ret_cadconta['msg'];
            return $response->withJson($erro);
        }
    }else{
        $erro['error'] = "warn";
        $erro['msg'] = "Erro ao inserir conta no pagarme. Dados incompletos.";
         return $response->withJson($erro);
    }
    //////conferir se usuario ja eh recebedor
    $user_aux = $db->consultaUserid($user['id']);
//    return $response->withJson($user_aux);

    //////SE AINDA NAO ESTAS CADASTRADO COMO RECEBEDOR, CADASTRA E SALVA O ID NO USUARIO
    if ($user_aux['id_pagarme_recebedor'] == null){

        $params=['api_key'=>$this->get('pagarme_prod'),
            'anticipatable_volume_percentage'=>'0',
            'automatic_anticipation_enabled'=>'false',
            'bank_account_id'=>$curl_resp1['id'],
//            'transfer_day'=>$data['conta'],
            'transfer_enabled'=>'true',
//            'transfer_interval'=>$data['legal_name'],
//            'postback_url'=>'http://ec2-54-171-202-42.eu-west-1.compute.amazonaws.com/pagarme/insert/postback/recebedor/',
        ];
//    return $response->withJson($params);
        $payload = json_encode( $params );

        //CADASTRA RECEBEDOR
        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, "https://api.pagar.me/1/recipients" );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json') );
        curl_setopt( $ch, CURLOPT_POST, $payload );
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
        $curl_resp2 = curl_exec($ch);
        curl_close($ch);
//        return $response->withJson(json_decode($curl_resp2, true));


        //SALVA id do recebedor na tabela usuario
        $curl_resp2 = json_decode($curl_resp2, true);
        if ($curl_resp2['object'] === 'recipient'){
            $user_aux['id_pagarme_recebedor'] = $curl_resp2['id'];
            $user_aux = $db->updateUsuario($user_aux);
//            return $response->withJson($user_aux);
        }else{
            $erro['error'] = "warn";
            $erro['msg'] = "Erro ao inserir conta. Complete seus dados..";
            return $response->withJson($erro);
        }
    }
    //////atualiza a conta bnancaria padrao
    $user_aux['id_pagarme_contaBank_padrao'] = $curl_resp1['id'];
    $user_aux = $db->updateUsuario($user_aux);
    return $response->withJson($user_aux);

//    $response->getBody()->write($curl_resp);
});

//COBRA CARTAO CHECKOUT...
$app->post('/pagarme/cobraCartao/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];


    $db = new DaoUsuario($this->db);
    //dados do user
    //$user['id'] = filter_var($data['user']['id'], FILTER_SANITIZE_NUMBER_INT);
//    $user['cep'] = $data['cep'];
//    $user['complemento'] = filter_var($data['complemento'], FILTER_SANITIZE_STRING);
    $user['nome'] = filter_var($data['nome'], FILTER_SANITIZE_STRING);
//    $user['nome'] = 'Thiago c l da silva';
    //cartao
//    $user['numCard'] = $data['cardForm']['values']['number'];
//    $user['expiry'] = $data['cardForm']['values']['expiry'];
//    $user['cvc'] = $data['cardForm']['values']['cvc'];
//    $user['type'] = $data['cardForm']['values']['type'];
    $user['card_hash'] = $data['card_hash'];

    //production: ak_live_ziZ8rx6kvDtbeedxRAJtA9Yyc5sAZk
    //teste: ak_test_ED7pkGAn73iTqzsEUAQxNK5J5GfFg6
    $params=['api_key'=>$this->get('pagarme_prod'), 'card_hash'=>$user['card_hash'],
        'amount'=>$data['amount']*100, //======>>>>>>>> EM CENTAVOS!!!!!!  ++==³¤€¼ CUIDADO!!!!!!!!!!
//        'amount'=>100,
        "customer" => array(
            "external_id" => $data['user']['id'],
            "name" => $data['nome'],
            "document_number" => $data['cpf'],
            "email" => $data['user']['email'],
            "address" => array(
                "street" => $data['user']['logradouro'],
                "street_number" => $data['user']['complemento'],
                "neighborhood" => $data['user']['bairro'],
                "zipcode" => $data['user']['cep']
            ),
            "phone" => array(
//                "number" => $data['user']['logradouro'],
//                "ddd" => $data['user']['complemento']
                "number" => '99343541',
                "ddd" => '045'
            )
        ),
        "split_rules" => array(
            array(//do recebedor padrao (cloud)
//                "recipient_id" => "re_cj5pqv4er017bks6dgvm2o2aw", //para teste
                "recipient_id" => "re_cizu72m6z00y80t5xp0ikaog1", //para producao
                "percentage" => "13",
                "liable" => true,
                "charge_processing_fee" => true
            ),
            array(//do usuaro
                "recipient_id"=> $data['user']['id_pagarme_recebedor'],
                "percentage" => "87",
                "liable" => true,
                "charge_processing_fee" => true
            )
        )
    ];

//    return $response->withJson($params);
    $payload = json_encode( $params );


//    http_build_query_for_curl( $defaults, $post_defs );

    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, "https://api.pagar.me/1/transactions" );
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json') );
    curl_setopt( $ch, CURLOPT_POST, $payload );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($ch, CURLOPT_VERBOSE, 1);
//    curl_setopt_array($ch, $defaults );


    //FAZ A TRANSACAO!!!!
    $curl_resp = curl_exec($ch);
    curl_close($ch);


    //    return $response->withJson($user['id']);
//    return $response->withJson($curl_resp);
    $response->getBody()->write($curl_resp);
//    return $response->withJson(str_replace("\\","", $curl_resp));
});


//CADASTRO TRANSACAO DE USUARIO
$app->post('/insert/transacao/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];

    $db = new DaoUsuario($this->db);
    $user['id'] = filter_var($data['user']['id'], FILTER_SANITIZE_NUMBER_INT);
    $user['id_pagarme'] = $data['novaTransacao']['tid'];
    $user['data_transacao'] = $data['novaTransacao']['date_created'];
    $user['status'] = $data['novaTransacao']['status'];
    $user['valor'] = $data['novaTransacao']['amount'];

    return $response->withJson($db->insertTransacao($user));
});


//CADASTRO CARTAO DE CREDITO POR USUARIO
$app->post('/insert/cartao/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];

    $db = new DaoUsuario($this->db);
    $user['id'] = filter_var($data['user']['id'], FILTER_SANITIZE_NUMBER_INT);
    $user['cep'] = $data['cep'];
    $user['cpf'] = $data['cpf'];
    $user['complemento'] = filter_var($data['complemento'], FILTER_SANITIZE_STRING);
    $user['nome'] = filter_var($data['nome'], FILTER_SANITIZE_STRING);
    $user['numCard'] = $data['cardForm']['values']['number'];
    $user['expiry'] = $data['cardForm']['values']['expiry'];
    $user['cvc'] = $data['cardForm']['values']['cvc'];
    $user['type'] = $data['cardForm']['values']['type'];


//    return $response->withJson($user['id']);


    return $response->withJson($db->insertCartao($user));
});

//CADASTRO DE USUAROS. PARA TELA DE COMPLETAR CADASTRO...
$app->post('/update/usuario', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];
    // todo Validate campos!!!

    /*
     * - VALIDAR CPF
     * - VALIDAR RG ** nao precisa... nao existe rg unificado
     *
     *
     */

    if (! Uteis::validaCPF($data['cpf'])) {
        $erro['error'] = "warn";
        $erro['msg'] = "CPF inválido";
        return $response->withJson($erro);
    }

    $db = new DaoUsuario($this->db);
//

    $user['email'] = filter_var($data['email'], FILTER_SANITIZE_STRING);
    $user['usuario'] = filter_var($data['usuario'], FILTER_SANITIZE_STRING);
    $user['id'] = filter_var($data['id'], FILTER_SANITIZE_NUMBER_INT);

    $user['nome'] = filter_var($data['nome'], FILTER_SANITIZE_STRING);
    $user['datanasci'] = $data['datanasci'];
    $user['rg'] = $data['rg'];
    $user['cpf'] = $data['cpf'];
    $user['cep'] = $data['cep'];
    $user['complemento'] = filter_var($data['complemento'], FILTER_SANITIZE_STRING);
    $user['logradouro'] = filter_var($data['logradouro'], FILTER_SANITIZE_STRING);
    $user['bairro'] = filter_var($data['bairro'], FILTER_SANITIZE_STRING);
    $user['cidade'] = filter_var($data['cidade'], FILTER_SANITIZE_STRING);
    $user['uf'] = filter_var($data['uf'], FILTER_SANITIZE_STRING);
    $user['fbid'] = filter_var($data['fbid'], FILTER_SANITIZE_NUMBER_INT);
    $user['statuscad'] = 1;


    return $response->withJson($db->updateUsuario($user));

});

$app->post('/upload/usuarioImgs', function(Request $request, Response $response) {
    $erro = [];
    /*
 * deu certo abaixo
 */
//        $dest1 = fopen($filename , 'w');
//        $src = fopen($uploadedFile->file, 'r');
//        stream_copy_to_stream( $src , $dest1);
    /*
     * deu certo acima
     */

    $dir = $this->get('avatar_dir');
    $uploadedFiles = $request->getUploadedFiles();
    $data = $request->getParsedBody();

    $imgs = [];


//    return $response->withJson($erro);

//pega o user id
    $imgs['user_id'] = $data['user_id'];

    //foto do RG..
    if ($uploadedFiles['rg']){
        $uploadedFile = $uploadedFiles['rg'];
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = $imgs['user_id'] . '_rg';
            $imgs['rg'] = moveUploadedImgs_user($dir, $uploadedFile, $filename);
        }else{
            $imgs['rg'] = null;
        }
    }else{
        $imgs['rg'] = null;
    }

//     pega o avatar.. selfie
    if ($uploadedFiles['avatar']){
        $uploadedFile2 = $uploadedFiles['avatar'];
        if ($uploadedFile2->getError() === UPLOAD_ERR_OK) {
            $filename = $imgs['user_id'] . '_avatar';
            $imgs['avatar'] = moveUploadedImgs_user($dir, $uploadedFile2, $filename)  ;
        }else{
            $imgs['avatar'] = null;
        }
    }else{
        $imgs['avatar'] = null;
    }

    if ($imgs['rg'] || $imgs['avatar']){
        $db = new DaoUsuario($this->db);

        $erro = $db->updateImgsUsuario($imgs['user_id'], $imgs['avatar'], $imgs['rg']);
        $erro['statuscad'] = 2;
        $erro = $db->updateUsuario($erro);

    }else{
        $erro['error'] = "error";
        $erro['msg'] = "Erro ao salvar imagem222".$imgs['rg'].$imgs['avatar'];
    }


    return $response->withJson($erro);

    /*
     * PARA REUSO:::::
     */
    // pega varias imag3ens com a mesma chave ' key'
//    foreach ($uploadedFiles['img'] as $uploadedFile) {
//        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
//            $filename = Uteis::moveUploadedFile($dir , $uploadedFile);
//        }else{
//            $success = false;
//        }
//    }

//    // handle single input with multiple file uploads
//    foreach ($uploadedFiles['example3'] as $uploadedFile) {
//        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
//            $filename = Uteis::moveUploadedFile($directory, $uploadedFile);
//            $response->write('uploaded ' . $filename . '<br/>');
//        }
//    }

});

function moveUploadedImgs_user($directory, $uploadedFile, $filename)
{
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
//    $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
    $filename = sprintf('%s.%0.8s', $filename, $extension);

    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

    return $filename;
}

function http_build_query_for_curl( $arrays, &$new = array(), $prefix = null ) {

    if ( is_object( $arrays ) ) {
        $arrays = get_object_vars( $arrays );
    }

    foreach ( $arrays AS $key => $value ) {
        $k = isset( $prefix ) ? $prefix . '[' . $key . ']' : $key;
        if ( is_array( $value ) OR is_object( $value )  ) {
            http_build_query_for_curl( $value, $new, $k );
        } else {
            $new[$k] = $value;
        }
    }
}



//CADASTRO DE PRE-USUARIO.. PARA TELA DE PRE CADASRO...
$app->post('/cadastra/preusuario', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];
    // todo Validate campos!!!

    /*
     * - formato do email
     *      * - email nao pode ter repetido
     * - senha acima de 8 chars
     * - usuario nao pode ter repetido
     *
     */

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $erro['error'] = "warn";
        $erro['msg'] = "formato de email invalido";
        return $response->withJson($erro);
    }
//
    $db = new DaoUsuario($this->db);
//
    if ($db->existeUsuario($data['usuario']) > 0){
        $erro['error'] = "warn";
        $erro['msg'] = "Usuário existe. Escolha outro";
        return $response->withJson($erro);
    }
//
//    return $response->withJson($db->existeUsuario($data['usuario']));
    if ($db->existeEmail($data['email']) > 0){
        $erro['error'] = "warn";
        $erro['msg'] = "Email ja existe. Escolha ouro";
        return $response->withJson($erro);
    }


    $user['email'] = filter_var($data['email'], FILTER_SANITIZE_STRING);
    $user['usuario'] = filter_var($data['usuario'], FILTER_SANITIZE_STRING);
    $user['senha'] = filter_var($data['senha'], FILTER_SANITIZE_STRING);


    return $response->withJson($db->cadastraPreUsuario($user));

});

// DELETE
$app->delete('/todo/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM tasks WHERE id=:id");
    $sth->bindParam("id", $args['id']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

// Update
$app->put('/todo/[{id}]', function ($request, $response, $args) {
    $input = $request->getParsedBody();
    $sql = "UPDATE tasks SET task=:task WHERE id=:id";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("id", $args['id']);
    $sth->bindParam("task", $input['task']);
    $sth->execute();
    $input['id'] = $args['id'];
    return $this->response->withJson($input);
});


/*
 **===============================*===============================*===============================*===============================*===============================*===============================
 * *===============================*===============================*===============================*===============================*===============================*===============================
 * *===============================*===============================*===============================*===============================*===============================*===============================
 * TESTE DATACASE EMPRESTADO
 *
 */
//COBRA CARTAO CHECKOUT...
$app->post('/pagarme/datac/cobraCartao/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];

    //dados do user
    //$user['id'] = filter_var($data['user']['id'], FILTER_SANITIZE_NUMBER_INT);
//    $user['cep'] = $data['cep'];
//    $user['complemento'] = filter_var($data['complemento'], FILTER_SANITIZE_STRING);
    $user['nome'] = filter_var($data['nome'], FILTER_SANITIZE_STRING);
//    $user['nome'] = 'Thiago c l da silva';
    //cartao
//    $user['numCard'] = $data['cardForm']['values']['number'];
//    $user['expiry'] = $data['cardForm']['values']['expiry'];
//    $user['cvc'] = $data['cardForm']['values']['cvc'];
//    $user['type'] = $data['cardForm']['values']['type'];
    $user['card_hash'] = $data['card_hash'];

    //production: ak_live_ziZ8rx6kvDtbeedxRAJtA9Yyc5sAZk
    //teste: ak_test_ED7pkGAn73iTqzsEUAQxNK5J5GfFg6
    $params=['api_key'=>$this->get('pagarme_prod'), 'card_hash'=>$user['card_hash'],
        'amount'=>$data['valorTotalTickets']*100, //======>>>>>>>> EM CENTAVOS!!!!!!  ++==³¤€¼ CUIDADO!!!!!!!!!!
//        'amount'=>100,
        "customer" => array(
            "external_id" => $data['user']['id'],
            "name" => $data['nome'],
            "document_number" => $data['cpf'],
            "email" => $data['user']['email'],
            "address" => array(
                "street" => $data['user']['logradouro'],
                "street_number" => $data['user']['complemento'],
                "neighborhood" => $data['user']['bairro'],
                "zipcode" => $data['user']['cep']
            )
        ),
    ];

//    return $response->withJson($params);
    $payload = json_encode( $params );


//    http_build_query_for_curl( $defaults, $post_defs );

    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, "https://api.pagar.me/1/transactions" );
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json') );
    curl_setopt( $ch, CURLOPT_POST, $payload );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($ch, CURLOPT_VERBOSE, 1);
//    curl_setopt_array($ch, $defaults );


    //FAZ A TRANSACAO!!!!
    $curl_resp = curl_exec($ch);
    curl_close($ch);


    //    return $response->withJson($user['id']);
//    return $response->withJson($curl_resp);
    $response->getBody()->write($curl_resp);
//    return $response->withJson(str_replace("\\","", $curl_resp));
});


/*
 *===============================*===============================*===============================*===============================*===============================*===============================
 * *===============================*===============================*===============================*===============================*===============================*===============================
 * *===============================*===============================*===============================*===============================*===============================*===============================
 * *===============================*===============================*===============================*===============================*===============================*===============================
 *
 * EMPRESTADO PARA XAPPS::::::::::::::::::::::::::::::::::
 *
 */

//CADASTRO DE PRE-USUARIO.. PARA TELA DE PRE CADASRO...
$app->post('/xapps/cadastra/preusuario/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];
    // todo Validate campos!!!

    /*
     * - formato do email
     *      * - email nao pode ter repetido
     * - senha acima de 8 chars
     * - usuario nao pode ter repetido
     *
     */

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $erro['error'] = "warn";
        $erro['msg'] = "formato de email invalido";
        return $response->withJson($erro);
    }
//
    $db = new DaoUsuarioXapps($this->db);
//

//
//    return $response->withJson($db->existeUsuario($data['usuario']));
    if ($db->existeEmail($data['email']) > 0){
        $erro['error'] = "warn";
        $erro['msg'] = "This e-mail address already exists!";
        return $response->withJson($erro);
    }


    $user['email'] = filter_var($data['email'], FILTER_SANITIZE_STRING);
    $user['password'] = filter_var($data['password'], FILTER_SANITIZE_STRING);
    $user['name'] = filter_var($data['name'], FILTER_SANITIZE_STRING);


    return $response->withJson($db->cadastraPreUsuario($user));

});


//CADASTRO DE PRE-USUARIO.. PARA TELA DE PRE CADASRO...
$app->post('/xapps/cadastra/userInfo/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];

    $db = new DaoUsuarioXapps($this->db);

    return $response->withJson($db->updateUserInfo($data['data']));
});

//cadastro de feell job!!!
$app->post('/xapps/cadastra/feeljob/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];

    $db = new DaoUsuarioXapps($this->db);

    return $response->withJson($db->cadastraUserFeelJob($data['data']));
});

//regista de pod mandar push notes !!!
$app->post('/xapps/cadastra/sendnotes/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user = [];
    $erro = [];

    $db = new DaoUsuarioXapps($this->db);

    return $response->withJson($db->cadastraSendNotes($data['data']));
});


//GET - NEGOCIO LOGIN elliot
$app->get('/xapps/login/{email}/{senha}/', function (Request $request, Response $response, array $args) {
    $db = new DaoUsuarioXapps($this->db);
//    $response->getBody()->write("OLÁ, $name");
//    return $response;

    return $response->withJson($db->negocioLogin($args));
});





$app->run();




