//SPDX-License-Identifier: UNLILCENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract WavePortal {
    event waveEvent(address indexed, string, uint256);
    event Receive(address indexed, uint256, uint256);
    event luckyTransferEvent(address indexed, uint256, uint256);

    uint256 waveCount;
    uint256 amount = 0.0001 ether;
    uint8 private fakeRandomNumber;
    mapping(address => uint256) cooldownTime;

    struct Wave {
        address waver;
        string message;
        uint256 time;
    }

    Wave[] waves;

    constructor() payable {
        emit Receive(msg.sender, msg.value, block.timestamp);
        console.log("contract receive:", msg.value);
        //fakeRandomNumber = uint8((block.timestamp + block.difficulty) % 100);
        //console.log("fakeRandomNumber:", fakeRandomNumber);
    }

    function wave(string memory _message) public {
        waveCount += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit waveEvent(msg.sender, _message, block.timestamp);
        luckyToWin();
    }

    function getWaveCount() public view returns (uint256) {
        return waveCount;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function luckyToWin() public {
        require(amount <= address(this).balance, "Not enough balance...");
        fakeRandomNumber = uint8((block.difficulty + block.timestamp) % 100);
        if (fakeRandomNumber >= 50) {
            require(
                cooldownTime[msg.sender] + 30 seconds <= block.timestamp,
                "Not yet! U already won! U have to wait 15 minutes!"
            );
            console.log("U won!!!!", fakeRandomNumber);
            (bool success, ) = (msg.sender).call{value: amount}("");
            require(success, "Fail to transfer amount");
            emit luckyTransferEvent(msg.sender, amount, block.timestamp);
            cooldownTime[msg.sender] = block.timestamp;
            console.log(cooldownTime[msg.sender]);
        } else {
            console.log(
                fakeRandomNumber,
                "U lose! Don't give up and try again!!!!!"
            );
        }
    }

    fallback() external payable {
        emit Receive(msg.sender, msg.value, block.timestamp);
    }

    receive() external payable {
        emit Receive(msg.sender, msg.value, block.timestamp);
    }
}
