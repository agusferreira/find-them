pragma solidity ^0.4.18;

import "zos-lib/contracts/migrations/Migratable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FindRequestFactory is Ownable, Migratable {
    address[] private deployedFindRequest;
    mapping(address => bool) private deployedFindRequestMap;

    event newFindRequestCreated(address newAddress);

    function initialize(address _owner) public isInitializer("FindRequestFactory", "0")  {
      if (owner == address(0)){
        owner = _owner;
      }
    }

    function createFindRequest(uint8 _age, string _location, string _lostDate, string _description) public payable {
        require(_age < 150);
        require(!compare(_location, ""));
        require(!compare(_lostDate, ""));
        require(!compare(_description, ""));
        // Create new Find Request contract and get deployed address
        address newFindRequest = new FindRequest(msg.sender, _age, _location, _lostDate, _description);

        // Save new contract address and increment total counter
        deployedFindRequest.push(newFindRequest);
        deployedFindRequestMap[newFindRequest] = true;

        // Transfer the created contract the initial amount
        newFindRequest.transfer(msg.value);

        // Send Find Request Created event
        emit newFindRequestCreated(newFindRequest);
    }

    function distributeBalance(address donator, address beneficiaryA, address beneficiaryB) public payable onlyOwner {
        // Verify that all address are deployed by the factory
        require(deployedFindRequestMap[donator]);
        require(deployedFindRequestMap[beneficiaryA]);
        require(deployedFindRequestMap[beneficiaryB]);
        require(beneficiaryA != beneficiaryB);

        // Verify state of FindRequest constract "donator"
        FindRequest findRequestFrom = FindRequest(donator);
        require(findRequestFrom.getCurrentState() == 4); // 4 = close

        // Verify state of FindRequest constract "A"
        FindRequest findRequestA = FindRequest(beneficiaryA);
        require(findRequestA.getCurrentState() == 1); // 1 = open

        // Verify state of FindRequest constract "B"
        FindRequest findRequestB = FindRequest(beneficiaryB);
        require(findRequestB.getCurrentState() == 1); // 1 = open

        // Trigger distributeBalance on "close" contract
        findRequestFrom.executeDonationDistrubutionSystem(beneficiaryA, beneficiaryB);
    }

    function getFindRequest(uint findRequestNumber) public view returns (address) {
        require(deployedFindRequest.length > findRequestNumber);
        return deployedFindRequest[findRequestNumber];
    }

    // Return a summary tuple of relevant variables of the factory contract
    function getSummary() public view returns (address, uint, uint) {
        return (
          owner,
          address(this).balance,
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

    // Utility function to compare strings
    function compare(string a, string b) private pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }
    }
}

contract FindRequest is Ownable {
    uint8 private age;
    string private location;
    string private lostDate;
    string private description;
    address private curator;
    uint private initialIncentive;
    uint private incentiveToRedeem;
    uint8 private findRequestState;
    string private closingMessage;
    string[] private knownLocations;
    mapping(address => bool) acceptedHintsMap;
    mapping(address => bool) allowedHintsWatchers;
    uint private acceptedHints;
    uint private acceptedHintsResponses;

    struct Hint {
        string text;
        uint8 state;
        address author;
    }

    Hint[] private receivedHints;
    uint minimumTranferCost;

    // Contract States Reference
    enum FindRequestState {
      Open, // 1
      RedeemingIncentives, // 2
      RedeemingBalances, // 3
      Close, // 4
      BalanceDistributed // 5
    }

    // FindRequest constructor
    constructor(address _owner, uint8 _age, string _location, string _lostDate, string _description) public payable {
        require(_owner != address(0));
        require(_age < 150);
        require(!compare(_location, ""));
        require(!compare(_lostDate, ""));
        require(!compare(_description, ""));

        owner = _owner;
        age = _age;
        location = _location;
        lostDate = _lostDate;
        description = _description;
        curator = msg.sender;
        initialIncentive = msg.value;
        findRequestState = 1;
        acceptedHints = 0;
        minimumTranferCost = 200000;
    }

    modifier onlyCurator() {
        require(curator == msg.sender);
        _;
    }

    modifier ownerOrWatcher() {
        require(_isOwnerOrWatcher());
        _;
    }

    function getCurrentState() public view returns(uint8) {
        return findRequestState;
    }

    // Return a summary tuple of relevant variables of the factory contract
    function getSummary() public view returns(address,uint,uint,string,string,string,uint,uint,uint,uint) {
        return (
          owner,
          address(this).balance,
          age,
          location,
          lostDate,
          description,
          knownLocations.length,
          receivedHints.length,
          acceptedHints,
          acceptedHintsResponses
        );
    }

    function getCurator() public view returns(address) {
      return curator;
    }

    function getClosingMessage() public view returns (string) {
        return closingMessage;
    }

    function addKnownLocation(string _location) public payable onlyOwner {
        require(!compare(_location, ""));
        knownLocations.push(_location);
    }

    function getKnownLocations(uint knownLocationNumber) public view returns(string) {
        require(knownLocations.length > knownLocationNumber);
        return knownLocations[knownLocationNumber];
    }

    function submitHint(string _text) public payable {
        require(msg.sender != owner);
        require(!compare(_text, ""));

        Hint memory newHint = Hint(_text, 1, msg.sender);
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
        acceptedHintsMap[_hint.author] = true;
    }

    function getHint(uint _hintNumber) public view ownerOrWatcher returns(string,uint,address) {
        require(receivedHints.length > _hintNumber);
        Hint storage selectedHint = receivedHints[_hintNumber];
        return (
          selectedHint.text,
          uint(selectedHint.state),
          selectedHint.author
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
        uint totalIncentiveToRedeem = SafeMath.div(SafeMath.mul(address(this).balance, 90), 100);

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

    function redeemIncentive() public payable {
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

    function rejectIncentive() public payable {
        require(findRequestState == 2); // 2 = RedimingIncentives
        require(acceptedHintsMap[msg.sender]);

        // Remove address from acceptedHintsMap and record the response
        acceptedHintsMap[msg.sender] = false;
        acceptedHintsResponses++;

        // Check if all accepted hints responses were recorder
        if (acceptedHintsResponses == acceptedHints) {
            findRequestState = 3; // 3 = RedimingBalances
        }
    }

    function redeemBalance() public payable onlyOwner {
        require(findRequestState == 3); // 3 = RedimingBalances
        uint amountToRedeem = 0;

        // Check if the current balance (initial incentive + donations) is higher than initial incentive
        if (address(this).balance > initialIncentive) {
            // AVOID FRAUD VECTOR
            // Only transfer 90% of the initial incentive
            amountToRedeem = SafeMath.div(SafeMath.mul(initialIncentive, 90), 100);
        } else {
            amountToRedeem = address(this).balance;
        }

        // Always save this amount fix to make sure all transfers ends correctly
        if (amountToRedeem > minimumTranferCost) {
            // Transfer money to owner only if the balance covers the costs
            owner.transfer(SafeMath.sub(amountToRedeem, minimumTranferCost));
        }

        // Change state to Closed (code: 4)
        findRequestState = 4;
    }

    function rejectBalance() public payable onlyOwner {
        require(findRequestState == 3); // 3 = RedimingBalances

        // Change state to Closed (code: 4)
        findRequestState = 4;
    }

    function cancelFindRequest() public payable onlyCurator {
        // EMERGENCY FUNCION - USE ONLY DUE A CLEAR REPORT ABUSE

        // Change state to Closed (code: 4)
        findRequestState = 4;

        // Deny owner right to the contract
        owner = curator;
    }

    // The current balance is gonna be distributed when the contract
    // get the confirmation that associated sentitive data was errased
    // from the private chain or server
    function executeDonationDistrubutionSystem(address beneficiaryA, address beneficiaryB) public payable onlyOwner {
        require(findRequestState == 4); // 4 = Close
        require(beneficiaryA != address(0));
        require(beneficiaryB != address(0));
        require(beneficiaryA != beneficiaryB);

        // Verify state of FindRequest beneficiary constract "A"
        FindRequest findRequestA = FindRequest(beneficiaryA);
        require(findRequestA.getCurrentState() == 1); // 1 = open

        // Verify state of FindRequest beneficiary constract "B"
        FindRequest findRequestB = FindRequest(beneficiaryB);
        require(findRequestB.getCurrentState() == 1); // 1 = open

        // Share balance equaly between 2 other FindRequest
        if (address(this).balance > minimumTranferCost) {
            // Calculate amount to transfer
            uint amountToDonate = SafeMath.sub(address(this).balance, minimumTranferCost);
            uint amountPerBeneficiary = SafeMath.div(amountToDonate, 2);

            // Make transfers
            beneficiaryA.transfer(amountPerBeneficiary);
            beneficiaryB.transfer(amountPerBeneficiary);
        }

        // Change state to BalanceDistributed (code: 5)
        findRequestState = 5;
    }

    // Grant access to watchers
    function grantAccessToWatchHints(address watcherAddress) public payable onlyOwner {
        allowedHintsWatchers[watcherAddress] = true;
    }

    // Propper function allow deposits to the contract
    function receiveDonations() public payable {
        // TODO emit and event in each donation received
    }

    // Default anonymous function allow deposits to the contract
    function () public payable {
    }

    // Utility function to compare strings
    function compare(string a, string b) private pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }
    }

    // Utility function to check if the sender is owner or watcher
    function _isOwnerOrWatcher() private view returns(bool){
        if (owner == msg.sender) {
            return true;
        } else {
            if (allowedHintsWatchers[msg.sender] == true) {
                return true;
            }
            return false;
        }
    }
}
