module.exports = {
    networks:{
//	"live": {
//	    network_id: 3, // should be ropsten
//	    host: "localhost",
//	    port: 8545
//	}
	development: {
	    host: '127.0.0.1',
	    port: 8545,
	    network_id: '*' // Match any network id
	}
    },
    rpc: {
    host: "localhost",
    port: 8545
  }
};
