# **Tapioca Audit Competition on Hats.finance** 


## Introduction to Hats.finance


Hats.finance builds autonomous security infrastructure for integration with major DeFi protocols to secure users' assets. 
It aims to be the decentralized choice for Web3 security, offering proactive security mechanisms like decentralized audit competitions and bug bounties. 
The protocol facilitates audit competitions to quickly secure smart contracts by having auditors compete, thereby reducing auditing costs and accelerating submissions. 
This aligns with their mission of fostering a robust, secure, and scalable Web3 ecosystem through decentralized security solutions​.

## About Hats Audit Competition


Hats Audit Competitions offer a unique and decentralized approach to enhancing the security of web3 projects. Leveraging the large collective expertise of hundreds of skilled auditors, these competitions foster a proactive bug hunting environment to fortify projects before their launch. Unlike traditional security assessments, Hats Audit Competitions operate on a time-based and results-driven model, ensuring that only successful auditors are rewarded for their contributions. This pay-for-results ethos not only allocates budgets more efficiently by paying exclusively for identified vulnerabilities but also retains funds if no issues are discovered. With a streamlined evaluation process, Hats prioritizes quality over quantity by rewarding the first submitter of a vulnerability, thus eliminating duplicate efforts and attracting top talent in web3 auditing. The process embodies Hats Finance's commitment to reducing fees, maintaining project control, and promoting high-quality security assessments, setting a new standard for decentralized security in the web3 space​​.

## Tapioca Overview

The Unstoppable OmniDollar Ecosystem_ Powered by LayerZero

## Competition Details


- Type: A public audit competition hosted by Tapioca
- Duration: 9 days
- Maximum Reward: $40,000
- Submissions: 42
- Total Payout: $4,120 distributed among 3 participants.

## Scope of Audit

***Scope from tap token: *
**
contracts/governance/twTAP.sol

contracts/tokens/BaseTapTokenMsgType.sol

contracts/tokens/Vesting.sol

contracts/tokens/TapTokenReceiver.sol

contracts/tokens/TapTokenSender.sol

contracts/tokens/BaseTapToken.sol

contracts/tokens/TapToken.sol

contracts/tokens/TapTokenCodec.sol

contracts/options/TapiocaOptionBroker.sol

contracts/options/oTAP.sol

contracts/options/TapiocaOptionLiquidityProvision.sol

contracts/option-airdrop/aoTAP.sol

contracts/option-airdrop/AirdropBroker.sol

contracts/option-airdrop/LTap.sol

***scope from Periph:***


contracts/pearlmit/Pearlmit.sol
contracts/pearlmit/PearlmitHash.sol

## Medium severity issues


- **Potential Issue in Vesting Contract Allows Claims Beyond Total Vested Amount**

  The `_vested` function in the Vesting contract has a critical flaw. Due to improper handling of the initial unlock logic and the absence of a maximum return value check, users can claim more than their total vested amount. For instance, if a user deposits 500,000 tokens with an initial unlock amount of 50,000, they could potentially claim around 549,000 tokens just before the vesting period ends. This issue stems from adjusting `_start` by `__initialUnlockTimeOffset`, effectively reducing the vesting duration and allowing full vesting earlier than intended. Even the fix suggested by the repository maintainers still allows users to claim tokens prematurely, especially evident in scenarios with specific token distributions like those for early supporters.


  **Link**: [Issue #39](https://github.com/hats-finance/Tapioca-0xe0b920d38a0900af3bab7ff0ca0af554129f54ad/issues/39)

## Low severity issues


- **Neglecting twAML.averageMagnitude in twTAP._releaseTap() allows attacker to monopolize governance**

  The function `twTAP._releaseTap()` only updates `twAML.totalParticipants` and neglects `twAML.averageMagnitude`, causing it to accumulate indefinitely. This oversight enables attackers to monopolize governance. It is recommended to update both values for `twAML` in `releaseTwap()`. The proposed attack scenario demonstrates how governance manipulation can occur, although its real-world likelihood is low.


  **Link**: [Issue #19](https://github.com/hats-finance/Tapioca-0xe0b920d38a0900af3bab7ff0ca0af554129f54ad/issues/19)


- **Missing isERC721Approved Check in isApprovedOrOwner Function in oTAP.sol**

  The `isApprovedOrOwner` function in `oTAP.sol` lacks a necessary check for `isERC721Approved(_ownerOf(_tokenId), _spender, address(this), _tokenId)`, which is present in a similar function in `aoTAP.sol`. Adding this check is recommended to ensure proper approval validation.


  **Link**: [Issue #25](https://github.com/hats-finance/Tapioca-0xe0b920d38a0900af3bab7ff0ca0af554129f54ad/issues/25)



## Conclusion

The Tapioca audit competition hosted by Hats.finance concluded with a nine-day public audit, offering a maximum reward of $40,000, from which $4,120 was distributed among three participants. The audit examined various smart contracts related to governance, token management, and options within the Tapioca project. Two medium-severity and several low-severity issues were identified. A critical flaw in the Vesting contract allowed claims beyond the total vested amount due to an improper vesting duration adjustment. Additionally, a low-severity issue in the `twTAP._releaseTap()` function could let attackers monopolize governance by neglecting to update `twAML.averageMagnitude`. Another minor concern was the missing `isERC721Approved` check in `oTAP.sol`. These findings reflect Hats.finance’s proactive approach to secure Web3 projects through decentralized audit competitions, ensuring high-quality security assessments while efficiently managing audit budgets by rewarding only actual vulnerability discoveries.

## Disclaimer


This report does not assert that the audited contracts are completely secure. Continuous review and comprehensive testing are advised before deploying critical smart contracts.


The Tapioca audit competition illustrates the collaborative effort in identifying and rectifying potential vulnerabilities, enhancing the overall security and functionality of the platform.


Hats.finance does not provide any guarantee or warranty regarding the security of this project. Smart contract software should be used at the sole risk and responsibility of users.

