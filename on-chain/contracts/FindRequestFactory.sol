pragma solidity ^0.4.18;

// DEV Imports - just to test contract in remix
//import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";
//import "github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";
// TODO: Fix this import, do not load in remix for some reason
//import "https://github.com/zeppelinos/zos/blob/master/packages/lib/contracts/migrations/Migratable.sol";


import "zos-lib/contracts/migrations/Migratable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract FindRequestFactory is Ownable, Migratable {
    address[] private deployedFindRequest;
    uint private findRequestCount;

    event newFindRequestCreated(address newAddress);

    function initialize() public isInitializer("FindRequestFactory", "0")  {
      findRequestCount = 0;
    }

    // TODO: Complete this funtion with init FindRequest parameters
    function createFindRequest() public payable {
        // Create new Find Request contract and get deployed address
        address newFindRequest = new FindRequest();

        // Save new contract address and increment total counter
        deployedFindRequest.push(newFindRequest);
        findRequestCount = deployedFindRequest.length;

        // Transfer the created contract the initial amount
        newFindRequest.transfer(msg.value);

        // Send Find Request Created event
        emit newFindRequestCreated(newFindRequest);
    }


    function getFindRequest(uint findRequestNumber) public view returns (address) {
        require(findRequestCount > findRequestNumber);
        return deployedFindRequest[findRequestNumber];
    }

    // Return a summary tuple of relevant variables of the factory contract
    function getSummary() public view returns (address, uint, uint) {
        return (
          address(this.owner),
          address(this).balance,
          findRequestCount
        );
    }

    // Default function to withdraw balance from factory contract
    function withdraw(uint amount) public onlyOwner returns(bool) {
        require(amount <= address(this).balance);
        owner.transfer(amount);
        return true;
    }

    // Default anonymous function allow deposits to the contract
    function () public payable {
    }
}

contract FindRequest is Ownable {
      // TODO: Here put the main contract code
}
