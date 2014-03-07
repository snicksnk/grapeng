<?php

/**
 * Базовый класс, который должны наследовать классы для обработки определенных типов коллекций
 *
 */
abstract class glueType {

    /**
     * @var string Разделитель между склеиваемыми файлами
     */
    protected $separator = "\n";

    /**
     * @var array Список файлов обрабатываемого набора 
     */
    public $filesList;

    /**
     * @var string Название файла, генерируемого склейкой набора
     */
    public $fileName;

    /**
     * @var array  Состояние набора 
     */
    public $state;

    /**
     * @var string Путь к папке, хранящей файлы-склейки
     */
    public $cacheDirPatch;

    /**
     *
     * @var string Url папки, хранящей склейки
     */
    public $cacheDirUrl;

    /**
     *
     * @var string Базовый url подставляемый ко всем файлам
     */
    public $baseUrl;

    public function __construct() {
        
    }

    /**
     * Функция, генерирующая код для встраивавания данного типа файлов
     * @param string $filePatch Путь к файлу
     * @return string Код для встраивания файла
     */
    protected abstract function includerLine($filePatch);

    /**
     * Функция, слепляющая вместе все файлы набора
     */
    public function glue() {
        $content = '';
        foreach ($this->filesList as $file) {
            $content.=$this->separator . trim(file_get_contents($file));
        }
        file_put_contents($this->cacheDirPatch . $this->fileName, $content);
    }

    /**
     * Функция, возвращающая код для вставки набора файлов
     * @param bool $glueEnabled Параметр определяющий в каком виде набор будет вставлен в страницу. Все файлы по отдельности, либо слепленный файл. 
     * @return string Код для вставки набора в страницу
     */
    public function getIncluder($glueEnabled) {
        $includer = '';
        if ($glueEnabled) {
            $includer = $this->includerLine($this->baseUrl . $this->cacheDirUrl . $this->fileName . '?state=' . $this->state);
        } else {
            foreach ($this->filesList as $file) {
                $includer .= $this->includerLine($this->baseUrl . $file . '?state=' . $this->state) . "\n";
            }
        }
        return $includer;
    }

}
