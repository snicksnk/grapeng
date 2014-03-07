<?php

class codeGlue {

    /**
     *
     * @var bool Параметр, определяющий, включена ли склейка файлов
     */
    public $glueEnable = false;

    /**
     *
     * @var array Массив, содержащий, все конфигурации
     */
    private $config = array();

    /**
     * @var string Путь к файлу, содержащему время кэширования каждого набора
     */
    private $stateStorage;

    /**
     *
     * @var bool Параметр, определяющий включено ли предотвращение кэширования в браузере
     */
    public $preventCaching = false;
    /**
     * 
     * @var array Маcсив, содержащий время кэширования каждого набора
     */
    private $state = array();

    /*
     * @param string $confPatch Путь к конфигу 
     */
    public function __construct($confPatch) {
        include $confPatch;
        $this->config = $config;
        $this->glueEnable = $config['glueEnable'];
        $this->stateStorage = $config['stateStorage'];
        $this->preventCaching = $config['preventCaching'];
        $this->state = json_decode(file_get_contents($this->stateStorage), true);
    }

    /**
     * Регенерация всех файлов-склеек, очистка кэша
     */
    public function flushCash() {
        foreach ($this->config['collerctions'] as $collectionId => $index) {
            $this->makeGlue($collectionId);
        }
    }

    /**
     * Функция, возвращающая код для вставки коллекции
     * @param string $collectionId Идентификатор коллекции
     * @return string Код для вставки коллекции 
     */
    public function genIncluder($collectionId) {
        $listTypeObj = $this->listTypeObjFactory($collectionId);
        return $listTypeObj->getIncluder($this->glueEnable);
    }
    
    /**
     * Фабрика объектов, работающих с коллекциями
     * @param string $collectionId Идентификатор коллекции
     * @return object Объект коллекции 
     */
    private function listTypeObjFactory($collectionId) {
        if (isset($this->config['collerctions'][$collectionId])) {
            $listTypeObj = new $this->config['collerctions'][$collectionId]['className'];
            $listTypeObj->cacheDirPatch = $this->config['cacheDirPatch'];
            $listTypeObj->cacheDirUrl = $this->config['cacheDirUrl'];
            $listTypeObj->fileName = $this->config['collerctions'][$collectionId]['fileName'];
            $listTypeObj->filesList = $this->config['collerctions'][$collectionId]['files'];
            $listTypeObj->baseUrl=$this->config['baseUrl'];
            $listTypeObj->state = $this->getState($collectionId);
            return $listTypeObj;
        } else {
            throw new Exception('Collection "' . $collectionId . "' not found");
        }
    }

    /**
     * Функция, производящая склейку файлов выбранной коллекции
     * @param string $collectionId Идентификатор коллекции
     */
    private function makeGlue($collectionId) {
        $listTypeObj = $this->listTypeObjFactory($collectionId);
        $listTypeObj->glue();
        $this->setNewState($collectionId);
    }

    /**
     * Функция, возвращающая время последней генерации коллекции, либо текущий таймштамп если preventCaching==true
     * @param string $collectionId Идентификатор коллекции
     * @return int Таймштамп 
     */
    private function getState($collectionId) {
        if ($this->preventCaching) {
            return time();
        } elseif (isset($this->state[$collectionId])) {
            $state = $this->state[$collectionId];
        } else {
            $state = 1;
        }
        return $state;
    }
    
    /**
     * Функция, устанавливающая новый таймштамп последней генерации файла-склейки для набора
     * @param string $collectionId Идентификатор коллекции
     */
    private function setNewState($collectionId) {
        $this->state[$collectionId] = time();
        file_put_contents($this->stateStorage, json_encode($this->state));
    }

}

