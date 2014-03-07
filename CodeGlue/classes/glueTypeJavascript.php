<?php
/**
 * Класс для обработки наборов, содержащих JavaScript файлы
 */
class glueTypeJavascript extends glueType {

    protected $separator = "/**/;\n";

    protected function includerLine($filePatch) {
        return '<script type="text/javascript" src="' . $filePatch . '"></script>';
    }
    public function glue() {
        parent::glue();
         /**
         * Сдесь, к примеру, мог бы быть вызов YUI Compressor для обработки файла-слепки
         */
    }

}