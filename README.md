# Notes for the reviewers
To run the app:

```
yarn
yarn start
```

### Dependencies used:
- `react-router-dom` for routing
- `tailwindcss` fro styling
- `react-icons` for icons
- `lightweight-charts` for the token price chart
- `react-sparklines` for displaying sparkline data for the past 7 days
- `ethers.js` to interact with web3

### API's used:
- `Coin Gecko` for getting market data and token details
- `Ethplorer` for getting the token balance from the wallet address

### Functionalities:
- Dark and light theme working
- Sorting table for all columns, except last 7 days
- Charts can been seen, by clicking sparkline or accessing the coin url
- Wallet tab displaying network error if app not connected to Energi Mainnet
- Wallet tab displays total ENG balance and value
- If user has some tokens on Metamask Mainnet, a table will display the tokens and balances

### Challenges

I faced some problems with getting the balance from Energi token from my wallet. Sometimes the getEnergiTokenBalance function worked, but sometimes not. When changing the token address to one from another erc20Token, the function always worked out.

I was running out of time to debug it, so it's possible that this function is not 100% correct or it is something with calling the balanceOf method from the proxy contract.

Anyways, really enjoyed the test and thanks for the opportunity!




# Energi Frontend Challenge :muscle:

Hi!

Welcome to the Energi Frontend Challenge. All the information you need can be found in #1

Do your best, we are looking forward to seeing what you can do!

The Energi Tech Team
