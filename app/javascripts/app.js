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

window.App = {
  start: function() {
    var self = this;
    console.log("TEST!");

// testuser data
// create users
    var testuser = {};


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

  smartNew: function(){
    var account = parseInt(document.getElementById("account").value);
    console.log("from account: " + account)
  },


  addAttribute: function(){
    var attributeHash = [];
    attributeHash[0] = "123908290389021489308"
    var attribute = document.getElementById("addAttribute").value;

//    we want to list attributes added
// then add them to user by somethign like   smartID.addAttribute(hash1, {from: owner});
    var count;

        for(count = 1; count < attributeHash.length; count++){
          attributeHash[count] = "hello";
          console.log(attributeHash[count]);
        }

    console.log("attribute added: " +  attribute)
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

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
