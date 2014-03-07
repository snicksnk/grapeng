<?php
/**
 * Класс для обработки наборов, содержащих css файлы
 */
class glueTypeCss extends glueType {
    protected $separator = "/**/\n";
    protected function includerLine($filePatch) {
        return '<link rel="stylesheet" type="text/css" href="' . $filePatch . '" />';
    }

}
