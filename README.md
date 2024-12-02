# 从0到1实现一个跨链应用
# CCIP跨链原理
![](https://cdn.jsdelivr.net/gh/wzl521/my_images/img/202412020923515.png)

# 跨链功能
构建ERC721合约，使得该合约从Sepolia链上跨链到Linea链上，并实现NFT的锁定和释放、销毁和铸造功能。

# 合约功能说明
Sepolia区块链：
1. ERC-721合约：MyToken.sol，所需的NFT主合约
2. NFTPoolLockAndRelease合约：锁定用户合约，执行跨链操作，在Linea区块链上铸造一个新的NFT

Linea区块链：
1. 包装的ERC-721合约：WrappenMyToken.sol,铸造NFT，NFT的主合约在Sepolia链上，Linea链上的NFT合约需要先进行铸造
2. NFTPoolBurnAndMint合约：通过ccipReceive 来接受跨链消息，然后基于消息内容铸造NFT，同时在Linea中的NFT跨链到Sepolia链上时，将Linea链上的NFT销毁

CCIPLocalSimulator.sol: 模拟跨链消息，用于测试
# 使用步骤
1. 安装依赖： `npm install` 
2. 添加env-enc配置信息：
```shell
npx env-enc set-pw
npx env-enc set
```
依次添加以下环境变量:
```shell
PRIVATE_KEY
ETHERSCAN_API_KEY
SEPOLIA_RPC_URL
LINEA_SEPOLIA_RPC_URL
```
3. sourcechain部署合约（Sepolia测试网）:`npx hardhat deploy --network sepolia --tags sourcechain`
4. destchain部署合约（Linea测试网）:`npx hardhat deploy --network linea --tags destchain`
5. sourechain 铸造nft：`npx hardhat mint-nft --network sepolia`
6. sourechain 查询nft：`npx hardhat check-nft --network sepolia`
7. sourechain锁定并且跨链nft： `npx hardhat lock-and-cross --network sepolia --tokenid 0`
8. destchain查看wrapped NFT状态： `npx hardhat check-wnft --network linea`
9. destchain燃烧并且跨链wnft： `npx hardhat burn-and-cross --network linea --tokenid 0`
10. sourechain 查询nft：`npx hardhat check-nft --network sepolia`

# 单元测试命令
```shell
npx hardhat test
```

# 初始化一个hardhat项目
```shell
npm init  (npm init -y)
npm install hardhat --save-dev (npm install hardhat -D)
npx hardhat init
```

# 项目所需依赖
```shell
npm install -D @openzeppelin/contracts
npm install -D @chainlink/contracts-ccip
npm install -D @nomicfoundation/hardhat-ethers ethers hardhat-deploy hardhat-deploy-ethers
npm install -D @chainlink/local
npm install -D @chainlink/env-enc
```

