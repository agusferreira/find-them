pragma solidity ^0.4.18;

// DEV Imports - just to test contract in remix
// import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";
// import "github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";
// TODO: Fix this import, do not load in remix for some reason
//import "https://github.com/zeppelinos/zos/blob/master/packages/lib/contracts/migrations/Migratable.sol";


import "zos-lib/contracts/migrations/Migratable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract FindRequestFactory is Ownable, Migratable {
    address[] private deployedFindRequest;

    event newFindRequestCreated(address newAddress);

    function initialize() public isInitializer("FindRequestFactory", "0")  {
        // Init some variables here
    }

    function createFindRequest(uint8 _age, string _location, string _lost_date, string _description) public payable {
        // TODO > put some requirements for de parameters

        // Create new Find Request contract and get deployed address
        address newFindRequest = new FindRequest(msg.sender, _age, _location, _lost_date, _description);

        // Save new contract address and increment total counter
        deployedFindRequest.push(newFindRequest);

        // Transfer the created contract the initial amount
        newFindRequest.transfer(msg.value);

        // Send Find Request Created event
        emit newFindRequestCreated(newFindRequest);
    }


    function getFindRequest(uint findRequestNumber) public view returns (address) {
        require(deployedFindRequest.length > findRequestNumber);
        return deployedFindRequest[findRequestNumber];
    }

    // Return a summary tuple of relevant variables of the factory contract
    function getSummary() public view returns (address, uint, uint) {
        return (
          owner,
          this.balance,
          deployedFindRequest.length
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
    uint8 private age;
    string private location;
    string private lost_date;
    string private description;
    address private curator;
    uint private initialIncentive;
    uint8 private findRequestState;

    string[] private knownLocations;
    hint[] private receivedHints;

    // TODO Implement this contract state
    enum FindRequestState {
      Open, // 1
      RedimingIncentives, // 2
      RedimingBalances, // 3
      Close // 4
    }

    struct hint {
        string text;
        string state;
        // TODO Maybe add here a posible location parameters
    }

    // FindRequest constructor
    constructor(address _owner, uint8 _age, string _location, string _lost_date, string _description) public payable {
        owner = _owner;
        age = _age;
        location = _location;
        lost_date = _lost_date;
        description = _description;
        curator = msg.sender;
        initialIncentive = msg.value;
        findRequestState = 1;
    }

    modifier onlyHinter() {
        _;
    }

    modifier onlyCurator() {
        require(curator == msg.sender);
        _;
    }

    function getCurrentState() public view returns(uint8) {
        return findRequestState;
    }

    // Return a summary tuple of relevant variables of the factory contract
    function getSummary() public view returns(address,uint,uint,string,string,string,uint,uint) {
        return (
          owner,
          this.balance,
          age,
          location,
          lost_date,
          description,
          knownLocations.length,
          receivedHints.length
        );
    }

    function getCurator() public view returns(address) {
      return curator;
    }

    function addKnownLocation(string location) public payable onlyOwner {
        require(!compare(location, ''));
        knownLocations.push(location);
    }

    function getKnownLocations(uint knownLocationNumber) public view returns(string) {
        require(knownLocations.length > knownLocationNumber);
        return knownLocations[knownLocationNumber];
    }

    function submitHint(string text) public payable {
        // TODO Agus
    }

    function acceptHint(uint hintNumber) public view onlyOwner returns(bool) {
        // TODO Agus
    }

    function rejecttHint(uint hintNumber) public view onlyOwner returns(bool) {
        // TODO Agus
    }

    function closeFinding(string finalText) public payable onlyOwner {
        require(findRequestState == 1); // 1 = Open
    }

    function redeemIncentive() public payable onlyHinter {
        require(findRequestState == 2); // 2 = RedimingIncentives
    }

    function rejectIncentive() public payable onlyHinter {
        require(findRequestState == 2); // 2 = RedimingIncentives
    }

    function redeemBalance() public payable onlyOwner {
        require(findRequestState == 3); // 3 = RedimingBalances
    }

    function rejectBalance() public payable onlyOwner {
        require(findRequestState == 3); // 3 = RedimingBalances
    }

    function cancelFindRequest() public payable onlyCurator {

    }

    // Default function to withdraw balance from factory contract
    // function withdraw(uint amount) public onlyOwner returns(bool) {
    //     require(amount <= address(this).balance);
    //     owner.transfer(amount);
    //     return true;
    // }

    function receiveDonations() public payable {
    }

    // Default anonymous function allow deposits to the contract
    function () public payable {
    }

    // Utility function to compare strings
    function compare(string a, string b) internal returns (bool) {
        if(bytes(a).length != bytes(b).length) {
          return false;
        } else {
          return keccak256(a) == keccak256(b);
        }
    }
}
