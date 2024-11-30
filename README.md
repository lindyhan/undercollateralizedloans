# Undercollaterelized DeFi loans
Yes, it is possible.

### The logic
DeFi loans are typically overcollateralized. ie You have to borrow less than the value of your collateral. 
For example, if you put $100 value as collateral, the amount you can borrow must be less than $100 
(maybe $30-95, depending on the risk profile of the token you borrow). It doesn't make sense to do that 
if you are **lacking capital**, which is the usual case in TradFi (eg 10% downpayment for a car). 

People who borrow 
in DeFi are people who **already have capital but want more capital** (eg. deposit $100, borrow $80, result: $180 to invest), 
and people who **already have capital and want exposure to a more volatile asset as well** (eg. deposit $100 USDC, borrow $30 PEPE, 
result: preserve capital while enjoying short term upside of another risky asset).

**Nobody will lend you more than what they hold as collateral because they have no assurance that you will honor the debt.**

### DeFi vs TradFi
Then why is it possible in TradFi? The key difference is that in TradFi borrowing, the lender has your collateral **as well as 
lien to the underlying asset (the house / car / business that you are borrowing for)**. The lender isn't simply dishing out cash with 
no backup. Whereas in DeFi lending, it is. Think about it this way: the lender has your 10% deposit as well as 100% of your house if 
you vanish. That's 110%. Isn't that the same as DeFi - overcollateralized?

### The Solution
So we do the same as they do in TradFi - the lender controls the collateral as well as the underlying/borrowed asset, 
while the borrower can enjoy the upside of both collateral and underlying/borrowed asset (they'll have to weigh expected gains against 
the loan interest, of course).

### TLDR
- User deposits USDe (eg 100 USDe)
- This 100 USDe goes to Ethena staking contract
- Representative token sUSDe is kept by platform  (1st pass yield)
- Platform supplies USDC to Aave or whatever other yield platform (eg 1000 USDC)
- Representative token aEthUSDC is kept by platform (2nd pass yield)
- When User closes loan position, sUSDe and aEthUSC are exchanged back for USDe and USDC respectively
- Both USDe and USDC are in higher amounts than the original
- Platform calculates additional yield minus borrowing costs and sends this to User
  

### Watch example flow (sound on):

https://github.com/user-attachments/assets/dd803a5e-c208-4c10-90ca-ec9dfdfbd608

### Etherscan (deposit flow)
<img src = https://github.com/user-attachments/assets/7c58228d-f4c3-4ecf-a48b-b4f8a0a713d3 width=750>


### Notes
Here we deal with USDe and USDC, both stablecoins. If either one or both of the collateral and the borrowed token 
is a non-stablecoin, it introduces more risk parameters and there will be the need for a more complicated algo to manage the 
position for collateral call and liquidation trigger.

### Future development
- This platform can be expanded to work with any number of other DeFi protocols, in the same logic. Opportunities other than money markets: 
Liquidity pools, staking/restaking, RWAs etc. Whatever yield the other platforms provide is combined with Ethena yield.
- Looping is possible too. Deposit USDe for 10x Aave position, use that USDC supply to borrow ETH from Aave to restake in EtherFi,
use eETH to supply liquidity in Uniswap etc etc. All representative tokens held by our platform.
