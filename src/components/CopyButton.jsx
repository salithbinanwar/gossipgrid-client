import { useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'

function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-1 rounded-full transition-colors duration-200 ${
        copied ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
      }`}
      title="Copy room ID"
    >
      {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
    </button>
  )
}

export default CopyButton
