// NODE_ENV=production CHAIN=eos FEATHERS_PORT=3030 CORES=1 node src/index.js
module.exports = {
  apps : [
    {
      name: 'mainnet',
      script: 'src/index.js',
      watch: false,
      args: '-r esm',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      node_args: '--max_old_space_size=4096'
    }
  ]
};