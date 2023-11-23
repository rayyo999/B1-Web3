// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/escrow/Escrow.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyEscrowold is Escrow {
    address ERC20Address;
    address private _owner;

    uint256 interestRate_DD = 50; //5%
    // uint256 interestRate_DD = 1000;
    uint256 interestRate_FD = 100; //10%
    // uint256 interestRate_FD = 2000;
    uint256 oneYear = 1 seconds;

    struct depositorInfo {
        uint256 lastTimeDeposit;
        uint256 lastTimeWithdraw;
        uint256 amounts;
    }
    //demandDepositAccounts
    mapping(address => depositorInfo) private _deposits;
    //fixedDepositAccounts
    mapping(address => depositorInfo) private _deposits_FD;
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
        uint256 balance;
        depositorInfo storage depositor = _deposits[msg.sender];
        if (depositor.lastTimeDeposit == 0) {
            return 0;
        } else if (depositor.lastTimeDeposit > depositor.lastTimeWithdraw) {
            balance = updateDeposits(
                depositor,
                depositor.amounts,
                depositor.lastTimeDeposit,
                interestRate_DD
            );
            console.log("update1");
            console.log("time : ", block.timestamp);
        } else {
            balance = updateDeposits(
                depositor,
                depositor.amounts,
                depositor.lastTimeWithdraw,
                interestRate_DD
            );
            console.log("update2");
            console.log("time : ", block.timestamp);
        }
        return balance;
    }

    function lastTimeDeposit_DD() public view returns (uint256) {
        return _deposits[msg.sender].lastTimeDeposit;
    }

    function lastTimeWithdraw_DD() public view returns (uint256) {
        return _deposits[msg.sender].lastTimeWithdraw;
    }

    //FD
    function depositOf_FD() public view returns (uint256) {
        return _deposits_FD[msg.sender].amounts;
    }

    function lastTimeDeposit_FD() public view returns (uint256) {
        return _deposits_FD[msg.sender].lastTimeDeposit;
    }

    function lastTimeWithdraw_FD() public view returns (uint256) {
        return _deposits_FD[msg.sender].lastTimeWithdraw;
    }

    //deposit
    function deposit_DD(uint256 amount) public payable {
        depositorInfo storage depositor = _deposits[msg.sender];
        _deposit(depositor, amount, interestRate_DD);
    }

    function deposit_FD(uint256 amount) public payable {
        depositorInfo storage depositor = _deposits_FD[msg.sender];
        _deposit(depositor, amount, interestRate_FD);
    }

    function _deposit(
        depositorInfo storage depositor,
        uint256 amount,
        uint256 rate
    ) internal {
        if (
            _deposits[msg.sender].lastTimeDeposit == 0 &&
            _deposits_FD[msg.sender].lastTimeDeposit == 0
        ) {
            depositors.push(msg.sender);
            console.log("new");
        }
        if (depositor.lastTimeDeposit == 0) {
            depositor.amounts = amount;
            console.log("create FD");
            console.log("time : ", block.timestamp);
        } else if (depositor.lastTimeDeposit > depositor.lastTimeWithdraw) {
            depositor.amounts = updateDeposits(
                depositor,
                amount,
                depositor.lastTimeDeposit,
                rate
            );
            console.log("update1");
            console.log("time : ", block.timestamp);
        } else {
            depositor.amounts = updateDeposits(
                depositor,
                amount,
                depositor.lastTimeWithdraw,
                rate
            );
            console.log("update2");
            console.log("time : ", block.timestamp);
        }
        depositor.lastTimeDeposit = block.timestamp;
        IERC20(ERC20Address).transferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    function updateDeposits(
        depositorInfo storage depositor,
        uint256 amount,
        uint256 baseTime,
        uint256 rate
    ) internal view returns (uint256) {
        uint256 payment = depositor.amounts;
        uint256 period = block.timestamp - baseTime;
        uint256 interest = (((payment * rate) / 1000) * period) / oneYear;
        payment += interest;
        return payment + amount;
        // uint256 eN = 271828182846;
        // uint256 eD = 100000000000;
        // uint256 e = eN / eD;
        // uint256 payment = depositor.amounts;
        // uint256 period = block.timestamp - depositor.lastTimeOperate;
        // payment *= uint256(e**(uint256(uint256(rate * period) / oneYear)));
        // return payment;
    }

    function withdraw_DD(uint256 amount) public {
        depositorInfo storage depositor = _deposits[msg.sender];
        require(depositor.lastTimeDeposit > 0, "Haven't deposit yet!");
        require(depositor.amounts > amount, "No enough money to withdraw!");
        uint256 payment = depositor.amounts;
        depositor.lastTimeWithdraw = block.timestamp;
        depositor.amounts -= amount;
        IERC20(ERC20Address).transfer(msg.sender, payment);
        emit Withdrawn(msg.sender, payment);
    }

    function _withdraw() internal {}

    // function maxDepositor() external view OnlyOwner returns (address) {
    //     address max;
    //     uint256 maxAmounts;
    //     for (uint256 i = 0; i < depositors.length; i++) {
    //         uint256 payment = _deposits[depositors[i]].demandDepositAmounts +
    //             _deposits[depositors[i]].fixedDepositAmounts;
    //         if (payment > maxAmounts) {
    //             maxAmounts = payment;
    //             max = depositors[i];
    //         }
    //     }
    //     return max;
    // }

    // function giveBonusTo(address _maxDepositor) external OnlyOwner {
    //     _deposits[_maxDepositor].demandDepositAmounts =
    //         (_deposits[_maxDepositor].demandDepositAmounts * 101) /
    //         100;
    // }
}
