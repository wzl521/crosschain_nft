const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")

task("lock-and-cross")
    .addParam("tokenid", "tokenId to be locked and crossed")// addParam必选参数，用户手动添加
    .addOptionalParam("chainselector", "chain selector of destination chain") // addOptionalParam可选的参数，如果没提供，则使用默认值
    .addOptionalParam("receiver", "receiver in the destination chain")
    .setAction(async (taskArgs, hre) => {

        let destReceiver
        let destChainSelector


        // get tokenId from parameter
        const tokenId = taskArgs.tokenid

        const { firstAccount } = await getNamedAccounts()
        console.log(`deployer is ${firstAccount}`)

        // get receiver contract 
        // deployed contract will be used if there is no receiver provided

        if (taskArgs.receiver) {
            destReceiver = taskArgs.receiver
        } else {
            const nftBurnAndMint = await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            destReceiver = nftBurnAndMint.address
        }
        console.log(`destchain receiver is ${destReceiver}`)

        // get the chain selector of destination chain
        // deployed contract will be used if there is no chain selector provided
        if (taskArgs.chainselector) {
            destChainSelector = taskArgs.chainselector
        } else {
            destChainSelector = networkConfig[network.config.chainId].companionChainSelector
        }
        console.log(`destchain chainselector is ${destChainSelector}`)

        const linkTokenAddr = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddr)
        const nftPoolLockAndRelease = await ethers
            .getContract("NFTPoolLockAndRelease", firstAccount)

        // transfer 10 LINK token from deployer to pool
        const balanceBefore = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`nftPoolLockAndRelease balance before: ${balanceBefore}`)

        const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther("5"))
        await transferTx.wait(6)
        const balanceAfter = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`nftPoolLockAndRelease balance after: ${balanceAfter}`)

        // approve the pool have the permision to transfer deployer's token
        const nft = await ethers.getContract("MyToken", firstAccount)
        await nft.approve(nftPoolLockAndRelease.target, tokenId)
        console.log("approve successfully")

        // ccip send
        // console.log(`${tokenId}, ${firstAccount}, ${destChainSelector}, ${destReceiver}`)
        const lockAndCrossTx = await nftPoolLockAndRelease
            .lockAndSendNFT(
                tokenId,
                firstAccount,
                destChainSelector,
                destReceiver
            )

        // provide t
        console.log(`NFT locked and crossed, ccip transaction is sent,the tx hash is ${lockAndCrossTx.hash}`)
    })

module.exports = {}