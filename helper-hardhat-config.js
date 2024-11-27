developmentChains = ["hardhat", "localhost"]
const networkConfig = {
    11155111: {
        name: "sepolia",
        router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        companionChainSelector: "5719461335882077547"
    },
    59141: {
        name: "linea",
        router: "0xB4431A6c63F72916151fEA2864DBB13b8ce80E8a",
        linkToken: "0xF64E6E064a71B45514691D397ad4204972cD6508",
        companionChainSelector: "16015286601757825753"
    }

}
module.exports = {
    developmentChains,
    networkConfig
}