import { useEffect, useMemo, useState } from "react"
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAppConfig } from "./context/configContext"
import { getW3Client, fetchBookByCid, resolveName, upsertEntry, putBook } from "./lib/companyBook"

export default function App() {
  const config = useAppConfig()
  const { contractAddress, abi } = config
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [hash, setHash] = useState(null)
  const [book, setBook] = useState({ entries: {}, updatedAt: new Date().toISOString() })
  const [bookCid, setBookCid] = useState("")
  const [newCompanyName, setNewCompanyName] = useState("")
  const [newCompanyAddress, setNewCompanyAddress] = useState("")
  const w3client = useMemo(() => getW3Client(config?.ipfs?.web3StorageToken), [config?.ipfs?.web3StorageToken])

  useEffect(() => {
    const cid = config?.ipfs?.initialCompanyBookCid
    setBookCid(cid || "")
    if (!cid) return
    fetchBookByCid(cid)
      .then(setBook)
      .catch((e) => console.warn("Failed to load company book", e))
  }, [config?.ipfs?.initialCompanyBookCid])

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  })

  // ✅ Call the hook directly (not inside useEffect)
  const { data: balance, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!address }, // only run if address exists
  })

  const handleMint = async () => {
    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "mint",
        args: [address, BigInt(amount)],
      })
      setHash(txHash)
      refetch() // refresh balance
    } catch (err) {
      console.error(err)
    }
  }

  const handleBurn = async () => {
    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "burn",
        args: [BigInt(amount)],
      })
      setHash(txHash)
      refetch() // refresh balance
    } catch (err) {
      console.error(err)
    }
  }

  const handleTransfer = async () => {
    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "transfer",
        args: [recipient, BigInt(transferAmount)],
      })
      setHash(txHash)
      refetch() // refresh balance
    } catch (err) {
      console.error(err)
    }
  }

  const handleTransferByName = async () => {
    try {
      const addr = resolveName(book, recipient)
      if (!addr) throw new Error("Unknown company name")
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "transfer",
        args: [addr, BigInt(transferAmount)],
      })
      setHash(txHash)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveCompany = async () => {
    try {
      if (!w3client) throw new Error("No Web3.Storage token configured")
      const next = upsertEntry(book, newCompanyName, newCompanyAddress)
      const cid = await putBook(w3client, next)
      setBook(next)
      setBookCid(cid)
      setNewCompanyName("")
      setNewCompanyAddress("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col items-center py-10">
      {/* Header */}
      <header className="w-full max-w-3xl flex justify-between items-center px-6 py-4 bg-white shadow-md rounded-2xl mb-8">
        <h2 className="text-xl font-bold text-green-700">
          🌱 Green Hydrogen Credit
        </h2>
        <ConnectButton />
      </header>

      {isConnected ? (
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          {/* Balance */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Your Balance</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {balance ? Number(balance) : 0}
            </p>
          </div>

          {/* Input */}
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-center"
          />

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleMint}
              disabled={!amount}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Mint
            </button>
            <button
              onClick={handleBurn}
              disabled={!amount}
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Burn
            </button>
          </div>

          {/* Transfer */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Transfer Credits</h3>
            <input
              type="text"
              placeholder="Recipient (0x... or company name)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleTransfer}
                  disabled={!recipient || !recipient.startsWith('0x') || !transferAmount}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Transfer by Address
                </button>
                <button
                  onClick={handleTransferByName}
                  disabled={!recipient || recipient.startsWith('0x') || !transferAmount}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Transfer by Name
                </button>
              </div>
            </div>
            {bookCid && (
              <p className="text-xs text-gray-500 mt-2 break-all">Company book CID: {bookCid}</p>
            )}
          </div>

          {/* Company book admin */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Save Company Mapping (name → address)</h3>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Company name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="0x... address"
                value={newCompanyAddress}
                onChange={(e) => setNewCompanyAddress(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveCompany}
                disabled={!newCompanyName || !newCompanyAddress}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Save to IPFS
              </button>
            </div>
          </div>

          {/* Transaction status */}
          <div className="text-center text-sm">
            {hash && (
              <p className="text-gray-500 truncate">
                Tx sent:{" "}
                <span className="text-blue-600 font-mono">{hash}</span>
              </p>
            )}
            {isLoading && <p className="text-yellow-600">⏳ Confirming...</p>}
            {isSuccess && <p className="text-green-600">✅ Confirmed!</p>}
            {isError && <p className="text-red-600">❌ Failed.</p>}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">Please connect your wallet.</p>
      )}
    </div>
  )
}
