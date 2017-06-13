// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import smartid_artifacts from '../../build/contracts/SmartIdentity.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var SmartIdentity = contract(smartid_artifacts);

var accounts; // need it global for it to work
var account; // same
var currentAccount; // need to set this global in order to switch to other accounts. move this to currentAccount = web3.eth.coibase when needed.

var steffen = {}; // test user
var divState = {}; // for show and hide toggle

var contractAddress = '0x46a83f04205ba6a1d1c68d8fc2b447d9990f418d'; // current address for testing
//var contractAddress = '0x23321cc69cc689ad70f57efcd4b1d6ef1aaac9cb'; // test-net contract address
//var contractAddress = '0x3d97dAC6a412970E714bB0d0AB421C89485ccf99'; // test-net contract address

var owner;
var smartID;
var abi;
var balanceWei; // needs global
var balance; // needs global

var SolidityCoder = require("web3/lib/solidity/coder.js");
var func;
var functionHashes;

var btcQR = 'waiting';
var deviceEthereumAddress;

var tokenValue;
var totalTokens = 0;


// meteringdata start temp
var meteringData = [{
  "name": "Policy for sdr merged with sdr arm",
  "current_agreement_id": "8a627f6a76a7cea608d203413bf58fd098625afedd92787c9acb1911f81e0ae1",
  "consumer_id": "agbot-tok02-01.bluehorizon.network",
  "agreement_creation_time": 1496331172,
  "metering_notification": {
    "amount": 15730,
    "start_time": 1496331163,
    "current_time": 1497274992,
    "missed_time": 0,
    "consumer_meter_signature": "f7958802b6ceb1f4d6c4a0195152ab220c4d9f5a3b3058ba25ce26fecfa35b422720446c7689b324e274a3447b53103dba53f995d7389efc607b496626ad25791b",
    "agreement_hash": "cb3cef781a99a8c127c6ba9db64a3bdfe661b693eeb9337bb0d3a3a006528c88",
    "consumer_agreement_signature": "4f38ecac700c7b9ff807483216f75abec7e75ca80002af8d0578a12d016c0ea37d5facf964e39ac5dce74800526e00208fdc950e7db99c9246c4cabf16161ba71c",
    "consumer_address": "0x324f73187585becfbaa363cacdf9823c3a1a1cae",
    "producer_agreement_signature": "62dbffd933a5b0c3810c2159aafddd842a364b658ab9a10a648de625a885c2845ecced2e325aea67f2e42f09b281021ab515e78ab8e2dcd53946dde5c4c697d11c",
    "blockchain_type": "ethereum"
    }
},
{
  "name": "Policy for location merged with location arm",
  "current_agreement_id": "d495e901d7798d8e708dc103d0388130ba9a3d3d3670d8b35c50a2a29fa2e376",
  "consumer_id": "agbot-dal09-01.bluehorizon.network",
  "agreement_creation_time": 1496331174,
  "metering_notification": {
    "amount": 15732,
    "start_time": 1496331167,
    "current_time": 1497275140,
    "missed_time": 0,
    "consumer_meter_signature": "732f47373c6852f531708e6b6262b66a48b5cb51d41e68d8ffca577f4fe75dc30778c0a09d27f5881ffcd055681378a803629ba05ee18a6996e8983b7de56c9f1b",
    "agreement_hash": "3942149df5d4fe87d709c4b59a84569cda01921f642d189840bba6154523a702",
    "consumer_agreement_signature": "f445ced0b0ad9ed523c96bebc08831147549586b6fc6de8cd5a900e090f9e37011b52faaa6dfd240899daa6581c8c62226afdfeaa8914e4df714ae04bb0ea4111c",
    "consumer_address": "0x1473515a994ddfdbc37b218f11536509065c5141",
    "producer_agreement_signature": "40b39ca929039c074586038b38f7413c82cc307cf9769a4f9c96d729fc62c5f25e36a7d13e91b463776c6ed53df1aa75e133b4d6b09def287af2f5912bd5051d1c",
    "blockchain_type": "ethereum"
  }
},
{
  "name": "Policy for netspeed merged with netspeed arm",
  "current_agreement_id": "58f8b25b505772bb31410680c7476c1912c50836d6f0e4a0d4ea830777d657c7",
  "consumer_id": "agbot-tok02-01.bluehorizon.network",
  "agreement_creation_time": 1496752821,
  "metering_notification": {
    "amount": 8702,
    "start_time": 1496752818,
    "current_time": 1497274970,
    "missed_time": 10,
    "consumer_meter_signature": "eb7395d1a5ba27e8d2f7eea88157045f9723b3a4a4fe7352cfd22aa4988866a13a4d67d990a3bcd953e06eb597eeea61bd5cd31fbe7670bf477c08b4fbf2f0da1b",
    "agreement_hash": "7baf1498c459af9a77ad6c20d127adcff70da6fbb3ee02b941ce23cbfa238882",
    "consumer_agreement_signature": "898986704e332313787b7f147c5bd1083e4ff402a607eed37b3bde0490c764fa48a5e68553ea91ff5b574085d1cf6c308e79b9fb7e38ea138294ae86c79838f11c",
    "consumer_address": "0x324f73187585becfbaa363cacdf9823c3a1a1cae",
    "producer_agreement_signature": "b6e94b09f98fec2ba08265a39b26d28e2a8fa246c225017271fbc44e9cdd55122619c406377f88a51dba8dcfe5aec7db40dbf364218568765bb2a851ff9e08bf1b",
    "blockchain_type": "ethereum"
  }
}
]

var meteringData2 = [
  {
    "name": "Policy for netspeed merged with netspeed arm",
    "current_agreement_id": "9fe087d54c0d10def28e7a49ab3751f9b649dc8ac2306dcc8bf2d488d50def35",
    "consumer_id": "agbot-tok02-01.bluehorizon.network",
    "agreement_creation_time": 1496595326,
    "metering_notification": {
      "amount": 10658,
      "start_time": 1496595318,
      "current_time": 1497234846,
      "missed_time": 0,
      "consumer_meter_signature": "ee8c24a358767989fe18a5f59a6c9ea66cc654e243f520ffaebbd28ac1bd15b01bb7c2e2ac7862b3ad95e8446b84e18b7a3382cf5be9f848ba718149a09de0b71c",
      "agreement_hash": "5b578dfebac1e7d2194208f645d4204b9a3e6b87172dc664e7f5969c80ee368b",
      "consumer_agreement_signature": "d186e1ddbc03711fc1c491d740ff9241338af98dd33b891b2507b6f04ab38e3c4638ce40731f1a32d01fd956d8367feb18701dcb16aa806ba368a487231378fd1c",
      "consumer_address": "0x324f73187585becfbaa363cacdf9823c3a1a1cae",
      "producer_agreement_signature": "e37e0cfe46ad331d2ebaef31fc3a0791f11d72533dfbde71bf5ba08aebc721fc38bd25763937be1080698abd44125c2eda5de991680e8975f7d7e041c7ab90681c",
      "blockchain_type": "ethereum"
    }
  },
  {
    "name": "Policy for sdr merged with sdr arm",
    "current_agreement_id": "ad9684f6f18b356d170073a581841bbb326193708f396ec2f83b047660e05a63",
    "consumer_id": "agbot-tok02-01.bluehorizon.network",
    "agreement_creation_time": 1496595327,
    "metering_notification": {
      "amount": 10658,
      "start_time": 1496595321,
      "current_time": 1497234854,
      "missed_time": 0,
      "consumer_meter_signature": "ed4f2aaf8fef5d983f9a85ee0945e24c03f5f4accdb332ad0b959b4a71c749745342f2fde322959f0772c6b719c46083346b1212391e99d871185667ac1ee2271c",
      "agreement_hash": "9d78ec66608fc60b73a90e59a6ce445ac68a0af7738088c40d9cae673158ac31",
      "consumer_agreement_signature": "96082ce6b9a0ddb9dc5df6fdb5008df8424805157ede07348b9ab1fff50b08d71b64817799ce7cd63f18606d0cfacb515e93bd562ce4305f117f7e1b4642c4241b",
      "consumer_address": "0x324f73187585becfbaa363cacdf9823c3a1a1cae",
      "producer_agreement_signature": "76a2558fea56fd623517cbe594b040e750a1429aae97a7f323a67fb82baa3f9a115f94d4a0fe684f26dc77edc1d7e891a203b3832a22686750350f06cb09a1041c",
      "blockchain_type": "ethereum"
        }
  },
  {
    "name": "Policy for location merged with location arm",
    "current_agreement_id": "c52055ab872e8d12c827e969309da5f50e68cbe27fa43f89dc7727535281ea12",
    "consumer_id": "agbot-lon02-01.bluehorizon.network",
    "agreement_creation_time": 1496595327,
    "metering_notification": {
      "amount": 10661,
      "start_time": 1496595321,
      "current_time": 1497235003,
      "missed_time": 0,
      "consumer_meter_signature": "75721090f8a9f5b457e648a490ca4e4efbe272dddbd8d01b45d7d0639e6306c14811153aa8b995b60bff5a62b2fbb9d7d5b234793d7b07c72c9bb7b6666fe5101b",
      "agreement_hash": "ba21679a830f6cbde286c139363df613bd1bcf223ba2ae0151ab331e8fe1da89",
      "consumer_agreement_signature": "768ad93bb7af4ca21d726c1c1a902d35abb5f1811d9e553d9b055eb11c6e810a1ec94a9f17b098ab571cdc43b7b731a04b82e5976a2791f15dcacd27a953626e1c",
      "consumer_address": "0xba2de57eee86da890b70d7d391c47f82a38f0ff9",
      "producer_agreement_signature": "90300717836fb3b785a24b4e78697c80c88bbb4ba74cb0823101168120b475717bad07d8d670885cdba4b10154fdc5e6a7e3de1f67a3cb6f9231e09303147aef1c",
      "blockchain_type": "ethereum"
    }
  }
]

// metering data temp ends.


window.App = {
  start: function() {
    var self = this;
    // create users
    steffen.address = web3.eth.coinbase;
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

// accounts
      accounts = accs;
      account = accounts[0];
      currentAccount = account;
      owner = account;

      balanceWei = web3.eth.getBalance(currentAccount).toNumber();

      // added callback for metamask callback
      /*
          balanceWei = web3.eth.getBalance(currentAccount, function(error, result){
            if(!error)
              result.toNumber()
            else
              console.error(error);
          });
          */

          // balance to update to display on screen
          balance = web3.fromWei(balanceWei, 'ether');

    // balance = web3.fromWei(balanceWei, 'ether');
    // print to screen
      ethBalance.innerHTML = balance + " Ether";
      accounNr.innerHTML = currentAccount; // this should be getaccount [Number ]

  //console.log(SmartIdentity.deployed());
  //console.log("contract address: " + contractAddress);
  abi = SmartIdentity.abi;
  // Make sure abiArray is up to date
  var abiArray = [{"constant":false,"inputs":[{"name":"_newowner","type":"address"}],"name":"setOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"removeEndorsement","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"acceptEndorsement","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_myEncryptionPublicKey","type":"string"}],"name":"setEncryptionPublicKey","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"encryptionPublicKey","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"removeOverride","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_override","type":"address"}],"name":"setOverride","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_mySigningPublicKey","type":"string"}],"name":"setSigningPublicKey","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"addAttribute","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"attributes","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"signingPublicKey","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"checkEndorsementExists","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"removeAttribute","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_attributeHash","type":"bytes32"},{"name":"_endorsementHash","type":"bytes32"}],"name":"addEndorsement","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_oldhash","type":"bytes32"},{"name":"_newhash","type":"bytes32"}],"name":"updateAttribute","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"status","type":"uint256"},{"indexed":false,"name":"notificationMsg","type":"bytes32"}],"name":"ChangeNotification","type":"event"}];
    //console.log(abiArray)
    // could possibley do this this way also web3.eth.contract([ABI array goes here to make it an array]);
  functionHashes = App.getFunctionHashes(abiArray);
  // var functionHashes = getFunctionHashes(SmartIdentity.abi);
  smartID = web3.eth.contract(abi).at(contractAddress);  // redundant?
  //console.log("abi: " + abi)
  //	ethBalance.innerHTML = accounts[0];

  // updates QR code to current BTC address
  App.updateQR();
//  App.meteringFront();


  var BigNumber = require('bignumber.js');
	var i;
	var accountBalance;
	var accsLength = accs.length;

  // for metamask callback
      balanceWei = web3.eth.getBalance(currentAccount, function(error, result){
        if(!error)
          result.toNumber()
        else
          console.error(error);
      });


  var functionValue;
	var x;

// uncomment this for all accounts
	for(i = 0; i < accsLength; i++){
	    x = new BigNumber(web3.eth.getBalance(accounts[i]));
            functionValue = accounts[i];
            myDropdown.innerHTML += "Account: " + i + "<br/>" + "<a href='#' onclick='App.updateContent("+i+")'>" + accounts[i] + "</a>";
  //	    console.log(x.plus(21).toString(10));
	}
  App.accountInfo();

  encryptionKey.innerHTML = smartID.encryptionPublicKey({from: steffen.address});

  var smartIDadd = '0x9b0820f41b9c29f5e43a6b8ea5b33b31fb62f42e';
//  var smartIDtest = web3.eth.contract(smartID.abi).at(smartIDadd); // can probably set the address globally

  //smartIDtest.new();

  // gas set depending on dev environment.
//  SmartIdentity.new({from: steffen.address, gas: 4712388});
//SmartIdentity.new({from: '0xa7d455fe00228e9bb08238087fe81ff385e71fe4'});

// check following gas level for live deploy

/*
SmartIdentity.new({from: steffen.address, gas: 4712388})
  .then(function(data) {
    steffen.identify = data;
  })
*/

  App.showBtn('frontPage')
//      self.refreshBalance();
    });
  },

  // *** functions start *** ///

  // generate QR code from BTC address, node js QR code generator.
    updateQR: function(){
//    console.log(btcQR)
    btcQR = smartID.getBTC.call();
//    console.log(btcQR)
    var qr = require('qr-image');
    var svg_string = qr.imageSync(btcQR, { type: 'svg', size: 5});
    document.getElementById('qrcode').innerHTML = svg_string;
  },

// testing functions
  smartContractNew: function(){
    SmartIdentity.new({from: steffen.address, gas: 4712388})
      .then(function(data) {
        steffen.identify = data;
      })
    console.log("new smartID contract issued: " + steffen.identify)
//    console.log('Eth? ' + web3.eth.getTransaction("0xa4b4417fc7e492b911d08e948ea50ca772b82516"));
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
// then add them to user by somethign like   smartID.addAttribute(hash1, {from: owner});
    this.setStatus("Initiating transaction... (please wait)");

    var self = this;
    var smart;
    SmartIdentity.deployed().then(function(instance) {
      smart = instance;
//      return smart.setEncryptionPublicKey(newKey, {from: account});
//      return smart.addAttribute(attribute, {from: currentAccount, gas: 22850})
        return smart.addAttribute(attribute, {from: currentAccount, gas: 244487});
    }).then(function(value) {
//      this.setStatus("Transaction complete");
        self.setStatus("Transaction complete, Device Added");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error; see log.");
    });

// from output works.
//    console.log("attribute added: " +  attribute)
    // it adds the attribute. need return value...

    // following updates our visual eth balance top of page...

    // for metamask callback

    /*
        balanceWei = web3.eth.getBalance(currentAccount, function(error, result){
          if(!error)
            result.toNumber()
          else
            console.error(error);
        }); */

      balanceWei = web3.eth.getBalance(currentAccount).toNumber();
      balance = web3.fromWei(balanceWei, 'ether'); // balance in eth.
      accounNr.innerHTML = currentAccount;
      ethBalance.innerHTML = balance + " Ether";  // what?
  },


  // BTC address add function. Need to add input field for this....
  addBitCoinAddress: function(){
    var btcValue = document.getElementById("inputBTC").value;
    var self = this;
    var smart;
    SmartIdentity.deployed().then(function(instance) {
      smart = instance;
//      return smart.setEncryptionPublicKey(newKey, {from: account});

        return smart.setBTC(btcValue, {from: currentAccount})
//        return smart.addBTC(btcValue, {from: currentAccount})

//      return smart.addBTC2(btcValue, {from: currentAccount})
    }).then(function(value) {
//      this.setStatus("Transaction complete");
        self.setStatus2("Transaction complete, BTC added");
        //btcStatus.innerHTML = smart.getBTC.call();
  //      console.log(inputData);
  //      console.log(smart.addBTC({from: currentAccount}))
    }).catch(function(e) {
      console.log(e);
      self.setStatus2("Error; see log.");
    });
//    console.log(smart.getBTC());
  console.log("button works");
  },

  firstBlock: function(){
    // looing for first block to position
    //  var test =  web3.eth.getTransaction('0xa0a881de25dddaf26dbe2f2c57d798bfdcb7693a55d4595318540410c3bec19d')
    //  var test = web3.eth.getTransactionFromBlock('10');
    //0xa0a881de25dddaf26dbe2f2c57d798bfdcb7693a55d4595318540410c3bec19d
    //  console.log(test);

    var func = App.findFunctionByHash(functionHashes, test.input);
    var inputData = SolidityCoder.decodeParams(["bytes32"], t.input.substring(10)); // issue is probably here... because its substring...
    console.log(web3.toAscii(inputData[0].toString()));
  },

  checkBlock: function(){
    // looing for first block to position
    // no good.. But we need to scan all blocks here...
    /*var oneBlock = web3.eth.getBlock('earliest');
    console.log('block # ' + oneBlock.blockNumber);
    var index = 0;


    var t = oneBlock.transactions[index];

    var from = t.from;
    console.log("from " + from)*/

    // This does block transaction.... still need to read the input....
    // probably have to do our t = block transaction thing here.

    // we should also add a pending... that way we can see transactions in progress..

    // also add a filer.stopWatching()....
//    probably something like filter('fromblock:0' , "toblock:"latest")

// uncomment below
//var filter = web3.eth.filter({fromBlock:0, toBlock: 'latest'});
//filter.get(function(error, result){ console.log(error, result); });

// we need to get input data from transaction from block...
//var str = web3.eth.getTransactionFromBlock('10');
//var test = web3.toAscii(str)

//  console.log(str.input)

  },

  remAttribute: function(){

    var attribute = document.getElementById("addAttribute").value;

    this.setStatus("Initiating transaction... (please wait)");

    var self = this;
    var smart;
    SmartIdentity.deployed().then(function(instance) {
      smart = instance;
//      return smart.setEncryptionPublicKey(newKey, {from: account});
      return smart.removeAttribute(attribute, {from: currentAccount})
    }).then(function(value) {
//      this.setStatus("Transaction complete");
        self.setStatus("Device removed");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting; see log.");
    });
    console.log("Removing device")
  },



  showAllDevices: function(){
    console.log("Filter to show all devices")
    console.log("first block to check:")
    console.log("final block to check: ")
  },


  getBTC: function(){
        console.log(smartID.getBTC.call());
  },


// btc filter
  watchFilterBTC: function(){
    var filter = web3.eth.filter('latest');

      filter.watch(function(error, result){
          var block = web3.eth.getBlock(result, true);
          console.log('block #' + block.number);
          console.dir(block.transactions);

          for (var index = 0; index < block.transactions.length; index++) {
            var t = block.transactions[index];
            var from = t.from;
            var to = t.to;
            var func = App.findFunctionByHash(functionHashes, t.input);

            if (func == 'setBTC') {
              var inputData = SolidityCoder.decodeParams(["string"], t.input.substring(10)); // issue is probably here... because its substring...
              console.dir(inputData);
              BTCshow.innerHTML = inputData;
              console.log(inputData);
            } else if (func != 'setBTC') {
              console.dir("Not working, try again")
            } else {
              // Default log
            }
        }
      });
  },

  watchFilter3: function(){
// this outputs some sort of json.
    var filter=web3.eth.filter({fromBlock: 0, toBlock: 'latest'});
    filter.get(function(error, log) {
      console.log(JSON.stringify(log));
    });
  },

  // this filter checks entire chain for addded devices... We need to also check for removed devices... as to not have duplicates... If removed device has larger block
  // number than added, then it should not display.
  // it does not display correct from user.. hm.
  watchFilterFromTo: function(){
    allAccounts.innerHTML = '';

    var filter=web3.eth.filter({fromBlock: 0, toBlock: 'latest'});
//    var filter=web3.eth.filter({fromBlock: 1127125, toBlock: 'latest'});  // ropsten blocks.
    filter.get(function(error, log) {
    //      console.log(JSON.stringify(log));
    // looping over data to find all block numbers. Now let us use these block nubmers to read the data.
    var data = log;
      for(var i = 0; i < data.length; i++)
      {
        var block = web3.eth.getBlock(data[i].blockNumber, true);
          for (var index = 0; index < block.transactions.length; index++) {
            var t = block.transactions[index];
            var from = t.from;
            //  console.log(t.input)
            var to = t.to;
            // Decode function
            var func = App.findFunctionByHash(functionHashes, t.input);
            if (func == 'addAttribute') {
              // This is the sellEnergy() method
              var inputData = SolidityCoder.decodeParams(["bytes32"], t.input.substring(10));
            //  console.dir(inputData);
            //  console.log("from " + from + " input data " + inputData[0].substring(0, inputData[0].toString().length - 24)) // set this to currentaccount... we we see who submitted the attribute.. wont work universally though.
            // removed the jquery to use jscript. $('#allAccounts').append(

              // this hits back to showAccountINfo, we need up update current account to whatever is clicked as well.
              allAccounts.innerHTML +=
              '<tr><td>' + t.blockNumber +
              '</td><td><a href="#" onclick="App.showBtn('+"'showAccountInfo'"+')">' + from + '</a></td><td>' + inputData[0].substring(0, inputData[0].toString().length - 24) + '</td></tr>';
            } else if (func == 'removeAttribute'){
              allAccounts.innerHTML +=
              '<tr><td><span id="red">' + t.blockNumber +
              '</td><td><span id="red">' + from + '</td><td><span id="red">' + inputData[0].substring(0, inputData[0].toString().length - 24) + '</span></td></tr>';
                  // console.log("Remove Device Function RUN ")
                  // this is where we check if remove has been run on same device...
            } else if (func != 'addAttribute') {
                //          console.dir("Function Not Add Attribute")
                // here we need a duplicate detection.
            } else {
              // Default log
            }
        }
      }
    });
    filter.stopWatching();
  },

// main watch filter to check for new additions past latest block on chain
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
//            var inputData = SolidityCoder.decodeParams(["bytes32"]ct, t.input); // issue is probably here... because its substring...

            if (func == 'addAttribute') {
              // This is the sellEnergy() method
              var inputData = SolidityCoder.decodeParams(["bytes32"], t.input.substring(10)); // issue is probably here... because its substring...
              // THIS ONE ACTUALLY DECODES THE DAMN STUFFs... // get the from.

            //  var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
              console.dir(inputData);
              console.log("from " + from + " input data " + inputData[0].substring(0, inputData[0].toString().length - 24)) // set this to currentaccount... we we see who submitted the attribute.. wont work universally though.
              /// needs to be the real from returned in the transaction..
    //          console.log(web3.toAscii(inputData[0].toString()))
              // still need to decipher the output i guess..
              console.log("to" + to) // this is to the contract. I think.

              // block count is wrong not a big deal but it adds even if block isnt updated
              $('#transactions').append('<tr><td>' + t.blockNumber +
              '</td><td>' + from + '</td><td>' + inputData[0].substring(0, inputData[0].toString().length - 24) + '</td></tr>');
//              '</td><td>' + from + '</td><td>' + t.input.substring(0, t.input.length - 24) + '</td></tr>');
              // yes we use this but not here. deviceEthereumAddress = inputData[0].substring(0, inputData[0].toString().length - 24);
              console.log("Device that has been added is : " + deviceEthereumAddress)
//                  '</td><td>' + from + '</td><td>' + t.input.substring(0, t.input.length - 24) + '</td></tr>'); -- old way. not completely right but its fine.
//                  '</td><td>Attribute: (' + web3.toAscii(inputData[0].toString()) + ')</td></tr>');
            } else if (func != 'addAttribute') {
            //  var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
    //          console.dir(inputData);
              console.dir("Not working, try again")
            } else if (func == 'removeAttribute') {

              console.log("Removing : " + deviceEthereumAddress);
              deviceEthereumAddress = "blank";
              console.log("deviceEthereumAddress is : " + deviceEthereumAddress);

            //  var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
            } else {
              // Default log
            }
        }

      });
//      filter.stopWatching();
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

  setStatus2: function(message) {
    var status = document.getElementById("statusBTC");
    statusBTC.innerHTML = message;
  },

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
      App.accountInfo();
  },

  accountList: function(){ // lists available accounts
      listAccounts.innerHTML = "";
    for(var i = 0; i<accounts.length; i++){
      listAccounts.innerHTML += "Account: " + i + " : " + accounts[i] + "<br/>";
    }
  },

  accountInfo: function(){ // accountInfo function
      accountinfo.innerHTML = "";
      //console.log(accounts[i]);
      accountinfo.innerHTML = " " + currentAccount + "<br/>";
      btcAddress.innerHTML = smartID.getBTC.call();
  },

  // metering function, a mess but works.
  meteringFront: function(){
    console.log("METERING FUNCTION UP AND RUNNING")

    var deviceAddress = '0x20aba8bd3c170ed3f5df011f31869e4ee550285b'
    var deviceAddress2 = '0xc91898d87fc09707b377cec5a5bf957dfcfccc4a';

    if(deviceAddress == '0x20aba8bd3c170ed3f5df011f31869e4ee550285b'){
      console.log('write tables');
      document.getElementById('accountDevices').innerHTML = '<table id="deviceAddressClaimed">' +
        '<tr> <th id="deviceName">Device ID: <b><span id="deviceEthereum">0x20aba8bd3c170ed3f5df011f31869e4ee550285b</span></b></th> </tr>' +
        '<tr><td><span id="meteringDevices"></span></td></tr>'+
        '<tr><td id="spacer"></td></tr>' +
        '<tr> <th id="deviceName">Device ID: <b><span id="deviceEthereum">0xc91898d87fc09707b377cec5a5bf957dfcfccc4a</span></b></th> </tr>' +
        '<tr><td><span id="meteringDevices2"></span></td></tr></table>'
    }

    for(var i = 0; i < meteringData.length; i++){
      console.log("name" + i + " : " + meteringData[i].name);

      document.getElementById("meteringDevices").innerHTML += '<table id="meteringTable">' +
        '<tr> <th> Metering Data </th><th id="devicenumber'+i+'">Not Available</th></tr>' +
        '<tr> <td> Current Tokens </td><td id="tokens'+i+'"></td></tr>' +
        '<tr> <td> Start Time </td><td id="starttime'+i+'"></td></tr>' +
        '<tr> <td> Current Time </td><td id="currenttime'+i+'"></td></tr>' +
        '<tr> <td> Missed Time </td><td id="missedtime'+i+'"></td></tr>' +
        '<tr> <td> Agreement Hash </td><td id="agreementhash'+i+'"></td></tr>' +
      '</table>'

      // converting to date.
      var utcStartTime = meteringData[i].metering_notification.start_time;
      var start = new Date(0); // The 0 there is the key, which sets the date to the epoch
      start.setUTCSeconds(utcStartTime);

      var utcCurrentTime = meteringData[i].metering_notification.current_time;
      var current = new Date(0); // The 0 there is the key, which sets the date to the epoch
      current.setUTCSeconds(utcCurrentTime);


      // converting names to readable for connected devices
      var convertName = " "

      if(meteringData[i].name == "Policy for sdr merged with sdr arm"){
        console.log("metering data name change: SDR!");
        convertName = "Software Defined Radio";
        document.getElementById("devicenumber"+i).innerHTML = convertName;
      }
      else if(meteringData[i].name == "Policy for location merged with location arm"){
        console.log("metering data name change: Location!");
        convertName = "GPS Location";
        document.getElementById("devicenumber"+i).innerHTML = convertName;
      }
      else if(meteringData[i].name == "Policy for netspeed merged with netspeed arm"){
        console.log("metering data name change: NetSpeed!");
        convertName = "Netspeed";
        document.getElementById("devicenumber"+i).innerHTML = convertName;
      }

      //      document.getElementById("devicenumber"+i).innerHTML = meteringData[i].name;
      document.getElementById("tokens"+i).innerHTML = meteringData[i].metering_notification.amount;
      document.getElementById("starttime"+i).innerHTML = start;
      document.getElementById("currenttime"+i).innerHTML = current;
      document.getElementById("missedtime"+i).innerHTML = meteringData[i].metering_notification.missed_time + " Seconds Missed";
      //      document.getElementById("agreementid").innerHTML = meteringData[0].metering_notification.agreement_hash;
      document.getElementById("agreementhash"+i).innerHTML = meteringData[i].metering_notification.agreement_hash;
      //      console.log(i);
    }

    //      document.getElementById("meteringData").innerHTML =
    //      data.amount+ " " + data.start_time+ " " + data.current_time;

    for(var i = 0; i < meteringData2.length; i++){
      console.log("name" + i + " : " + meteringData2[i].name);

      document.getElementById("meteringDevices2").innerHTML += '<table id="meteringTable">' +
        '<tr> <th> Metering Data </th><th id="2devicenumber'+i+'">Not Available</th></tr>' +
        '<tr> <td> Current Tokens </td><td id="2tokens'+i+'"></td></tr>' +
        '<tr> <td> Start Time </td><td id="2starttime'+i+'"></td></tr>' +
        '<tr> <td> Current Time </td><td id="2currenttime'+i+'"></td></tr>' +
        '<tr> <td> Missed Time </td><td id="2missedtime'+i+'"></td></tr>' +
        '<tr> <td> Agreement Hash </td><td id="2agreementhash'+i+'"></td></tr>' +
      '</table>'

      // converting to date.
      var utcStartTime = meteringData2[i].metering_notification.start_time;
      var start = new Date(0); // The 0 there is the key, which sets the date to the epoch
      start.setUTCSeconds(utcStartTime);

      var utcCurrentTime = meteringData2[i].metering_notification.current_time;
      var current = new Date(0); // The 0 there is the key, which sets the date to the epoch
      current.setUTCSeconds(utcCurrentTime);


      // converting names to readable for connected devices
      var convertName = " "

      if(meteringData2[i].name == "Policy for sdr merged with sdr arm"){
        console.log("metering data name change: SDR!");
        convertName = "Software Defined Radio";
        document.getElementById("2devicenumber"+i).innerHTML = convertName;
      }
      else if(meteringData2[i].name == "Policy for location merged with location arm"){
        console.log("metering data name change: Location!");
        convertName = "GPS Location";
        document.getElementById("2devicenumber"+i).innerHTML = convertName;
      }
      else if(meteringData2[i].name == "Policy for netspeed merged with netspeed arm"){
        console.log("metering data name change: NetSpeed!");
        convertName = "Netspeed";
        document.getElementById("2devicenumber"+i).innerHTML = convertName;
      }

      //      document.getElementById("devicenumber"+i).innerHTML = meteringData[i].name;
      document.getElementById("2tokens"+i).innerHTML = meteringData2[i].metering_notification.amount;
      document.getElementById("2starttime"+i).innerHTML = start;
      document.getElementById("2currenttime"+i).innerHTML = current;
      document.getElementById("2missedtime"+i).innerHTML = meteringData2[i].metering_notification.missed_time + " Seconds Missed";
      //      document.getElementById("agreementid").innerHTML = meteringData[0].metering_notification.agreement_hash;
      document.getElementById("2agreementhash"+i).innerHTML = meteringData2[i].metering_notification.agreement_hash;
      //      console.log(i);
      totalTokens += meteringData[i].metering_notification.amount + meteringData2[i].metering_notification.amount;
      console.log(meteringData[2].metering_notification.amount);
      console.log("total tokens: " + totalTokens);
      document.getElementById('tokens').innerHTML = totalTokens;
      tokenValue = (totalTokens / 5000)
      //console.log("Dollar Value of tokens: " +  "$" + tokenValue);
      document.getElementById('dollarValue').innerHTML = Math.round(tokenValue * 100) / 100;
    }
    //      document.getElementById("meteringData").innerHTML =
    //      data.amount+ " " + data.start_time+ " " + data.current_time;


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
