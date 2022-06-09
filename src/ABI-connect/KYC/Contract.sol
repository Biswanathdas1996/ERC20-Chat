// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract KYC {

    struct User {
        string abiLink;
        string data;
        string uid;
        string metadata;
    }
     mapping(string => User) public users;
     string[] public userList ;

     function addUser(string memory uid, string memory abiLink , string memory data ) public virtual {
        User memory newUser = User({
            abiLink:abiLink,
            data: data,
            uid:uid,
            metadata:""
        });
        users[uid] = newUser;
        userList.push(uid);
    }

    function getAllUser() public view returns(string[] memory){
        return userList;
    }

    function upadteUserAbi(string memory uid ,string memory abiLink, string memory data  ) public {
         User storage userData = users[uid];
         userData.abiLink = abiLink;
         userData.data = data;
    }

    function setUserMetadata(string memory metadata, string memory uid) public {
         User storage userData = users[uid];
         userData.metadata = metadata;
    }

}