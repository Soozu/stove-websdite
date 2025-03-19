import React, { useState } from 'react'
import Link from 'next/link'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

interface PricingCardProps {
  duration: string;
  features: string[];
  highlighted?: boolean;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"></div>
          <h1 className="text-7xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
            STOVE Account Generator
          </h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
            Professional account management tools for educational purposes
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 mx-auto max-w-7xl">
          <FeatureCard
            title="Free License"
            description="Get your license key instantly"
            icon="🔑"
          />
          <FeatureCard
            title="Modern Interface"
            description="Dark/Light theme with user-friendly controls"
            icon="🎨"
          />
          <FeatureCard
            title="24/7 Support"
            description="Direct support through our community"
            icon="💬"
          />
        </div>

        {/* Pricing Section */}
        <div className="mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 blur-3xl -z-10"></div>
          <h2 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-16">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            <PricingCard
              duration="7 Days"
              features={[
                "Basic Access",
                "Updates Included",
                "Standard Support"
              ]}
            />
            <PricingCard
              duration="15 Days"
              features={[
                "Full Access",
                "Updates Included",
                "Priority Support",
                "Extended Features"
              ]}
              highlighted={true}
            />
            <PricingCard
              duration="30 Days"
              features={[
                "Premium Access",
                "Updates Included",
                "Priority Support",
                "Custom Features",
                "Bulk Account Management"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col items-center text-center h-full border border-gray-700/50">
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </div>
  )
}

const PricingCard: React.FC<PricingCardProps> = ({ duration, features, highlighted = false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [licenseKey, setLicenseKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGetAccess = async () => {
    setIsLoading(true)
    setError('')
    setLicenseKey(null)
    setCopied(false)

    try {
      const response = await fetch('/api/check-cooldown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: duration
        }),
      })

      const data = await response.json()

      if (response.ok && data.canAccess && data.license?.license_key) {
        setLicenseKey(data.license.license_key)
      } else {
        setError(data.message || 'Failed to generate license')
      }
    } catch (err) {
      setError('Failed to generate license')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (licenseKey) {
      try {
        await navigator.clipboard.writeText(licenseKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <div className={`${
      highlighted 
        ? 'bg-gradient-to-b from-blue-600 to-blue-700 transform scale-105 shadow-xl shadow-blue-500/25' 
        : 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50'
    } p-8 rounded-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 flex flex-col h-full`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{duration}</h3>
        <div className="text-xl font-bold text-white">
          License Key
        </div>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-3">
        <button
          onClick={handleGetAccess}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            highlighted 
              ? 'bg-white text-blue-600 hover:bg-gray-100 hover:shadow-lg disabled:bg-gray-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg shadow-blue-500/25 disabled:bg-blue-400'
          }`}
        >
          {isLoading ? 'Generating...' : 'Get License'}
        </button>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {licenseKey && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Your License Key:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-green-400 text-sm font-mono break-all bg-gray-800/50 p-2 rounded select-all">
                {licenseKey}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-300 hover:text-white bg-gray-800/50 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 