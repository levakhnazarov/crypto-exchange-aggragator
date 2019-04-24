module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    {
      name      : 'app',
      script    : 'bin/www.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'development'
      },
      // watch : ['app.js', 'config', 'models', 'routes/index.js'],
      watch : [
        'app.js', 
        'config', 
        'models', 
        'exchangers', 
        'routes/**/*.*', 
        'helpers/utils-module/**/*.*',
        'cache/*.*',
        'helpers/*.*',

      ],

      //ignore_watch : ['node_modules', "vagrant"], // по какой то странной причине не работает
      watch_options: {
        followSymlinks: false,
        // для того что бы watch работал в vagrant, без этой опции не работает слежение за файлами которые были изменены в основной ОС на которой запщей vagrant
        usePolling: true
      }
    },
    // admin
    // {
    //   name: 'Admin',
    //   env: {
    //     PORT: 5000,
    //   },
    //   script: 'admin/app.js',
    //   watch: ['admin/app.js', 'admin/routes/**/*.*'],
    //   watch_options: {
    //     followSymlinks: false,
    //     // для того что бы watch работал в vagrant, без этой опции не работает слежение за файлами которые были изменены в основной ОС на которой запщей vagrant
    //     usePolling: true
    //   }
    // },
    // {
    //   name: 'socket',
    //   env: {
    //     PORT: 4000,
    //   },
    //   script: 'socket.js',
    //   watch: ['socket.js'],
    //   watch_options: {
    //     followSymlinks: false,
    //     // для того что бы watch работал в vagrant, без этой опции не работает слежение за файлами которые были изменены в основной ОС на которой запщей vagrant
    //     usePolling: true
    //   }
    // },
    // bittrex worker
    {
      name: 'bittrex',
      env: {
        PORT: 7000,
        NAME: 'bittrex'
      },
      script: 'workers/bittrex.js',
      watch: ['workers/bittrex.js'],
      watch_options: {
        followSymlinks: false,
        // для того что бы watch работал в vagrant, без этой опции не работает слежение за файлами которые были изменены в основной ОС на которой запщей vagrant
        usePolling: true
      }
    },
    {
      name: 'coinmarketcap',
      env: {
        PORT: 7001,
        NAME: 'cmc'
      },
      script: 'workers/currencies.js',
      watch: ['workers/currencies.js'],
      watch_options: {
        followSymlinks: false,
        usePolling: true
      }
    },
    {
      name: 'clean',
      env: {
        PORT: 7002,
        NAME: 'clean'
      },
      // env_production : {
      //   NODE_ENV: 'development'
      // },
      script: 'workers/clean.js',
      watch: ['workers/clean.js'],
      watch_options: {
        followSymlinks: false,
        usePolling: true
      }
    },
    {
      name: 'binance',
      env: {
        PORT: 7003,
        NAME: 'binance'
      },
      env_production : {
        // NODE_ENV: 'development'
      },
      script: 'workers/binance.js',
      watch: ['workers/binance.js'],
      watch_options: {
        followSymlinks: false,
        usePolling: true
      }
    },
    //
    // {
    //   name: 'poloniex',
    //   env: {
    //     PORT: 7002,
    //     NAME: 'poloniex'
    //   },
    //   env_production : {
    //     // NODE_ENV: 'development'
    //   },
    //   script: 'workers/poloniex.js',
    //   watch: ['workers/poloniex.js'],
    //   watch_options: {
    //     followSymlinks: false,
    //     // для того что бы watch работал в vagrant, без этой опции не работает слежение за файлами которые были изменены в основной ОС на которой запщей vagrant
    //     usePolling: true
    //   }
    // },
    // {
    //   name: 'huobi',
    //   env: {
    //     PORT: 7003
    //   },
    //   script: 'workers/huobi.js',
    //   watch: ['workers/huobi.js'],
    //   watch_options: {
    //     followSymlinks: false,
    //     // для того что бы watch работал в vagrant, без этой опции не работает слежение за файлами которые были изменены в основной ОС на которой запщей vagrant
    //     usePolling: true
    //   }
    // }
  ]
};
