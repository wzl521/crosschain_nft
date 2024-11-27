// 本地网络测试
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { expect } = require("chai")

let firstAccount
let nft
let wnft
let nftPoolLockAndRelease
let nftPoolBurnAndMint
let chainSelector
let ccipLocalSimulator

before(async function () {
    firstAccount = (await getNamedAccounts()).firstAccount //getNamedAccounts()，返回一组地址
    await deployments.fixture(["all"]) // 部署全部的合约，调用deploy文件夹下的所有合约部署脚本
    nft = await ethers.getContract("MyToken", firstAccount) // 获取合约实例
    wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount)
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount)
    ccipLocalSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount)
    const config = await ccipLocalSimulator.configuration()
    chainSelector = config.chainSelector_
})

// sourcechain -----> destchain
describe("sourcechain -----> destchain tests",
    async function () {
        it("test if user can mint a nft from nft contract successfully",
            async function () {
                // get nft
                await nft.safeMint(firstAccount)
                // check the owner
                const ownerOfNft = await nft.ownerOf(0)
                expect(ownerOfNft).to.equal(firstAccount)
            })
        it("test if user can lock the nft in the  pool and send ccip message on source chain",
            async function () {
                await ccipLocalSimulator.requestLinkFromFaucet(nftPoolLockAndRelease.target, ethers.parseEther("10"))

                // lock and send with CCIP
                await nft.approve(nftPoolLockAndRelease.target, 0)
                await nftPoolLockAndRelease.lockAndSendNFT(0, firstAccount, chainSelector, nftPoolBurnAndMint.target)

                // check if owner of nft is pool's address
                const newOwner = await nft.ownerOf(0)
                console.log("test")
                expect(newOwner).to.equal(nftPoolLockAndRelease.target)
            })
        // check if the wnft is owned by new owner
        // 如果目标链上已收到ccip消息，则wnft的ownerOf())则不为空，并且为源链上的地址
        it("test if user can get a wrapped nft in destchain",
            async function () {
                const newOwner = await wnft.ownerOf(0)
                expect(newOwner).to.equal(firstAccount)
            }
        )
    })

describe("destchain -----> sourcechain tests",
    async function () {
        it("test if user can burn the wnft and send ccip message on destchain",
            async function () {
                // fund some Link tokens
                ccipLocalSimulator.requestLinkFromFaucet(nftPoolBurnAndMint.target, ethers.parseEther("10"))

                // grant permission
                await wnft.approve(nftPoolBurnAndMint.target, 0)

                // transfer the token
                await nftPoolBurnAndMint.burnAndMint(0, firstAccount, chainSelector, nftPoolLockAndRelease.target)
                const wnftTotalSupply = await wnft.totalSupply()
                expect(wnftTotalSupply).to.equal(0)
            }
        )
        it("test if user have hte nft unlocked on sourcechain",
            async function () {
                const newOwner = await nft.ownerOf(0)
                expect(newOwner).to.equal(firstAccount)
            }
        )
    }
)