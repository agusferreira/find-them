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

    function createFindRequest(uint8 _age, string _location, string _lostDate, string _description) public payable {
        // TODO > put some requirements for de parameters

        // Create new Find Request contract and get deployed address
        address newFindRequest = new FindRequest(msg.sender, _age, _location, _lostDate, _description);

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
    string private lostLocation;
    string private lostDate;
    string private description;
    address private curator;
    uint private initialIncentive;
    string private state;

    string[] private knownLocations;
    hint[] private receivedHints;

    struct hint {
        string text;
        string state;
        // TODO Maybe add here a posible location parameters
    }

    // FindRequest constructor
    constructor(address _owner, uint8 _age, string _location, string _lostDate, string _description) public payable {
        owner = _owner;
        age = _age;
        lostLocation = _location;
        lostDate = _lostDate;
        description = _description;
        curator = msg.sender;
        initialIncentive = msg.value;
        state = 'OPEN';
        // Posible states: OPEN, REDEMING_INCENTIVES, REDEMING_BALANCE, CLOSE
    }

    modifier onlyHinter() {
        _;
    }

    modifier onlyCurator() {
        _;
    }

    function getCurrentState() public view returns(string) {
        return state;
    }

    // Return a summary tuple of relevant variables of the factory contract
    function getSummary() public view returns(address,uint,uint,string,string,string) {
        return (
          owner,
          this.balance,
          age,
          lostLocation,
          lostDate,
          description
        );
    }

    function getCurator() public view returns(address) {
      return curator;
    }

    function addKnownLocation(string location) public payable {

    }

    function getKnownLocations(uint knownLocationNumber) public view returns(string) {
        require(knownLocations.length > knownLocationNumber);
        return knownLocations[knownLocationNumber];
    }

    function submitHint(string text) public payable {

    }

    function acceptHint(uint hintNumber) public view onlyOwner returns(bool) {

    }

    function rejecttHint(uint hintNumber) public view onlyOwner returns(bool) {

    }

    function closeFinding(string finalText) public payable onlyOwner {

    }

    function redeemIncentive() public payable onlyHinter {

    }

    function rejectIncentive() public payable onlyHinter {

    }

    function redeemBalance() public payable onlyOwner {

    }

    function rejectBalance() public payable onlyOwner {

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
}
