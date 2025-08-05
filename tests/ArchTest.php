<?php

arch()->preset()->php()->ignoring(['dd', 'dump']);

arch()->preset()->laravel();

arch()->preset()->security()->ignoring(['array_rand', 'parse_str', 'mt_rand', 'uniqid', 'sha1', 'rand']);

arch('models have proper documentation')
    ->expect('App\Models')
    ->toHavePropertiesDocumented();