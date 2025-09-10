import React, { useState, useEffect, useMemo } from "react";
import { parseUnits, formatUnits, isAddress } from "viem";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppConfig } from "../context/configContext";
import { getW3Client, fetchBookByCid, resolveName, upsertEntry, putBook } from "../lib/companyBook";

export default function ExchangePage() {
    const config = useAppConfig();
    const { contractAddress, abi } = config;
    const { address, isConnected } = useAccount();
    const { writeContractAsync, isPending: isTransactionStarting } = useWriteContract();

    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [hash, setHash] = useState(null);
    const [book, setBook] = useState({ entries: {}, updatedAt: new Date().toISOString() });
    const [bookCid, setBookCid] = useState("");
    const [newCompanyName, setNewCompanyName] = useState("");
    const [newCompanyAddress, setNewCompanyAddress] = useState("");
    const [balanceValue, setBalanceValue] = useState("0.00");
    const [activeTab, setActiveTab] = useState("transfer");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const w3client = useMemo(() => getW3Client(config?.ipfs?.web3StorageToken), [config?.ipfs?.web3StorageToken]);

    useEffect(() => {
        const cid = config?.ipfs?.initialCompanyBookCid;
        setBookCid(cid || "");
        if (!cid) return;
        fetchBookByCid(cid)
            .then(setBook)
            .catch((e) => console.warn("Failed to load company book", e));
    }, [config?.ipfs?.initialCompanyBookCid]);

    const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({
        hash,
    });

    const DECIMALS = 18;

    const { data: balance, refetch } = useReadContract({
        address: contractAddress,
        abi,
        functionName: "balanceOf",
        args: [address],
        query: {
            enabled: !!address && !!contractAddress,
            refetchInterval: 3000,
        },
    });

    useEffect(() => {
        if (balance !== undefined) {
            try {
                if (typeof balance === 'bigint') {
                    setBalanceValue(Number(formatUnits(balance, DECIMALS)).toFixed(2));
                } else {
                    setBalanceValue(balance ? Number(balance).toFixed(2) : "0.00");
                }
            } catch (error) {
                console.error("Error formatting balance:", error);
                setBalanceValue("0.00");
            }
        }
    }, [balance, DECIMALS]);

    // Check if any transaction is in progress
    const isTransactionInProgress = isTransactionStarting || isConfirming;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setTimeout(() => setIsRefreshing(false), 1000);
    }

    const handleMint = async () => {
        try {
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "mint",
                args: [address, parseUnits(String(amount || 0), DECIMALS)],
            });
            setHash(txHash);
        } catch (err) {
            console.error("Mint error:", err);
        }
    };

    const handleBurn = async () => {
        try {
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "burn",
                args: [parseUnits(String(amount || 0), DECIMALS)],
            });
            setHash(txHash);
        } catch (err) {
            console.error("Burn error:", err);
        }
    };

    const handleTransfer = async () => {
        try {
            if (!isAddress(recipient)) throw new Error("Invalid recipient address");
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "transfer",
                args: [recipient, parseUnits(String(transferAmount || 0), DECIMALS)],
            });
            setHash(txHash);
        } catch (err) {
            console.error("Transfer error:", err);
        }
    };

    const handleTransferByName = async () => {
        try {
            const addr = resolveName(book, recipient);
            if (!addr) throw new Error("Unknown company name");
            if (!isAddress(addr)) throw new Error("Resolved address is invalid");
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "transfer",
                args: [addr, parseUnits(String(transferAmount || 0), DECIMALS)],
            });
            setHash(txHash);
        } catch (err) {
            console.error("Transfer by name error:", err);
        }
    };

    const handleSaveCompany = async () => {
        try {
            if (!w3client) throw new Error("No Web3.Storage token configured");
            const next = upsertEntry(book, newCompanyName, newCompanyAddress);
            const cid = await putBook(w3client, next);
            setBook(next);
            setBookCid(cid);
            setNewCompanyName("");
            setNewCompanyAddress("");
        } catch (err) {
            console.error("Save company error:", err);
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0c1120] to-[#0a0a0a] text-white flex flex-col items-center py-10 relative overflow-hidden ${isTransactionInProgress ? 'opacity-80 pointer-events-none' : ''}`}>
            
            {/* Transaction Overlay */}
            {isTransactionInProgress && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-cyan-900/90 to-teal-900/90 p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-cyan-500/30 backdrop-blur-xl">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-6"></div>
                        <p className="text-xl font-semibold text-cyan-300 font-['Orbitron']">
                            {isTransactionStarting ? "Confirming in MetaMask..." : "Processing Transaction..."}
                        </p>
                        <p className="text-sm text-cyan-200/80 mt-3 font-['Exo']">Please wait while we process your transaction</p>
                        <div className="mt-4 w-48 h-2 bg-cyan-900/50 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated background elements */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
                <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-teal-500 rounded-full filter blur-3xl opacity-15 animate-pulse delay-500"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMEg0MFY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBINDBWNDBNNDAgMEwwIDQwIiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')]"></div>

            {/* Header */}
            <header className="w-full max-w-5xl flex justify-between items-center px-8 py-5 bg-black/40 backdrop-blur-xl rounded-2xl mb-10 z-10 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="absolute -inset-3 bg-cyan-500/20 rounded-full blur-lg"></div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent relative font-['Orbitron']">
                            SEACREDS
                        </h2>
                    </div>
                    <div className="h-8 w-px bg-cyan-500/30"></div>
                    <p className="text-sm text-cyan-200/80 font-['Exo']">BLUE CARBON CREDIT EXCHANGE</p>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-sm rounded-xl bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/40 transition-all border border-cyan-500/20 flex items-center gap-2 font-['Exo'] font-medium hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        VIEW CONTRACT
                    </a>
                    <ConnectButton />
                </div>
            </header>

            {isConnected ? (
                <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col gap-8 z-10 border border-cyan-500/20">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 p-7 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/5 rounded-full translate-y-12 -translate-x-12"></div>

                        <h3 className="text-lg font-semibold text-cyan-300 mb-3 font-['Exo']">CARBON CREDIT BALANCE</h3>
                        <div className="flex items-end justify-between relative">
                            <div className="text-center">
                                <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-['Orbitron']">
                                    {balanceValue}
                                </p>
                                <p className="text-sm text-cyan-400/80 mt-1 font-['Exo']">GHC TOKENS</p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 border font-['Exo'] ${
                                    isRefreshing 
                                        ? 'bg-cyan-900/30 text-cyan-500/70 border-cyan-500/20 cursor-not-allowed' 
                                        : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/20 hover:border-cyan-500/30 hover:scale-105'
                                }`}
                            >
                                {isRefreshing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        REFRESHING...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                        REFRESH
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="text-xs text-cyan-500/70 mt-5 font-mono font-light">
                            {address?.slice(0, 8)}...{address?.slice(-6)} | Contract: {contractAddress?.slice(0, 8)}...{contractAddress?.slice(-6)}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-cyan-500/20">
                        <button
                            className={`px-7 py-4 font-medium text-sm font-['Exo'] transition-all ${
                                activeTab === 'transfer' 
                                    ? 'text-cyan-400 border-b-2 border-cyan-400' 
                                    : 'text-gray-400 hover:text-white hover:scale-105'
                            }`}
                            onClick={() => setActiveTab('transfer')}
                        >
                            🔄 TRANSFER CREDITS
                        </button>
                        <button
                            className={`px-7 py-4 font-medium text-sm font-['Exo'] transition-all ${
                                activeTab === 'manage' 
                                    ? 'text-cyan-400 border-b-2 border-cyan-400' 
                                    : 'text-gray-400 hover:text-white hover:scale-105'
                            }`}
                            onClick={() => setActiveTab('manage')}
                        >
                            ⚡ MANAGE SUPPLY
                        </button>
                        <button
                            className={`px-7 py-4 font-medium text-sm font-['Exo'] transition-all ${
                                activeTab === 'directory' 
                                    ? 'text-cyan-400 border-b-2 border-cyan-400' 
                                    : 'text-gray-400 hover:text-white hover:scale-105'
                            }`}
                            onClick={() => setActiveTab('directory')}
                        >
                            📋 COMPANY DIRECTORY
                        </button>
                    </div>

                    {/* Transfer Tab */}
                    {activeTab === 'transfer' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-7">
                                <h3 className="text-2xl font-semibold text-white font-['Exo']">CREDIT TRANSFER</h3>
                                <p className="text-cyan-200/90 font-['Exo']">
                                    Securely transfer carbon credits to verified organizations. Each transaction is immutably recorded on the blockchain for complete environmental accountability.
                                </p>

                                <div className="bg-cyan-900/20 p-5 rounded-xl border border-cyan-500/20">
                                    <h4 className="text-cyan-300 font-medium mb-3 font-['Exo']">TRANSPARENCY FEATURES</h4>
                                    <ul className="text-sm text-gray-300 space-y-2 font-['Exo']">
                                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-400 rounded-full"></div> Immutable blockchain recording</li>
                                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-400 rounded-full"></div> Real-time transaction tracking</li>
                                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-400 rounded-full"></div> IPFS-based company directory</li>
                                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-400 rounded-full"></div> Environmental impact verification</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-cyan-300 mb-3 font-['Exo']">RECIPIENT ADDRESS OR NAME</label>
                                    <input
                                        type="text"
                                        placeholder="0x... or company name"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-cyan-900/20 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-['Exo'] placeholder-cyan-500/50"
                                        disabled={isTransactionInProgress}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-cyan-300 mb-3 font-['Exo']">AMOUNT TO TRANSFER</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-cyan-900/20 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-['Exo'] placeholder-cyan-500/50"
                                        disabled={isTransactionInProgress}
                                    />
                                </div>

                                <div className="flex gap-4 pt-3">
                                    <button
                                        onClick={handleTransfer}
                                        disabled={!isAddress(recipient) || !transferAmount || isTransactionInProgress}
                                        className={`flex-1 px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 font-['Exo'] ${
                                            !isAddress(recipient) || !transferAmount || isTransactionInProgress
                                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 hover:scale-105'
                                        }`}
                                    >
                                        {isTransactionStarting ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {isTransactionStarting ? "CONFIRMING..." : "TRANSFER BY ADDRESS"}
                                    </button>

                                    <button
                                        onClick={handleTransferByName}
                                        disabled={!recipient || recipient.startsWith('0x') || !transferAmount || isTransactionInProgress}
                                        className={`flex-1 px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 font-['Exo'] ${
                                            !recipient || recipient.startsWith('0x') || !transferAmount || isTransactionInProgress
                                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:scale-105'
                                        }`}
                                    >
                                        {isTransactionStarting ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {isTransactionStarting ? "CONFIRMING..." : "TRANSFER BY NAME"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manage Supply Tab */}
                    {activeTab === 'manage' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-7">
                                <h3 className="text-2xl font-semibold text-white font-['Exo']">CREDIT MANAGEMENT</h3>
                                <p className="text-cyan-200/90 font-['Exo']">
                                    Authorized accounts can mint new carbon credits for verified blue carbon projects or retire credits to permanently offset emissions.
                                </p>

                                <div className="bg-cyan-900/20 p-5 rounded-xl border border-cyan-500/20">
                                    <h4 className="text-cyan-300 font-medium mb-3 font-['Exo']">CARBON CREDIT LIFE CYCLE</h4>
                                    <p className="text-sm text-gray-300 font-['Exo']">
                                        Each minted credit represents 1 ton of verified carbon sequestration through mangrove restoration, seagrass conservation, and tidal marsh protection projects.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-cyan-300 mb-3 font-['Exo']">CREDIT AMOUNT</label>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-cyan-900/20 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-['Exo'] placeholder-cyan-500/50"
                                        disabled={isTransactionInProgress}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleMint}
                                        disabled={!amount || isTransactionInProgress}
                                        className={`flex-1 px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 font-['Exo'] ${
                                            !amount || isTransactionInProgress
                                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 hover:scale-105'
                                        }`}
                                    >
                                        {isTransactionStarting ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {isTransactionStarting ? "CONFIRMING..." : "MINT NEW CREDITS"}
                                    </button>

                                    <button
                                        onClick={handleBurn}
                                        disabled={!amount || isTransactionInProgress}
                                        className={`flex-1 px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 font-['Exo'] ${
                                            !amount || isTransactionInProgress
                                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 hover:scale-105'
                                        }`}
                                    >
                                        {isTransactionStarting ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {isTransactionStarting ? "CONFIRMING..." : "RETIRE CREDITS"}
                                    </button>
                                </div>

                                <div className="text-sm text-cyan-300 p-4 bg-cyan-900/20 rounded-xl border border-cyan-500/20 font-['Exo']">
                                    <strong>NOTE:</strong> Only authorized accounts with the MINTER_ROLE can mint new carbon credits. Retiring credits permanently removes them from circulation, representing verified carbon offsetting.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Company Directory Tab */}
                    {activeTab === 'directory' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-7">
                                <h3 className="text-2xl font-semibold text-white font-['Exo']">COMPANY DIRECTORY</h3>
                                <p className="text-cyan-200/90 font-['Exo']">
                                    Manage your decentralized organization directory to enable transferring credits using recognizable names instead of complex blockchain addresses.
                                </p>

                                <div className="bg-cyan-900/20 p-5 rounded-xl border border-cyan-500/20">
                                    <h4 className="text-cyan-300 font-medium mb-3 font-['Exo']">DECENTRALIZED STORAGE</h4>
                                    <p className="text-sm text-gray-300 font-['Exo']">
                                        The company directory is stored on IPFS, creating a tamper-resistant, decentralized address book. Each entry maps a company name to its blockchain address for user-friendly transfers.
                                    </p>
                                    {bookCid && (
                                        <p className="text-xs text-cyan-400 mt-3 break-all font-mono">
                                            DIRECTORY CID: {bookCid}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-cyan-300 mb-3 font-['Exo']">COMPANY NAME</label>
                                    <input
                                        type="text"
                                        placeholder="Company name"
                                        value={newCompanyName}
                                        onChange={(e) => setNewCompanyName(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-cyan-900/20 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-['Exo'] placeholder-cyan-500/50"
                                        disabled={isTransactionInProgress}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-cyan-300 mb-3 font-['Exo']">BLOCKCHAIN ADDRESS</label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={newCompanyAddress}
                                        onChange={(e) => setNewCompanyAddress(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-cyan-900/20 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-['Exo'] placeholder-cyan-500/50"
                                        disabled={isTransactionInProgress}
                                    />
                                </div>

                                <button
                                    onClick={handleSaveCompany}
                                    disabled={!newCompanyName || !newCompanyAddress || isTransactionInProgress}
                                    className={`w-full px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 font-['Exo'] ${
                                        !newCompanyName || !newCompanyAddress || isTransactionInProgress
                                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                            : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 hover:scale-105'
                                    }`}
                                >
                                    {isTransactionStarting ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                                        </svg>
                                    )}
                                    {isTransactionStarting ? "PROCESSING..." : "SAVE TO DECENTRALIZED DIRECTORY"}
                                </button>

                                {Object.keys(book.entries).length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-cyan-300 font-medium mb-3 font-['Exo']">VERIFIED COMPANIES</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {Object.entries(book.entries).map(([name, addr]) => (
                                                <div key={name} className="flex justify-between items-center p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/10">
                                                    <span className="text-sm text-white font-['Exo']">{name}</span>
                                                    <span className="text-xs text-cyan-300 font-mono">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Transaction status */}
                    <div className="pt-6 border-t border-cyan-500/20">
                        <div className={`p-5 rounded-xl ${isConfirming ? 'bg-cyan-900/20 border border-cyan-500/30' : isSuccess ? 'bg-emerald-900/20 border border-emerald-500/30' : isError ? 'bg-rose-900/20 border border-rose-500/30' : 'bg-cyan-900/10 border border-cyan-500/10'}`}>
                            <div className="flex items-center gap-3">
                                {isConfirming && (
                                    <>
                                        <div className="h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-cyan-300 font-['Exo']">Transaction processing...</p>
                                    </>
                                )}
                                {isSuccess && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-emerald-300 font-['Exo']">Transaction confirmed!</p>
                                    </>
                                )}
                                {isError && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-rose-300 font-['Exo']">Transaction failed.</p>
                                    </>
                                )}
                                {hash && (
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-auto text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-['Exo'] hover:scale-105 transition-transform"
                                    >
                                        VIEW ON EXPLORER
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                            {hash && (
                                <p className="text-xs text-cyan-500/70 mt-2 font-mono truncate">
                                    TX: {hash}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-12 text-center z-10 border border-cyan-500/20">
                    <div className="mb-8">
                        <div className="h-20 w-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-['Orbitron']">CONNECT YOUR WALLET</h3>
                        <p className="text-cyan-200 font-['Exo']">Access the SeaCreds carbon credit exchange to manage your blue carbon portfolio</p>
                        
                    </div>
                    <div className="flex justify-center items-center">
                    <ConnectButton />
                    </div>
                </div>
            )}

            {/* Add font imports */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800&family=Exo:wght@300;400;500;600;700&display=swap');
                body {
                    font-family: 'Exo', sans-serif;
                }
                .font-orbitron {
                    font-family: 'Orbitron', monospace;
                }
            `}</style>
        </div>
    );
}