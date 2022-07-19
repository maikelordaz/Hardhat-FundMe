const { network } = require("hardhat")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() // cuentas que pongo en el hardhat.config
    const chainId = network.config.chainId

    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE], // Los argumentos del constructor del mock
        })
        log("Mocks Deployed!")
        log("------------------------------------------------") // Solo una linea para darme cuenta cual es el final en el terminal
        log(
            "You are deploying to a local network, you'll need a local network running to interact"
        )
        log(
            "Please run `npx hardhat console` to interact with the deployed smart contracts!"
        )
        log("------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]

/*
 * Con esta ultima linea lo que logro es hacer deploys especificos usando el comando
 * yarn hardhat deploy --tags mocks
 * Asi hago deploy solo al mock
 */
