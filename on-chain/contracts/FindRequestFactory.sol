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
    uint private incentiveToRedeem;
    uint8 private findRequestState;
    string closingMessage;

    string[] private knownLocations;
    mapping(address => bool) acceptedHintsMap;
    uint acceptedHints;
    uint acceptedHintsResponses;

    struct Hint {
        string text;
        uint8 state;
        // TODO Maybe add here a posible location parameters
    }

    Hint[] private receivedHints;

    // TODO Implement this contract state
    enum FindRequestState {
      Open, // 1
      RedeemingIncentives, // 2
      RedeemingBalances, // 3
      Close // 4
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
        acceptedHints = 0;
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
        require(!compare(location, ""));
        knownLocations.push(location);
    }

    function getKnownLocations(uint knownLocationNumber) public view returns(string) {
        require(knownLocations.length > knownLocationNumber);
        return knownLocations[knownLocationNumber];
    }

    function submitHint(string _text) public payable {
        require(msg.sender != owner);
        require(!compare(_text, ""));

        Hint memory newHint = Hint(_text, 1);
        receivedHints.push(newHint);
    }

    function acceptHint(uint _hintNumber) public onlyOwner payable {
        require(receivedHints.length > _hintNumber);
        Hint storage _hint = receivedHints[_hintNumber];

        // Validates hint is not in a final state
        require(_hint.state == 1);
        _hint.state = 2; // Accepted


        // Register accepted address and increment counter
        acceptedHints++;
        acceptedHintsMap[msg.sender] = true;
    }

    function getHint(uint _hintNumber) public view onlyOwner returns(string,uint) {
        // TODO Allow approved address see hints too

        require(receivedHints.length > _hintNumber);
        Hint storage selectedHint = receivedHints[_hintNumber];
        return (
          selectedHint.text,
          uint(selectedHint.state)
        );
    }

    function rejectHint(uint _hintNumber) public onlyOwner payable {
        require(receivedHints.length > _hintNumber);
        Hint storage _hint = receivedHints[_hintNumber];

        // Validates hint is not in a final state
        require(_hint.state == 1);
        _hint.state = 3; // Rejected
    }

    function closeFinding(string finalText) public payable onlyOwner {
        require(findRequestState == 1); // 1 = Open

        // TODO Pay gas cost of all Hints received (accepted or not)

        // Calculate max incentive to Redeem (90% of total incentive stored)
        uint totalIncentiveToRedeem = SafeMath.div(SafeMath.mul(this.balance, 90), 100);

        // Verify that there is any accepted hints
        if (acceptedHints > 0) {
            // Change state to RedeemingIncentives (code: 2)
            findRequestState = 2;
            incentiveToRedeem = SafeMath.div(totalIncentiveToRedeem, acceptedHints);
        } else {
            // Change state to RedeemingBalances (code: 3)
            findRequestState = 3;
        }

        // Set the closing message
        closingMessage = finalText;
    }

    function redeemIncentive() public payable onlyHinter {
        require(findRequestState == 2); // 2 = RedimingIncentives
        require(acceptedHintsMap[msg.sender]);

        // Transfer incentive money to acceptedHints address
        msg.sender.transfer(incentiveToRedeem);

        // Remove address from acceptedHintsMap and record the response
        acceptedHintsMap[msg.sender] = false;
        acceptedHintsResponses++;

        // Check if all accepted hints responses were recorder
        if (acceptedHintsResponses == acceptedHints) {
            findRequestState = 3; // 3 = RedimingBalances
        }
    }

    function rejectIncentive() public payable onlyHinter {
        require(findRequestState == 2); // 2 = RedimingIncentives
        require(acceptedHintsMap[msg.sender]);

        // Remove address from acceptedHintsMap and record the response
        acceptedHintsMap[msg.sender] = false;
        acceptedHintsResponses++;
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
