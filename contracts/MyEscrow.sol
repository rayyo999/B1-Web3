// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/escrow/Escrow.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyEscrow is Escrow {
    event Deposit(
        address indexed operator,
        uint256 weiAmount,
        uint8 accountType
    );
    event Withdraw(
        address indexed operator,
        uint256 weiAmount,
        uint8 accountType
    );
    event GiveBonus(address indexed recipient, uint256 bonus);

    address ERC20Address;
    address private _owner;

    // uint256 interestRate_DD = 50; //5%
    // uint256 interestRate_FD_30 = 100; //10%
    // uint256 interestRate_FD_60 = 200; //20%
    // uint256 interestRate_FD_90 = 300; //30%
    uint256 public interestRate_DD = 1000;
    uint256 public interestRate_FD_30 = 2000;
    uint256 public interestRate_FD_60 = 3000;
    uint256 public interestRate_FD_90 = 4000;
    uint256 oneYear = 365 days;

    struct depositorInfo {
        uint256 amounts;
        uint256 lastTimeOperate;
        uint256 createTime;
    }
    //demandDepositAccounts
    mapping(address => depositorInfo) private _deposits;
    //fixedDepositAccounts
    mapping(address => depositorInfo) private _deposits_FD_30;
    mapping(address => depositorInfo) private _deposits_FD_60;
    mapping(address => depositorInfo) private _deposits_FD_90;
    //allDepositors
    address[] depositors;

    modifier OnlyOwner() {
        require(msg.sender == _owner, "You are not allow to call!");
        _;
    }

    constructor(address _ERC20Address) {
        _owner = msg.sender;
        ERC20Address = _ERC20Address;
    }

    //DD
    function depositsOf_DD() public view returns (uint256) {
        depositorInfo storage depositor = _deposits[msg.sender];
        return _checkDeposits(depositor, interestRate_DD);
    }

    //FD
    function depositsOf_FD_30() public view returns (uint256) {
        depositorInfo storage depositor = _deposits_FD_30[msg.sender];
        return _checkDeposits(depositor, interestRate_FD_30);
    }

    function depositsOf_FD_60() public view returns (uint256) {
        depositorInfo storage depositor = _deposits_FD_60[msg.sender];
        return _checkDeposits(depositor, interestRate_FD_60);
    }

    function depositsOf_FD_90() public view returns (uint256) {
        depositorInfo storage depositor = _deposits_FD_90[msg.sender];
        return _checkDeposits(depositor, interestRate_FD_90);
    }

    //createTime
    function createTime_DD() public view returns (uint256) {
        depositorInfo storage depositor = _deposits[msg.sender];
        return depositor.createTime;
    }

    function createTime_FD_30() public view returns (uint256) {
        depositorInfo storage depositor = _deposits_FD_30[msg.sender];
        return depositor.createTime;
    }

    function createTime_FD_60() public view returns (uint256) {
        depositorInfo storage depositor = _deposits_FD_60[msg.sender];
        return depositor.createTime;
    }

    function createTime_FD_90() public view returns (uint256) {
        depositorInfo storage depositor = _deposits_FD_90[msg.sender];
        return depositor.createTime;
    }

    //deposit
    function deposit_DD(uint256 amount) public payable {
        depositorInfo storage depositor = _deposits[msg.sender];
        _deposit(depositor, amount, interestRate_DD, 1);
    }

    function deposit_FD_30(uint256 amount) public payable {
        depositorInfo storage depositor = _deposits_FD_30[msg.sender];
        _deposit(depositor, amount, interestRate_FD_30, 2);
    }

    function deposit_FD_60(uint256 amount) public payable {
        depositorInfo storage depositor = _deposits_FD_60[msg.sender];
        _deposit(depositor, amount, interestRate_FD_60, 3);
    }

    function deposit_FD_90(uint256 amount) public payable {
        depositorInfo storage depositor = _deposits_FD_90[msg.sender];
        _deposit(depositor, amount, interestRate_FD_90, 4);
    }

    //withdraw
    function withdraw_DD(uint256 amount) public {
        depositorInfo storage depositor = _deposits[msg.sender];
        require(depositor.lastTimeOperate > 0, "Haven't deposit yet !");
        require(amount > 0, "You are wasting gas for withdrawing nothing !");
        _withdraw(depositor, amount, interestRate_DD, 1);
    }

    function withdraw_FD_30() public {
        depositorInfo storage depositor = _deposits_FD_30[msg.sender];
        require(depositor.lastTimeOperate > 0, "Haven't deposit yet!");
        require(
            depositor.createTime + 30 days <= block.timestamp,
            "It's locked !"
        );
        _withdraw(depositor, 0, interestRate_FD_30, 2);
    }

    function withdraw_FD_60() public {
        depositorInfo storage depositor = _deposits_FD_60[msg.sender];
        require(depositor.lastTimeOperate > 0, "Haven't deposit yet!");
        require(
            depositor.createTime + 60 days <= block.timestamp,
            "It's locked !"
        );
        _withdraw(depositor, 0, interestRate_FD_60, 3);
    }

    function withdraw_FD_90() public {
        depositorInfo storage depositor = _deposits_FD_90[msg.sender];
        require(depositor.lastTimeOperate > 0, "Haven't deposit yet!");
        require(
            depositor.createTime + 90 days <= block.timestamp,
            "It's locked !"
        );
        _withdraw(depositor, 0, interestRate_FD_90, 4);
    }

    function _checkDeposits(depositorInfo storage depositor, uint256 rate)
        internal
        view
        returns (uint256)
    {
        if (depositor.lastTimeOperate == 0) {
            return 0;
        }
        return updateDeposits(depositor, rate);
    }

    function _deposit(
        depositorInfo storage depositor,
        uint256 amount,
        uint256 rate,
        uint8 accountType
    ) internal {
        bool success = IERC20(ERC20Address).approve(msg.sender, amount);
        require(success, "approval fail");
        if (
            _deposits[msg.sender].lastTimeOperate == 0 &&
            _deposits_FD_30[msg.sender].lastTimeOperate == 0 &&
            _deposits_FD_60[msg.sender].lastTimeOperate == 0 &&
            _deposits_FD_90[msg.sender].lastTimeOperate == 0
        ) {
            depositors.push(msg.sender);
        }
        if (depositor.createTime == 0) {
            depositor.createTime = block.timestamp;
        }
        if (depositor.lastTimeOperate == 0) {
            depositor.amounts = amount;
        } else {
            depositor.amounts = updateDeposits(depositor, rate) + amount;
        }
        depositor.lastTimeOperate = block.timestamp;
        IERC20(ERC20Address).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount, accountType);
    }

    function _withdraw(
        depositorInfo storage depositor,
        uint256 amount,
        uint256 rate,
        uint8 accountType
    ) internal {
        if (amount > 0) {
            uint256 balance = updateDeposits(depositor, rate) - amount;
            require(balance >= 0, "No enough money to withdraw !");
            depositor.amounts = balance;
        } else {
            amount = updateDeposits(depositor, rate);
            depositor.amounts = 0;
            depositor.createTime = 0;
        }
        depositor.lastTimeOperate = block.timestamp;
        IERC20(ERC20Address).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, amount, accountType);
    }

    function updateDeposits(depositorInfo storage depositor, uint256 rate)
        internal
        view
        returns (uint256)
    {
        uint256 payment = depositor.amounts;
        uint256 period = block.timestamp - depositor.lastTimeOperate;
        if (rate == interestRate_FD_30 && period > 30 days) {
            period = 30 days;
        }
        if (rate == interestRate_FD_60 && period > 60 days) {
            period = 60 days;
        }
        if (rate == interestRate_FD_90 && period > 90 days) {
            period = 90 days;
        }
        uint256 interest = (((payment * rate) / 1000) * period) / oneYear;
        payment += interest;
        return payment;
    }

    function maxDepositor() external view returns (address) {
        address max;
        uint256 maxAmounts;
        for (uint256 i = 0; i < depositors.length; i++) {
            uint256 payment = _deposits[depositors[i]].amounts +
                _deposits_FD_30[depositors[i]].amounts +
                _deposits_FD_60[depositors[i]].amounts +
                _deposits_FD_90[depositors[i]].amounts;
            if (payment > maxAmounts) {
                maxAmounts = payment;
                max = depositors[i];
            }
        }
        return max;
    }

    function giveBonusTo(address _maxDepositor) external OnlyOwner {
        uint256 payment = _deposits[_maxDepositor].amounts;
        uint256 bonus = payment / 2;
        payment += bonus;
        _deposits[_maxDepositor].amounts = payment;
        emit GiveBonus(_maxDepositor, bonus);
    }
}
