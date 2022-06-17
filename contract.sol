//I want to create a smart contract for supply chain management

//SPDX-License-Identifier: MIT
pragma solidity 0.8.7; //This specifies the version of solidity we wanna use

//This handles the main contract
contract supply_chain {
    address payable owner;
    
    //This handles the structure for the various items
    struct item {
        string name;
        uint price;
        string info;
        address buyer;
    }

    mapping(uint => item) public items;
    uint private counter = 0;

    //This function handles the verification of the contract's ownership
    modifier verify_owner {
        require(msg.sender == owner, "Permission denied!");
        _;
    }

    //This function handles the checking if the payment is sufficient
    modifier verify_payment(uint _price) {
        require(msg.value >= _price, "Insufficient funds!");
        _;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    //This function handles the adding of items
    function add_item(string memory _name, uint _price, string memory _info) public verify_owner {
        items[counter] = item(_name, _price, _info, address(0));
        counter ++;
    }

    //This function handles the buying of items
    function buy_item(uint _id) public payable verify_payment(msg.value) {
        owner.transfer(msg.value);
        items[_id].buyer = msg.sender;
    }

    //This function doesn't alter the state of the blockchain and therefore doesn't incur gas
    function retrieve_item(uint _id) public view returns (item memory) { 
        return items[_id];
    }
}