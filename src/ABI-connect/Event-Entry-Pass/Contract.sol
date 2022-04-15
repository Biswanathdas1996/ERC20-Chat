pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string baseURI;
  string public baseExtension = ".json";
  uint256 public maxSupply = 10000;
  
  bool public paused = false;
  bool public revealed = false;
  string public notRevealedUri;

  struct Price {
        uint256 amount;
  }

     
  mapping(uint256 => Price) internal _prices;

  mapping (uint256 => string) private _tokenURIs;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI,
    string memory _initNotRevealedUri
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    setNotRevealedURI(_initNotRevealedUri);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

   function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

  // public
  function mintNFT(uint256 _mintQty, uint price, string memory tokenURI) public {
    uint256 supply = totalSupply();
    require(!paused);
    require(_mintQty > 0);
    
    require(supply + _mintQty <= maxSupply);

    for (uint256 i = 1; i <= _mintQty; i++) {
       uint tokenID = supply + i;
      _safeMint(msg.sender, tokenID);
      setNFTPrice(tokenID, price);
      _setTokenURI(tokenID, tokenURI);
    }
    
    // setBaseExtension(tokenURI);
    // setBaseURI(tokenURI);
    // setNotRevealedURI(tokenURI);
  }


  function setNFTPrice(
        uint256 token,
        uint amount
    ) public {
        _prices[token] = Price(amount);
  }

  function getNftPrice(uint tokenId)
        public
        view
        returns (uint amount)
  {
      Price memory priceData = _prices[tokenId];
      return priceData.amount;
  }

  function getTokenURI(uint tokenId)
        public
        view
        returns (string memory tokenUri)
  {
      string memory tokenUriInfo = _tokenURIs[tokenId];
      return tokenUriInfo;
  }


  function transferNFT(uint tokenId) public payable{
    uint nftCost=getNftPrice(tokenId);
    require(msg.value >= nftCost);
    address payable contractOwnerAddress = payable(owner());
    contractOwnerAddress.transfer(msg.value);
    _transfer(contractOwnerAddress,msg.sender,tokenId);
  }

  

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function reveal() public onlyOwner {
      revealed = true;
  }
  
  
  
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
  function withdraw() public payable onlyOwner {
    // This will pay HashLips 5% of the initial sale.
    // You can remove this if you want, or keep it in to support HashLips and his channel.
    // =============================================================================
    (bool hs, ) = payable(0x943590A42C27D08e3744202c4Ae5eD55c2dE240D).call{value: address(this).balance * 5 / 100}("");
    require(hs);
    // =============================================================================
    
    // This will payout the owner 95% of the contract balance.
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    // =============================================================================
  }
}