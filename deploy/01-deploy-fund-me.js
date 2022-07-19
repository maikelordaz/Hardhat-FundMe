/*
 * Importo un archivo creado por mi con todas las redes que quiera, el archivo es:
 * helper-hardhat-config
 */
const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// getNamedAccounts, deployments son parametros de hre
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments // log son unos console log que personalizo
    const { deployer } = await getNamedAccounts() // cuentas que pongo en el hardhat.config
    const chainId = network.config.chainId

    /*
     * Esta linea me guarda en una variable llamada ethUsdPriceFeedAddress la direccion del
     * oraculo segun la red que haga el deploy. Pero si hago el deploy a una red local como
     * hardhat necesito un mock que es un contrato con lo minimo necesario para que mi codigo
     * funcione. Su deploy lo hago en el 00 de la carpeta deploy
     */
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy(
        "FundMe" /*El nombre del contrato a hacer deploy*/,
        {
            from: deployer, // el que hace deploy
            args: [ethUsdPriceFeedAddress],
            log: true, // console.logs personalizados
            /* espero el deploy para verificar, importante que el "o", "or", "||" sea 1, si
             * espero demasiado, en los test se va a quedar esperando y siempre va a superar el
             * tiempo y me van a fallar los test, diciendome que supero el tiempo
             */
            waitConfirmations: network.config.blockConfirmations || 1,
        }
    )
    log(`FundMe deployed at ${fundMe.address}`)
    log("-------------------------------------")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"]
