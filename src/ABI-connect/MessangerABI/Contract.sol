pragma solidity ^0.8.13;
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol';

contract MyToken is ERC20 {

    struct User {
        uint slNo;
        string name;
        address addressId;
    }

    struct Message {
        uint slNo;
        address sender;
        address recever;
        string text; 
        bool status;
        string file;                  
        string fileType;                  
        uint amount;                  
    }

    struct Posts {
        uint slNo;
        address sender;
        string text; 
        bool status;
        string file;                  
        string fileType;                 
    }



    address public admin;
    mapping(address => uint) uniqueAddress;
    User[] public users;
    Message[] public messages;
    Posts[] public posts;

    constructor() ERC20("My Token", "MTN") {
        _mint(msg.sender, 1000 * 10 ** 18);
        admin = msg.sender;
    }  

    function register( string memory name) public  {
        User memory newUser = User({
            slNo:users.length,
            name:name,
            addressId : msg.sender
        });

        if (uniqueAddress[msg.sender] == 0) {
            users.push(newUser);
        }else{
            revert("Address already exit");
        }
        uniqueAddress[msg.sender] += 1;
    }

    function sendMassage(address toAddress , string memory text, string memory fileLink, string memory fileType, uint amount ) public {
         Message memory newMessage = Message({
            slNo:messages.length,
            sender : msg.sender,
            recever : toAddress,
            text:text,
            status:true,
            file:fileLink,
            fileType:fileType,
            amount:amount
        });
        messages.push(newMessage);
    }



    function postStory(string memory text, string memory fileLink, string memory fileType) public {
         Posts memory newPosts = Posts({
            slNo:posts.length,
            sender : msg.sender,
            text:text,
            status:true,
            file:fileLink,
            fileType:fileType
        });
        posts.push(newPosts);
    }

                  
                     
        


    function getAllMessages() public view returns (Message[] memory) {
        return  messages;
    }

    function getAllUsers() public view returns (User[] memory) {
        return  users;
    }

    function getAllposts() public view returns (Posts[] memory) {
        return  posts;
    }


    function mint(address to, uint amount) external {
        require(msg.sender == admin, "Only Admin");
        _mint(to, amount);
    }

    function burn(uint amount) external{
        _burn(msg.sender, amount);
    }

}