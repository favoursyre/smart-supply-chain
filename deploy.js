//I want to create a deploy script for the supply chain smart contract

//Useful librabries that I would be working with -->
const ethers = require("ethers") //This imports the ether
const fs = require("fs")
require("dotenv").config() //This imports the env 

//Declaring the neccessary variable
//This function would handle the illustration for Alchemy
async function alchemy_node() {
    console.log("Alchemy Node \n")

    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC) 
    const wallet = new ethers.Wallet(process.env.ALCHEMY_KEY, provider) //This connects the provider with the wallet private key
    
    const abi = fs.readFileSync("./contract_sol_supply_chain.abi", "utf8")
    const binary = fs.readFileSync(
        "./contract_sol_supply_chain.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

    //This handles the deployment of the contract
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    const deploymentReceipt = await contract.deployTransaction.wait(1)
    //console.log(`Contract details`, contract)
    
    //console.log(`Contract deployed to ${contract.address}`)
    console.log(`Deployment Receipt`, deploymentReceipt)
    console.log("")
    console.log("Contract deploy transaction", contract.deployTransaction)

    //Accessing the various functions of the contract
    console.log("\n")
    console.log("Accessing the contract functions")
    await contract.add_item("wood", ethers.utils.parseEther("0.01"), "enugu tree forest")
    await contract.add_item("lead", ethers.utils.parseEther("0.05"), "anambra lead company")
    await contract.add_item("pencil", ethers.utils.parseEther("0.1"), "nnewi pencil company")
    
    let _items = await contract.retrieve_item(0)
    console.log(`Item1: ${_items}`)
}

//This function handles the main deploying function
async function deploy_contract() {
    console.log("Ether.JS \n")

    //Calling the Alchemy function
    await alchemy_node()
}

//This handles the callback for the main function
deploy_contract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })