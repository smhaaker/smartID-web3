// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import smartid_artifacts from '../../build/contracts/SmartIdentity.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var SmartIdentity = contract(smartid_artifacts);

// The following code is simple to show off interacting with your contracts.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var currentAccount; // need to set this universal in order to switch to other accounts. move this to currentAccount = web3.eth.coibase when needed.

var steffen = {}; // test user
var divState = {}; // for show and hide toggle

//var contractAddress = '0x12031aeca172b344f6f7ef7da53e88fd017a836b'; // old address for testing testrpc.
// need to add morden or testnet contract when deployed... This should then allow us to use mist browser and authorize without unlocking in jscript. / web3
var contractAddress = '0x32e851595b60db5b33d663dcb9da19c75e6249ae'; // current address for testing

var owner;
var smartID;
var abi;
var balanceWei; // needs global
var balance; // needs global

var SolidityCoder = require("web3/lib/solidity/coder.js");
var func;

var functionHashes;

window.App = {
  start: function() {
    var self = this;

    // Stuff to populate when user swaps accounts;
// testuser data
// create users
    var testuser = {};
    owner = web3.eth.coinbase;

    steffen.address = web3.eth.coinbase;
//    testuser.address = accounts[1];


    // Bootstrap abstraction for Use.
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

      currentAccount = account;

      balanceWei = web3.eth.getBalance(currentAccount).toNumber();
      balance = web3.fromWei(balanceWei, 'ether');


      ethBalance.innerHTML = balance + " Ether";
      accounNr.innerHTML = currentAccount; // this should be getaccount [Number ]




// set user addresses
      testuser.address = accounts[1];


// test output
          console.log(steffen.address);
          console.log(testuser.address);

// continue misc endorsement test.... Add user etc.

  console.log(SmartIdentity.deployed());
  console.log("contract address: " + contractAddress);
  abi = SmartIdentity.abi;
  // hmm
  var abiArray = [{"constant":false,"inputs":[{"name":"_newowner","type":"address"}],"name":"setOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"removeEndorsement","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"acceptEndorsement","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_myEncryptionPublicKey","type":"string"}],"name":"setEncryptionPublicKey","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"encryptionPublicKey","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"removeOverride","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_override","type":"address"}],"name":"setOverride","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_mySigningPublicKey","type":"string"}],"name":"setSigningPublicKey","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"addAttribute","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"attributes","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"signingPublicKey","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"checkEndorsementExists","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"removeAttribute","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"addEndorsement","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_oldhash","type":"bytes32"},{"name":"_newhash","type":"bytes32"}],"name":"updateAttribute","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"status","type":"uint256"},{"indexed":false,"name":"notificationMsg","type":"bytes32"}],"name":"ChangeNotification","type":"event"}];
    //console.log(abiArray)

    // could possibley do this this way also web3.eth.contract([ABI array goes here to make it an array]);

    functionHashes = App.getFunctionHashes(abiArray);

// var functionHashes = getFunctionHashes(SmartIdentity.abi);
  smartID = web3.eth.contract(abi).at(contractAddress);
  //console.log("abi: " + abi)
  //	ethBalance.innerHTML = accounts[0];
  var BigNumber = require('bignumber.js');

	var i;
	var accountBalance;
	var accsLength = accs.length;

  var functionValue;
	var x;
	for(i = 0; i < accsLength; i++){
	    x = new BigNumber(web3.eth.getBalance(accounts[i]));
            functionValue = accounts[i];
            myDropdown.innerHTML += "Account: " + i + "<br/>" + "<a href='#' onclick='App.updateContent("+i+")'>" + accounts[i] + "</a>"; // used to have a linebreak after the end of link tag...
            // onclick of link set default account, opens the info.

  //	    console.log(x.plus(21).toString(10));
	}



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

//      self.refreshBalance();
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
    var attributeHash1 = "hmm";
//    we want to list attributes added
// then add them to user by somethign like   smartID.addAttribute(hash1, {from: owner});
    smartID.addAttribute(attribute, {from: currentAccount})
// from output works.
    console.log("attribute added: " +  attribute)
    // it adds the attribute. need return value...
  },


  watchFilter: function(){
    var filter = web3.eth.filter('latest');
      filter.watch(function(error, result){
          var block = web3.eth.getBlock(result, true);
          console.log('block #' + block.number);
//          console.log(block.transactions)
          console.dir(block.transactions);


          for (var index = 0; index < block.transactions.length; index++) {
            var t = block.transactions[index];

            // Decode from
        //    var from = t.from==account ? "me" : t.from;
            //var from = currentAccount;
            var from = t.from;
            //  console.log(t.input)
            var to = t.to;
            // Decode function
            var func = App.findFunctionByHash(functionHashes, t.input);
            //App.findFunctionByHash(functionHashes, t.input);
// we need a if func == setKey or == setAttribute... whatever the name is in the contract, then this input data is printed out... so we need a if statement...

/* Remember we are decoding bytes32 i think*/
// might need to change this to string...

          //  var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10)); // issue is probably here... because its substring...

            // look up solidity coder decodeparams...
            //console.dir(inputData);
            //console.log(inputData[0].toString())
//            var inputData = SolidityCoder.decodeParams(["bytes32"], t.input); // issue is probably here... because its substring...


            if (func == 'addAttribute') {
              // This is the sellEnergy() method
              var inputData = SolidityCoder.decodeParams(["bytes32"], t.input.substring(10)); // issue is probably here... because its substring...
              // THIS ONE ACTUALLY DECODES THE DAMN STUFFs... // get the from.

            //  var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
              console.dir(inputData);
              console.log("from " + from + " input data " + inputData[0].toString()) // set this to currentaccount... we we see who submitted the attribute.. wont work universally though.
              /// needs to be the real from returned in the transaction..
              console.log(web3.toAscii(inputData[0].toString()))
              // still need to decipher the output i guess..
              console.log("to" + to) // this is to the contract. I think.
                // this updates added attributes. However, we can all claim all the same attributes... Must use endorsement?
                // Also consider bytes32 not being able to issue complete address. might need to have the to - from...
                // from output is good.

              $('#transactions').append('<tr><td>' + t.blockNumber +
                  '</td><td>' + from +
                  '</td><td>' + " Empty " +
                  '</td><td>Attribute: (' + web3.toAscii(inputData[0].toString()) + ')</td></tr>');

            } else if (func != 'addAttribute') {
            //  var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
              console.dir(inputData);
              console.dir("Not working, try again")
            } else {
              // Default log
            }
        }

      });
  },


  getFunctionHashes: function() {
    var hashes = [];
    for (var i=0; i<abi.length; i++) {
      var item = abi[i];
      if (item.type != "function") continue;
      var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
      var hash = web3.sha3(signature);
      console.log(item.name + '=' + hash);
      hashes.push({name: item.name, hash: hash});
    }
    return hashes;
  },

  findFunctionByHash: function(hashes, functionHash) {
    for (var i=0; i<hashes.length; i++) {
      if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10))
        return hashes[i].name;
    }
    return null;
  },


// no go yet...
  endorseAcc: function(){

      console.log("endorsed!!")
      var endorseIn = document.getElementById("endorsed");
      endorseIn.innerHTML = "endorsed"
// still need to define smartID. set abi and address correctly. open old to check.
        smartID.addEndorsement('test', 'test',{from:steffen.address});
//      innerHTML.
      //pagecontent
  },


  // Set key thenable.
  /// does not work compeltely though hmm says encryptionPublicKey is not defined.
    setKey: function() {
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


// this should be how we can grab it without the contract address i guess? Cool.
  getKey: function() {
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


/// so here its basically checking if metacoin is deployaed then running stuff in a function.

// example:
// Ah, right. You need to use HelloWorld.deployed() as a thennable.
//i.e., HellowWorld.deployed().then(function(instance) { // do something here })
//in the // do something here, you’d do return instance.balance.call() for instance
//so we could have:


  // toggle menu dropdown update function name.
  myFunction: function() {
        var x = document.getElementById('myDropdown');
        if (x.style.display !== 'none') {
            x.style.display = 'none';
        } else {
            x.style.display = 'block';
        }
    },


  // this should cover all the basics on show hide... Need to set something as default...
  showBtn: function(id) {
      if (document.getElementById) {
          var divid = document.getElementById(id);
          divState[id] = (divState[id]) ? false : true;
          //close others
          for (var div in divState){
              if (divState[div] && div != id){
                  document.getElementById(div).style.display = 'none';
                  divState[div] = false;
              }
          }
          divid.style.display = (divid.style.display == 'block' ? 'none' : 'block');
      }
  },

  // generic updateContent function for testing...
    updateContent: function(value) {
      currentAccount = accounts[value];
      console.log("current account is: " + currentAccount);

        balanceWei = web3.eth.getBalance(currentAccount).toNumber();
        balance = web3.fromWei(balanceWei, 'ether'); // balance in ethere.

        accounNr.innerHTML = currentAccount; // this should be getaccount [Number ]
        ethBalance.innerHTML = balance + " Ether";  // what?
      //  App.refreshBalance();
        App.myFunction();
    },

  accountList: function(){ // should be good to go..
      listAccounts.innerHTML = "";
    for(var i = 0; i<accounts.length; i++){
      //console.log(accounts[i]);
      listAccounts.innerHTML += "Account: " + i + " : " + accounts[i] + "<br/>";
    }
  },

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
