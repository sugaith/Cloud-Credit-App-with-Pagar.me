<?php


//require '../vendor/slim/slim/Slim/Http/UploadedFile.php';
//require_once '../vendor/autoload.php';


/**
 * Created by PhpStorm.
 * User: suga
 * Date: 03-Jun-18
 * Time: 3:52 PM
 */
class Uteis
{
    static public function validaCPF($cpf)
    {	// Verifiva se o número digitado contém todos os digitos
        $cpf = preg_replace('/[^0-9]/', '', (string) $cpf);
        // Valida tamanho
        if (strlen($cpf) != 11)
            return false;
        // Calcula e confere primeiro dígito verificador
        for ($i = 0, $j = 10, $soma = 0; $i < 9; $i++, $j--)
            $soma += $cpf{$i} * $j;
        $resto = $soma % 11;
        if ($cpf{9} != ($resto < 2 ? 0 : 11 - $resto))
            return false;
        // Calcula e confere segundo dígito verificador
        for ($i = 0, $j = 11, $soma = 0; $i < 10; $i++, $j--)
            $soma += $cpf{$i} * $j;
        $resto = $soma % 11;
        return $cpf{10} == ($resto < 2 ? 0 : 11 - $resto);
//        return true;
    }

    /**
     * Moves the uploaded file to the upload directory and assigns it a unique name
     * to avoid overwriting an existing uploaded file.
     *
     * @param string $directory directory to which the file is moved
     * @param UploadedFile $uploaded file uploaded file to move
     * @return string filename of moved file
     */
//    static public function moveUploadedFile($directory, UploadedFile $uploadedFile)
//    {
//        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
//        $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
//        $filename = sprintf('%s.%0.8s', $basename, $extension);
//
//        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
//
//        return $filename;
//    }




}