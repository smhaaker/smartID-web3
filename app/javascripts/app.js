// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import smartid_artifacts from '../../build/contracts/SmartIdentity.json'
// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);
var SmartIdentity = contract(smartid_artifacts);
// The following code is simple to show off interacting with your contracts.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var steffen = {};
var contractAddress = '0xe0dd6dc5820d442af047f4e9ce900466dcf98b4b';
var owner;
var smartID;

window.App = {
  start: function() {
    var self = this;
    console.log("TEST!");

// testuser data
// create users
    var testuser = {};
    owner = web3.eth.coinbase;

    steffen.address = web3.eth.coinbase;
//    testuser.address = accounts[1];

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);
    SmartIdentity.setProvider(web3.currentProvider);


    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];


// set user addresses
      testuser.address = accounts[1];


// test output
          console.log(steffen.address);
          console.log(testuser.address);

// continue misc endorsement test.... Add user etc.

  console.log(SmartIdentity.deployed());
  console.log("contract address: " + contractAddress);
  var abi = SmartIdentity.abi;
  smartID = web3.eth.contract(abi).at(contractAddress);


  encryptionKey.innerHTML = smartID.encryptionPublicKey({from: steffen.address});

  var smartIDadd = '0x9b0820f41b9c29f5e43a6b8ea5b33b31fb62f42e';
//  var smartIDtest = web3.eth.contract(smartID.abi).at(smartIDadd); // can probably set the address globally

  //smartIDtest.new();

  // gas set depending on dev environment.
//  SmartIdentity.new({from: steffen.address, gas: 4712388});
//SmartIdentity.new({from: '0xa7d455fe00228e9bb08238087fe81ff385e71fe4'});
SmartIdentity.new({from: steffen.address, gas: 4712388})
  .then(function(data) {
    steffen.identify = data;
  })

      self.refreshBalance();
    });
  },


  smartContractNew: function(){
    SmartIdentity.new({from: steffen.address, gas: 4712388})
      .then(function(data) {
        steffen.identify = data;
      })

    console.log("new smartID contract issued: " + steffen.identify)
    console.log('Eth? ' + web3.eth.getTransaction("0xa4b4417fc7e492b911d08e948ea50ca772b82516"));
  },


  smartNew: function(){
    var account = parseInt(document.getElementById("account").value);
    console.log("from account: " + account)
  },


  addAttribute: function(){
    var attributeHash = [];
    attributeHash[0] = "123908290389021489308"
    var attribute = document.getElementById("addAttribute").value;
    var attributeHash1 = "xxxx";
//    we want to list attributes added
// then add them to user by somethign like   smartID.addAttribute(hash1, {from: owner});
    smartID.addAttribute(attributeHash1, {from: owner})
    console.log("attribute added: " +  attributeHash1)
  },


  endorseAcc: function(){

      console.log("endorsed!!")
      var endorseIn = document.getElementById("endorsed");
      endorseIn.innerHTML = "endorsed"
// still need to define smartID. set abi and address correctly. open old to check.
        smartID.addEndorsement('test', 'test',{from:steffen.address});
//      innerHTML.
      //pagecontent
  },


// setkey works.
  setKey: function(){

      var newKey = document.getElementById("eKey").value;
//      endorseIn.innerHTML = "endorsed"
      // still need to define smartID. set abi and address correctly. open old to check.
//        smartID.addEndorsement('test', 'test',{from:steffen.address});
//      innerHTML.
      //pagecontent
      smartID.setEncryptionPublicKey(newKey, {from: steffen.address})
      encryptionKey.innerHTML = newKey;
      console.log("encryption Key Set to: " + newKey)
  },

  // Set key thenable.
  /// does not work compeltely though hmm says encryptionPublicKey is not defined.
    setKey2: function() {
      var newKey = document.getElementById("eKey").value;
      var self = this;
      var smart;
      SmartIdentity.deployed().then(function(instance) {
        smart = instance;
        return smart.setEncryptionPublicKey(newKey, {from: account});
      }).then(function(value) {
  //      var newKey = document.getElementById("eKey");
  //      eKey.innerHTML = value.valueOf();
        encryptionKey.innerHTML = newKey;
        console.log("encryption Key Set to: " + newKey)

      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting balance; see log.");
      });
    },




  getKey: function(){

//    var smart;
//    SmartIdentity.deployed().then(function(instance){
//      smart = instance;
//      return smart.encryptionPublicKey({from: steffen.address}));
      console.log(smartID.encryptionPublicKey({from: steffen.address}));

//  }).catch(function(e)){
  //  console.log(e);
  //  self.setStatus("error getting key")
//  });

  },



// this should be how we can grab it without the contract address i guess? Cool.
  getKey2: function() {
    var self = this;
    var smart;
    SmartIdentity.deployed().then(function(instance) {
      smart = instance;
      return smart.encryptionPublicKey.call({from: account});
    }).then(function(value) {
//      var balance_element = document.getElementById("balance");
//      balance_element.innerHTML = value.valueOf();
    console.log(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },





  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;


/// so here its basically checking if metacoin is deployaed then running stuff in a function.

// example:
// Ah, right. You need to use HelloWorld.deployed() as a thennable.
//i.e., HellowWorld.deployed().then(function(instance) { // do something here })
//in the // do something here, you’d do return instance.balance.call() for instance
//so we could have:
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
