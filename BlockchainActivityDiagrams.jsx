import React, { useState } from 'react';
import { Download, FileText, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

const BlockchainActivityDiagrams = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  const workflows = [
    {
      id: 1,
      name: "User Registration and Email Verification",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User submits registration form<br/>username, email, password, fullName, phone]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>All fields provided?}
        CheckUser{User exists?}
        GenCode[Generate 6-digit<br/>verification code]
        SetExpiry[Set expiration<br/>24 hours from now]
        ReturnSuccess[Return success response<br/>with user data]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        QueryExisting[Query existing user<br/>by email/username]
        CreateUser[Create user record<br/>email_verified = false<br/>Hash password]
        CreateVerif[Create verification record<br/>in email_verifications<br/>type = 'signup']
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
    end
    
    subgraph Email Service Lane
        SendEmail[Send verification email<br/>with 6-digit code]
        EmailFail{Email<br/>failed?}
        LogConsole[Log code to console<br/>dev mode]
        LogError[Log error<br/>production mode]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| BeginTx
    BeginTx --> QueryExisting
    QueryExisting --> CheckUser
    CheckUser -->|Exists| Error2[Return 'User already exists']
    CheckUser -->|Not exists| CreateUser
    CreateUser --> GenCode
    GenCode --> SetExpiry
    SetExpiry --> CreateVerif
    CreateVerif --> CommitTx
    CommitTx --> SendEmail
    SendEmail --> EmailFail
    EmailFail -->|Failed in prod| LogError
    EmailFail -->|Failed in dev| LogConsole
    EmailFail -->|Success| ReturnSuccess
    LogError --> ReturnSuccess
    LogConsole --> ReturnSuccess
    ReturnSuccess --> End([End])
    Error1 --> End
    Error2 --> End
    
    CreateUser -.->|Error| RollbackTx
    RollbackTx --> Error3[Return error]
    Error3 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style CheckUser fill:#ffeb3b
    style EmailFail fill:#ffeb3b`
    },
    {
      id: 2,
      name: "Email Verification",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User submits<br/>verification code]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Code<br/>provided?}
        CheckExpiry{Code<br/>expired?}
        CheckVerified{Already<br/>verified?}
        ReturnSuccess[Return verification<br/>confirmation]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        FindVerif[Find verification record<br/>by token and type='signup']
        UpdateUser[Update user<br/>email_verified = true]
        UpdateVerif[Update verification record<br/>verified = true]
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| FindVerif
    FindVerif -->|Not found| Error2[Return 'Invalid code']
    FindVerif -->|Found| CheckExpiry
    CheckExpiry -->|Yes| Error3[Return 'Code expired']
    CheckExpiry -->|No| CheckVerified
    CheckVerified -->|Yes| Error4[Return 'Already verified']
    CheckVerified -->|No| BeginTx
    BeginTx --> UpdateUser
    UpdateUser --> UpdateVerif
    UpdateVerif --> CommitTx
    CommitTx --> ReturnSuccess
    ReturnSuccess --> End([End])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    Error4 --> End
    
    UpdateUser -.->|Error| RollbackTx
    RollbackTx --> Error5[Return error]
    Error5 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style CheckExpiry fill:#ffeb3b
    style CheckVerified fill:#ffeb3b`
    },
    {
      id: 3,
      name: "User Login",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User submits credentials<br/>email/username, password]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate<br/>Input?}
        VerifyPassword{Password<br/>correct?}
        CheckStatus{Account<br/>active?}
        ReturnData[Return user data<br/>and session info]
    end
    
    subgraph Database Lane
        FindUser[Query users table<br/>by email/username]
        UserFound{User<br/>found?}
    end
    
    subgraph Email Service Lane
        Fork{Fork}
        SendNotif[Send login notification email<br/>IP, device, timestamp]
        Join{Join}
        EmailError[Log email error]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| FindUser
    FindUser --> UserFound
    UserFound -->|No| Error2[Return 'Invalid credentials']
    UserFound -->|Yes| VerifyPassword
    VerifyPassword -->|No| Error3[Return 'Invalid credentials']
    VerifyPassword -->|Yes| CheckStatus
    CheckStatus -->|Inactive| Error4[Return 'Account not active']
    CheckStatus -->|Active| Fork
    Fork --> SendNotif
    Fork --> ReturnData
    SendNotif -.->|Error| EmailError
    SendNotif --> Join
    EmailError --> Join
    ReturnData --> End([End])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    Error4 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style VerifyPassword fill:#ffeb3b
    style CheckStatus fill:#ffeb3b
    style UserFound fill:#ffeb3b
    style Fork fill:#333333,color:#ffffff
    style Join fill:#333333,color:#ffffff`
    },
    {
      id: 4,
      name: "Wallet Creation",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests wallet creation<br/>label, userId]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate<br/>Input?}
        GenAddress[Generate unique<br/>Ethereum address 0x...]
        GenPublicKey[Generate public key]
        ReturnWallet[Return wallet details<br/>address, label, wallet_id]
    end
    
    subgraph Database Lane
        VerifyUser[Query users table<br/>by userId]
        UserExists{User<br/>exists?}
        CreateWallet[Insert wallet record<br/>status = 'active'<br/>link to user_id]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| VerifyUser
    VerifyUser --> UserExists
    UserExists -->|No| Error2[Return 'User not found']
    UserExists -->|Yes| GenAddress
    GenAddress --> GenPublicKey
    GenPublicKey --> CreateWallet
    CreateWallet --> ReturnWallet
    ReturnWallet --> End([End])
    
    Error1 --> End
    Error2 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style UserExists fill:#ffeb3b`
    },
    {
      id: 5,
      name: "Deposit Tokens",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests deposit<br/>address, tokenId, amount]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>tokenId & amount > 0?}
        ReturnSuccess[Return deposit<br/>confirmation]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        FindWallet[Query wallets by address]
        WalletFound{Wallet<br/>found?}
        CheckHolding[Query token_holdings<br/>for wallet_id + token_id]
        HoldingExists{Holding<br/>exists?}
        UpdateHolding[Update amount<br/>add to existing]
        InsertHolding[Insert new holding record]
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| BeginTx
    BeginTx --> FindWallet
    FindWallet --> WalletFound
    WalletFound -->|No| RollbackTx
    WalletFound -->|Yes| CheckHolding
    CheckHolding --> HoldingExists
    HoldingExists -->|Yes| UpdateHolding
    HoldingExists -->|No| InsertHolding
    UpdateHolding --> CommitTx
    InsertHolding --> CommitTx
    CommitTx --> ReturnSuccess
    ReturnSuccess --> End([End])
    
    Error1 --> End
    RollbackTx --> Error2[Return error]
    Error2 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style WalletFound fill:#ffeb3b
    style HoldingExists fill:#ffeb3b`
    },
    {
      id: 6,
      name: "Withdraw Tokens",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests withdrawal<br/>address, tokenId, amount, toAddress]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>tokenId & amount > 0?}
        ReturnSuccess[Return withdrawal<br/>confirmation]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        FindWallet[Query wallets by address]
        WalletFound{Wallet<br/>found?}
        CheckBalance[Query token_holdings<br/>for current balance]
        SufficientBalance{Balance >=<br/>amount?}
        UpdateHolding[Subtract amount<br/>from holdings]
        BalanceZero{New balance<br/>= 0?}
        DeleteHolding[Delete holding record]
        UpdateAmount[Update amount]
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| BeginTx
    BeginTx --> FindWallet
    FindWallet --> WalletFound
    WalletFound -->|No| RollbackTx
    WalletFound -->|Yes| CheckBalance
    CheckBalance --> SufficientBalance
    SufficientBalance -->|No| RollbackTx
    SufficientBalance -->|Yes| UpdateHolding
    UpdateHolding --> BalanceZero
    BalanceZero -->|Yes| DeleteHolding
    BalanceZero -->|No| UpdateAmount
    DeleteHolding --> CommitTx
    UpdateAmount --> CommitTx
    CommitTx --> ReturnSuccess
    ReturnSuccess --> End([End])
    
    Error1 --> End
    RollbackTx --> Error2[Return 'Insufficient balance'<br/>or wallet error]
    Error2 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style WalletFound fill:#ffeb3b
    style SufficientBalance fill:#ffeb3b
    style BalanceZero fill:#ffeb3b`
    },
    {
      id: 7,
      name: "Transfer Tokens Between Wallets",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests transfer<br/>fromAddress, toAddress, tokenId, amount]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>All fields & amount > 0?}
        ReturnSuccess[Return transfer<br/>confirmation]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        FindSource[Query wallets<br/>by fromAddress]
        SourceFound{Source<br/>found?}
        FindDest[Query wallets<br/>by toAddress]
        DestFound{Destination<br/>found?}
        CheckBalance[Query token_holdings<br/>for source wallet]
        SufficientBalance{Balance >=<br/>amount?}
        UpdateSource[Subtract amount<br/>from source holdings]
        CheckDestHolding{Dest holding<br/>exists?}
        UpdateDest[Update destination<br/>add amount]
        InsertDest[Insert new destination<br/>holding]
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| BeginTx
    BeginTx --> FindSource
    FindSource --> SourceFound
    SourceFound -->|No| RollbackTx
    SourceFound -->|Yes| FindDest
    FindDest --> DestFound
    DestFound -->|No| RollbackTx
    DestFound -->|Yes| CheckBalance
    CheckBalance --> SufficientBalance
    SufficientBalance -->|No| RollbackTx
    SufficientBalance -->|Yes| UpdateSource
    UpdateSource --> CheckDestHolding
    CheckDestHolding -->|Yes| UpdateDest
    CheckDestHolding -->|No| InsertDest
    UpdateDest --> CommitTx
    InsertDest --> CommitTx
    CommitTx --> ReturnSuccess
    ReturnSuccess --> End([End])
    
    Error1 --> End
    RollbackTx --> Error2[Return error<br/>wallet not found or insufficient balance]
    Error2 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style SourceFound fill:#ffeb3b
    style DestFound fill:#ffeb3b
    style SufficientBalance fill:#ffeb3b
    style CheckDestHolding fill:#ffeb3b`
    },
    {
      id: 8,
      name: "Create Blockchain Transaction",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User creates transaction<br/>fromAddress, toAddress, tokenSymbol, amount, method]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>All fields & amount > 0?}
        CalcFee[Calculate fee<br/>fee = amount * 0.001]
        CalcTotal[Calculate total required<br/>totalRequired = amount + fee]
        GenHash[Generate transaction hash<br/>unique 0x...]
        ReturnTx[Return transaction details]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        FindSource[Query wallets by fromAddress]
        SourceFound{Source<br/>found?}
        FindDest[Query wallets by toAddress]
        DestFound{Dest<br/>found?}
        FindToken[Query tokens by tokenSymbol]
        TokenFound{Token<br/>found?}
        ValidateBalance[Call validate_wallet_balance]
        BalanceOK{Sufficient<br/>balance?}
        GetBlock[Get latest block_id]
        CreateTx[Create transaction record<br/>status = 'pending']
        UpdateSource[Subtract totalRequired<br/>from source]
        CheckDestHolding{Dest holding<br/>exists?}
        UpdateDest[Update destination<br/>add amount]
        InsertDest[Insert destination holding]
        UpdateStatus[Update transaction<br/>status = 'confirmed']
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
        GetUsers[Query users for<br/>sender and receiver emails]
    end
    
    subgraph Email Service Lane
        Fork{Fork}
        SendSenderEmail[Send email to sender]
        SendReceiverEmail[Send email to receiver]
        Join{Join}
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| BeginTx
    BeginTx --> FindSource
    FindSource --> SourceFound
    SourceFound -->|No| RollbackTx
    SourceFound -->|Yes| FindDest
    FindDest --> DestFound
    DestFound -->|No| RollbackTx
    DestFound -->|Yes| FindToken
    FindToken --> TokenFound
    TokenFound -->|No| RollbackTx
    TokenFound -->|Yes| CalcFee
    CalcFee --> CalcTotal
    CalcTotal --> ValidateBalance
    ValidateBalance --> BalanceOK
    BalanceOK -->|No| RollbackTx
    BalanceOK -->|Yes| GetBlock
    GetBlock --> GenHash
    GenHash --> CreateTx
    CreateTx --> UpdateSource
    UpdateSource --> CheckDestHolding
    CheckDestHolding -->|Yes| UpdateDest
    CheckDestHolding -->|No| InsertDest
    UpdateDest --> UpdateStatus
    InsertDest --> UpdateStatus
    UpdateStatus --> CommitTx
    CommitTx --> GetUsers
    GetUsers --> Fork
    Fork --> SendSenderEmail
    Fork --> SendReceiverEmail
    SendSenderEmail --> Join
    SendReceiverEmail --> Join
    Join --> ReturnTx
    ReturnTx --> End([End])
    
    Error1 --> End
    RollbackTx --> Error2[Return error with details]
    Error2 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style SourceFound fill:#ffeb3b
    style DestFound fill:#ffeb3b
    style TokenFound fill:#ffeb3b
    style BalanceOK fill:#ffeb3b
    style CheckDestHolding fill:#ffeb3b
    style Fork fill:#333333,color:#ffffff
    style Join fill:#333333,color:#ffffff`
    },
    {
      id: 9,
      name: "P2P Order Creation",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User creates P2P order<br/>userId, tokenId, orderType, amount, price,<br/>paymentMethod, minLimit, maxLimit]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>All required fields?}
        CalcTotal[Calculate total<br/>total = amount * price]
        IsSellOrder{Order type<br/>= 'sell'?}
        ReturnOrder[Return order details]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        ValidateBalance[Query token_holdings<br/>for user's wallet]
        SufficientBalance{Sufficient<br/>balance?}
        CreateOrder[Insert into p2p_orders<br/>status = 'active']
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| CalcTotal
    CalcTotal --> IsSellOrder
    IsSellOrder -->|No| BeginTx
    IsSellOrder -->|Yes| ValidateBalance
    ValidateBalance --> SufficientBalance
    SufficientBalance -->|No| RollbackTx
    SufficientBalance -->|Yes| BeginTx
    BeginTx --> CreateOrder
    CreateOrder --> CommitTx
    CommitTx --> ReturnOrder
    ReturnOrder --> End([End])
    
    Error1 --> End
    RollbackTx --> Error2[Return 'Insufficient balance']
    Error2 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style IsSellOrder fill:#ffeb3b
    style SufficientBalance fill:#ffeb3b`
    },
    {
      id: 10,
      name: "P2P Transaction Request",
      mermaid: `flowchart TD
    Start([Start]) --> Input[Buyer creates P2P request<br/>buyerId, sellerId, tokenId, amount, price]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>All fields provided?}
        CheckSelfTx{buyerId =<br/>sellerId?}
        CalcTotal[Calculate total<br/>total = amount * price]
        ReturnTx[Return transaction details]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        ValidateBalance[Query token_holdings<br/>for seller]
        SufficientBalance{Sufficient<br/>balance?}
        CreateP2PTx[Insert into p2p_transactions<br/>status = 'pending']
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
        GetUsers[Query users for<br/>buyer and seller emails]
        CreateEmailVerif[Create email verification<br/>record for seller]
    end
    
    subgraph Email Service Lane
        Fork{Fork}
        SendBuyerEmail[Send notification<br/>to buyer]
        SendSellerEmail[Send notification<br/>to seller]
        Join{Join}
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| CheckSelfTx
    CheckSelfTx -->|Yes| Error2[Return 'Cannot trade with yourself']
    CheckSelfTx -->|No| BeginTx
    BeginTx --> ValidateBalance
    ValidateBalance --> SufficientBalance
    SufficientBalance -->|No| RollbackTx
    SufficientBalance -->|Yes| CalcTotal
    CalcTotal --> CreateP2PTx
    CreateP2PTx --> CommitTx
    CommitTx --> GetUsers
    GetUsers --> CreateEmailVerif
    CreateEmailVerif --> Fork
    Fork --> SendBuyerEmail
    Fork --> SendSellerEmail
    SendBuyerEmail --> Join
    SendSellerEmail --> Join
    Join --> ReturnTx
    ReturnTx --> End([End])
    
    Error1 --> End
    Error2 --> End
    RollbackTx --> Error3[Return 'Insufficient seller balance']
    Error3 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style CheckSelfTx fill:#ffeb3b
    style SufficientBalance fill:#ffeb3b
    style Fork fill:#333333,color:#ffffff
    style Join fill:#333333,color:#ffffff`
    },
    {
      id: 11,
      name: "P2P Transaction Acceptance",
      mermaid: `flowchart TD
    Start([Start]) --> Input[Seller accepts P2P transaction<br/>transactionId, userId]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        CheckAuth{userId is<br/>seller?}
        CheckStatus{Status =<br/>'pending'?}
        ReturnUpdated[Return updated transaction]
    end
    
    subgraph Database Lane
        GetTx[Query p2p_transactions<br/>by transactionId]
        TxFound{Transaction<br/>found?}
        BeginTx[Begin Transaction]
        ValidateBalance[Check seller has<br/>sufficient tokens]
        SufficientBalance{Sufficient<br/>balance?}
        UpdateStatus[Update transaction<br/>status = 'paid']
        UpdateEmailVerif[Mark email verification<br/>as read]
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
        GetUsers[Query users for<br/>buyer and seller]
    end
    
    subgraph Email Service Lane
        Fork{Fork}
        SendBuyerEmail[Send acceptance<br/>notification to buyer]
        SendSellerEmail[Send acceptance<br/>notification to seller]
        Join{Join}
    end
    
    Input --> GetTx
    GetTx --> TxFound
    TxFound -->|No| Error1[Return 'Transaction not found']
    TxFound -->|Yes| CheckAuth
    CheckAuth -->|No| Error2[Return 'Not authorized']
    CheckAuth -->|Yes| CheckStatus
    CheckStatus -->|No| Error3[Return 'Transaction not pending']
    CheckStatus -->|Yes| BeginTx
    BeginTx --> ValidateBalance
    ValidateBalance --> SufficientBalance
    SufficientBalance -->|No| RollbackTx
    SufficientBalance -->|Yes| UpdateStatus
    UpdateStatus --> UpdateEmailVerif
    UpdateEmailVerif --> CommitTx
    CommitTx --> GetUsers
    GetUsers --> Fork
    Fork --> SendBuyerEmail
    Fork --> SendSellerEmail
    SendBuyerEmail --> Join
    SendSellerEmail --> Join
    Join --> ReturnUpdated
    ReturnUpdated --> End([End])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    RollbackTx --> Error4[Return 'Insufficient balance']
    Error4 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style CheckAuth fill:#ffeb3b
    style CheckStatus fill:#ffeb3b
    style TxFound fill:#ffeb3b
    style SufficientBalance fill:#ffeb3b
    style Fork fill:#333333,color:#ffffff
    style Join fill:#333333,color:#ffffff`
    },
    {
      id: 12,
      name: "P2P Token Transfer",
      mermaid: `flowchart TD
    Start([Start]) --> Input[Seller transfers tokens<br/>transactionId, userId]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        CheckAuth{userId is<br/>seller?}
        CheckStatus{Status =<br/>'paid'?}
        ReturnCompleted[Return completed transaction]
    end
    
    subgraph Database Lane
        GetTx[Query p2p_transactions<br/>with buyer/seller info]
        TxFound{Transaction<br/>found?}
        BeginTx[Begin Transaction]
        GetWallets[Query wallets for<br/>buyer and seller]
        ValidateBalance[Check seller has<br/>sufficient tokens]
        SufficientBalance{Sufficient<br/>balance?}
        UpdateSeller[Subtract amount from<br/>seller holdings]
        CheckBuyerHolding{Buyer holding<br/>exists?}
        UpdateBuyer[Update buyer holdings<br/>add amount]
        InsertBuyer[Insert buyer holding]
        CreateBlockchainTx[Insert into transactions<br/>method = 'p2p_transfer'<br/>status = 'confirmed']
        UpdateP2PStatus[Update p2p_transactions<br/>status = 'completed']
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
        GetUsers[Query users for<br/>buyer and seller]
    end
    
    subgraph Email Service Lane
        Fork{Fork}
        SendBuyerEmail[Send completion<br/>notification to buyer]
        SendSellerEmail[Send completion<br/>notification to seller]
        Join{Join}
    end
    
    Input --> GetTx
    GetTx --> TxFound
    TxFound -->|No| Error1[Return 'Transaction not found']
    TxFound -->|Yes| CheckAuth
    CheckAuth -->|No| Error2[Return 'Not authorized']
    CheckAuth -->|Yes| CheckStatus
    CheckStatus -->|No| Error3[Return 'Transaction not paid']
    CheckStatus -->|Yes| BeginTx
    BeginTx --> GetWallets
    GetWallets --> ValidateBalance
    ValidateBalance --> SufficientBalance
    SufficientBalance -->|No| RollbackTx
    SufficientBalance -->|Yes| UpdateSeller
    UpdateSeller --> CheckBuyerHolding
    CheckBuyerHolding -->|Yes| UpdateBuyer
    CheckBuyerHolding -->|No| InsertBuyer
    UpdateBuyer --> CreateBlockchainTx
    InsertBuyer --> CreateBlockchainTx
    CreateBlockchainTx --> UpdateP2PStatus
    UpdateP2PStatus --> CommitTx
    CommitTx --> GetUsers
    GetUsers --> Fork
    Fork --> SendBuyerEmail
    Fork --> SendSellerEmail
    SendBuyerEmail --> Join
    SendSellerEmail --> Join
    Join --> ReturnCompleted
    ReturnCompleted --> End([End])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    RollbackTx --> Error4[Return 'Insufficient balance']
    Error4 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style CheckAuth fill:#ffeb3b
    style CheckStatus fill:#ffeb3b
    style TxFound fill:#ffeb3b
    style SufficientBalance fill:#ffeb3b
    style Fork fill:#333333,color:#ffffff
    style Join fill:#333333,color:#ffffff`
    },
    {
      id: 13,
      name: "Market Buy with USDT",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests market buy<br/>userId, tokenId, usdtAmount]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>All fields & usdtAmount > 0?}
        CalcTokenAmount[Calculate tokens to receive<br/>tokensToReceive = usdtAmount / targetPrice]
        CalcFee[Calculate fee<br/>fee = tokensToReceive * 0.003]
        CalcFinal[Calculate final amount<br/>finalTokens = tokensToReceive - fee]
        GenHash[Generate transaction hash<br/>unique 0x...]
        ReturnPurchase[Return purchase details]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        FindUSDT[Query tokens for USDT]
        USDTFound{USDT<br/>found?}
        FindTargetToken[Query tokens by tokenId]
        TargetFound{Target token<br/>found?}
        GetWallet[Query wallets for userId]
        WalletFound{Wallet<br/>found?}
        CheckUSDTBalance[Query token_holdings<br/>for USDT balance]
        SufficientUSDT{USDT balance >=<br/>usdtAmount?}
        UpdateUSDT[Subtract usdtAmount<br/>from USDT holdings]
        USDTZero{New USDT<br/>balance = 0?}
        DeleteUSDT[Delete USDT holding]
        UpdateUSDTAmount[Update USDT amount]
        CheckTargetHolding{Target holding<br/>exists?}
        UpdateTarget[Update target token<br/>add finalTokens]
        InsertTarget[Insert target token holding]
        CreateTx[Insert into transactions<br/>method = 'market_buy'<br/>status = 'confirmed']
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
        GetUser[Query user email]
    end
    
    subgraph Email Service Lane
        SendEmail[Send purchase notification<br/>with purchase details]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| BeginTx
    BeginTx --> FindUSDT
    FindUSDT --> USDTFound
    USDTFound -->|No| RollbackTx
    USDTFound -->|Yes| FindTargetToken
    FindTargetToken --> TargetFound
    TargetFound -->|No| RollbackTx
    TargetFound -->|Yes| GetWallet
    GetWallet --> WalletFound
    WalletFound -->|No| RollbackTx
    WalletFound -->|Yes| CheckUSDTBalance
    CheckUSDTBalance --> SufficientUSDT
    SufficientUSDT -->|No| RollbackTx
    SufficientUSDT -->|Yes| CalcTokenAmount
    CalcTokenAmount --> CalcFee
    CalcFee --> CalcFinal
    CalcFinal --> UpdateUSDT
    UpdateUSDT --> USDTZero
    USDTZero -->|Yes| DeleteUSDT
    USDTZero -->|No| UpdateUSDTAmount
    DeleteUSDT --> CheckTargetHolding
    UpdateUSDTAmount --> CheckTargetHolding
    CheckTargetHolding -->|Yes| UpdateTarget
    CheckTargetHolding -->|No| InsertTarget
    UpdateTarget --> GenHash
    InsertTarget --> GenHash
    GenHash --> CreateTx
    CreateTx --> CommitTx
    CommitTx --> GetUser
    GetUser --> SendEmail
    SendEmail --> ReturnPurchase
    ReturnPurchase --> End([End])
    
    Error1 --> End
    RollbackTx --> Error2[Return error<br/>insufficient USDT or invalid token]
    Error2 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style USDTFound fill:#ffeb3b
    style TargetFound fill:#ffeb3b
    style WalletFound fill:#ffeb3b
    style SufficientUSDT fill:#ffeb3b
    style USDTZero fill:#ffeb3b
    style CheckTargetHolding fill:#ffeb3b`
    },
    {
      id: 14,
      name: "Token Conversion/Swap",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests token swap<br/>userId, fromTokenId, toTokenId, amount]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Validate Input<br/>All fields & amount > 0?}
        CheckSameToken{fromTokenId =<br/>toTokenId?}
        CalcConversion[Calculate conversion<br/>usdValue = amount * fromPrice<br/>outputAmount = usdValue / toPrice]
        CalcFee[Calculate fee<br/>fee = outputAmount * 0.003]
        CalcFinal[Calculate final output<br/>finalOutput = outputAmount - fee]
        GenHashes[Generate two transaction hashes<br/>for outgoing and incoming]
        ReturnConversion[Return conversion details]
    end
    
    subgraph Database Lane
        BeginTx[Begin Transaction]
        GetWallet[Query wallets for userId]
        WalletFound{Wallet<br/>found?}
        GetTokens[Query tokens for<br/>both tokens]
        TokensFound{Both tokens<br/>found?}
        CheckSourceBalance[Query token_holdings<br/>for source token]
        SufficientBalance{Balance >=<br/>amount?}
        UpdateSource[Subtract amount<br/>from source holdings]
        SourceZero{New source<br/>balance = 0?}
        DeleteSource[Delete source holding]
        UpdateSourceAmount[Update source amount]
        CheckDestHolding{Dest holding<br/>exists?}
        UpdateDest[Update destination<br/>add finalOutput]
        InsertDest[Insert destination holding]
        CreateOutTx[Insert outgoing transaction<br/>method = 'swap_out'<br/>amount = -amount]
        CreateInTx[Insert incoming transaction<br/>method = 'swap_in'<br/>amount = finalOutput]
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
        GetUser[Query user email]
    end
    
    subgraph Email Service Lane
        SendEmail[Send conversion notification<br/>with conversion details]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| CheckSameToken
    CheckSameToken -->|Yes| Error2[Return 'Cannot convert to itself']
    CheckSameToken -->|No| BeginTx
    BeginTx --> GetWallet
    GetWallet --> WalletFound
    WalletFound -->|No| RollbackTx
    WalletFound -->|Yes| GetTokens
    GetTokens --> TokensFound
    TokensFound -->|No| RollbackTx
    TokensFound -->|Yes| CheckSourceBalance
    CheckSourceBalance --> SufficientBalance
    SufficientBalance -->|No| RollbackTx
    SufficientBalance -->|Yes| CalcConversion
    CalcConversion --> CalcFee
    CalcFee --> CalcFinal
    CalcFinal --> UpdateSource
    UpdateSource --> SourceZero
    SourceZero -->|Yes| DeleteSource
    SourceZero -->|No| UpdateSourceAmount
    DeleteSource --> CheckDestHolding
    UpdateSourceAmount --> CheckDestHolding
    CheckDestHolding -->|Yes| UpdateDest
    CheckDestHolding -->|No| InsertDest
    UpdateDest --> GenHashes
    InsertDest --> GenHashes
    GenHashes --> CreateOutTx
    CreateOutTx --> CreateInTx
    CreateInTx --> CommitTx
    CommitTx --> GetUser
    GetUser --> SendEmail
    SendEmail --> ReturnConversion
    ReturnConversion --> End([End])
    
    Error1 --> End
    Error2 --> End
    RollbackTx --> Error3[Return error<br/>insufficient balance or invalid tokens]
    Error3 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style CheckSameToken fill:#ffeb3b
    style WalletFound fill:#ffeb3b
    style TokensFound fill:#ffeb3b
    style SufficientBalance fill:#ffeb3b
    style SourceZero fill:#ffeb3b
    style CheckDestHolding fill:#ffeb3b`
    },
    {
      id: 15,
      name: "Request Account Deletion",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests deletion code<br/>userId]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateUser{User<br/>found?}
        GenCode[Generate 6-digit code]
        SetExpiry[Set expiration<br/>15 minutes from now]
        ReturnSuccess[Return confirmation]
    end
    
    subgraph Database Lane
        FindUser[Query users table]
        BeginTx[Begin Transaction]
        DeleteOldCodes[Delete existing unverified<br/>deletion codes]
        CreateVerif[Insert into email_verifications<br/>type = 'account_deletion']
        CommitTx[Commit Transaction]
        GetUserInfo[Query user email and name]
    end
    
    subgraph Email Service Lane
        SendEmail[Send deletion code email<br/>with 6-digit code]
        EmailError[Log email error]
    end
    
    Input --> FindUser
    FindUser --> ValidateUser
    ValidateUser -->|No| Error1[Return 'User not found']
    ValidateUser -->|Yes| BeginTx
    BeginTx --> DeleteOldCodes
    DeleteOldCodes --> GenCode
    GenCode --> SetExpiry
    SetExpiry --> CreateVerif
    CreateVerif --> CommitTx
    CommitTx --> GetUserInfo
    GetUserInfo --> SendEmail
    SendEmail -.->|Error| EmailError
    SendEmail --> ReturnSuccess
    EmailError --> ReturnSuccess
    ReturnSuccess --> End([End])
    
    Error1 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateUser fill:#ffeb3b`
    },
    {
      id: 16,
      name: "Account Deletion",
      mermaid: `flowchart TD
    Start([Start]) --> Input[User requests account deletion<br/>userId, code]
    
    subgraph User Lane
        Input
    end
    
    subgraph System Lane
        ValidateInput{Code<br/>provided?}
        CheckExpiry{Code<br/>expired?}
        ReturnSuccess[Return deletion confirmation]
    end
    
    subgraph Database Lane
        FindVerif[Find verification record<br/>by user_id, token, type='account_deletion']
        VerifFound{Verification<br/>found?}
        BeginTx[Begin Transaction]
        DeleteUser[Delete from users table<br/>CASCADE deletes:<br/>- All wallets<br/>- All token holdings<br/>- All P2P orders<br/>- All email verifications]
        CommitTx[Commit Transaction]
        RollbackTx[Rollback Transaction]
    end
    
    subgraph Email Service Lane
        SendConfirmation[Send deletion confirmation email]
    end
    
    Input --> ValidateInput
    ValidateInput -->|Invalid| Error1[Return validation error]
    ValidateInput -->|Valid| FindVerif
    FindVerif --> VerifFound
    VerifFound -->|No| Error2[Return 'Invalid code']
    VerifFound -->|Yes| CheckExpiry
    CheckExpiry -->|Yes| Error3[Return 'Code expired']
    CheckExpiry -->|No| BeginTx
    BeginTx --> DeleteUser
    DeleteUser --> CommitTx
    CommitTx --> SendConfirmation
    SendConfirmation --> ReturnSuccess
    ReturnSuccess --> End([End])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    DeleteUser -.->|Error| RollbackTx
    RollbackTx --> Error4[Return error]
    Error4 --> End
    
    style Start fill:#000000,color:#ffffff
    style End fill:#000000,color:#ffffff
    style ValidateInput fill:#ffeb3b
    style VerifFound fill:#ffeb3b
    style CheckExpiry fill:#ffeb3b`
    }
  ];

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const downloadMermaid = (workflow) => {
    const blob = new Blob([workflow.mermaid], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.replace(/\s+/g, '_')}.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Blockchain Explorer - Activity Diagrams
          </h1>
          <p className="text-gray-600">
            Interactive workflow diagrams for all system processes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Workflows ({workflows.length})
              </h2>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {workflows.map((workflow, index) => (
                  <button
                    key={workflow.id}
                    onClick={() => setSelectedWorkflow(index)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      selectedWorkflow === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {workflow.id}. {workflow.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {workflows[selectedWorkflow] && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {workflows[selectedWorkflow].name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Workflow #{workflows[selectedWorkflow].id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadMermaid(workflows[selectedWorkflow])}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      title="Download Mermaid file"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(workflows[selectedWorkflow].mermaid)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      title="Copy Mermaid code"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </button>
                  </div>
                </div>

                {/* Mermaid Diagram */}
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 overflow-x-auto">
                  <div className="mermaid">
                    {workflows[selectedWorkflow].mermaid}
                  </div>
                </div>

                {/* Mermaid Code Section */}
                <div className="mt-6">
                  <button
                    onClick={() => toggleSection('code')}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <span className="font-semibold text-gray-700">
                      View Mermaid Code
                    </span>
                    {expandedSections['code'] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {expandedSections['code'] && (
                    <div className="mt-4 p-4 bg-gray-900 rounded-md overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{workflows[selectedWorkflow].mermaid}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainActivityDiagrams;

