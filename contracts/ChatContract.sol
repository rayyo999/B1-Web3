//SPDX-License-Identifier: UNLILCENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract ChatContract {
    event Receive(address indexed, uint256);
    event chatEvent(uint256, address indexed, address indexed, string, uint256);
    event postEvent(uint256, address indexed, string, uint256);
    // event luckyTransferEvent(address indexed, uint256, uint256);

    // uint256 waveCount;
    // uint256 amount = 0.0001 ether;
    // uint8 private fakeRandomNumber;
    // mapping(address => uint256) cooldownTime;
    address owner;
    mapping(address => bool) public authors;

    struct Chat {
        uint256 index;
        address from;
        address to;
        string message;
        uint256 time;
    }
    Chat[] chats;

    struct Post {
        uint256 index;
        address author;
        string content;
        uint256 time;
    }
    Post[] posts;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    modifier isAuthors() {
        require(authors[msg.sender]);
        _;
    }

    constructor() payable {
        owner = msg.sender;
        emit Receive(msg.sender, msg.value);
        console.log("contract receive:", msg.value);
        //fakeRandomNumber = uint8((block.timestamp + block.difficulty) % 100);
        //console.log("fakeRandomNumber:", fakeRandomNumber);
    }

    function setAuthors(address _author) public onlyOwner {
        authors[_author] = true;
    }

    function clearAuthors(address _author) public onlyOwner {
        authors[_author] = false;
    }

    function chat(address _to, string memory _message) public {
        console.log(chats.length);
        chats.push(
            Chat(chats.length, msg.sender, _to, _message, block.timestamp)
        );
        emit chatEvent(
            chats.length,
            msg.sender,
            _to,
            _message,
            block.timestamp
        );
        // luckyToWin();
    }

    function getChatCount() external view returns (uint256) {
        return chats.length;
    }

    function getAllChats() external view returns (Chat[] memory) {
        return chats;
    }

    function post(string memory content) public isAuthors {
        console.log(posts.length);
        posts.push(Post(chats.length, msg.sender, content, block.timestamp));
        emit postEvent(chats.length, msg.sender, content, block.timestamp);
        // luckyToWin();
    }

    function getPostCount() external view returns (uint256) {
        return posts.length;
    }

    function getAllPosts() external view returns (Post[] memory) {
        return posts;
    }

    // function luckyToWin() public {
    //     require(amount <= address(this).balance, "Not enough balance...");
    //     fakeRandomNumber = uint8((block.difficulty + block.timestamp) % 100);
    //     if (fakeRandomNumber >= 50) {
    //         require(
    //             cooldownTime[msg.sender] + 30 seconds <= block.timestamp,
    //             "Not yet! U already won! U have to wait 15 minutes!"
    //         );
    //         console.log("U won!!!!", fakeRandomNumber);
    //         (bool success, ) = (msg.sender).call{value: amount}("");
    //         require(success, "Fail to transfer amount");
    //         emit luckyTransferEvent(msg.sender, amount, block.timestamp);
    //         cooldownTime[msg.sender] = block.timestamp;
    //         console.log(cooldownTime[msg.sender]);
    //     } else {
    //         console.log(
    //             fakeRandomNumber,
    //             "U lose! Don't give up and try again!!!!!"
    //         );
    //     }
    // }

    fallback() external payable {
        emit Receive(msg.sender, msg.value);
    }

    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }
}
