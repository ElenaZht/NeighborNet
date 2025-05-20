import React from 'react'
import ReportInputForm from './ReportInputForm'
import GiveAwayInputForm from './GiveAwayInputForm'
import OfferHelpInputForm from './OfferHelpInputForm'
import HelpReportInputForm from './HelpReportInputForm'
import { FaExclamationTriangle, FaGift, FaHandsHelping, FaQuestion } from 'react-icons/fa'

export default function AddReportMultiForm() {
  // Define tabs for readability
  const tabs = [
    { id: 'report', label: 'Report Issue', icon: <FaExclamationTriangle className="text-error" /> },
    { id: 'giveaway', label: 'Give Away', icon: <FaGift className="text-primary" /> },
    { id: 'offerhelp', label: 'Offer Help', icon: <FaHandsHelping className="text-success" /> },
    { id: 'requesthelp', label: 'Request Help', icon: <FaQuestion className="text-info" /> }
  ]

  return (
    <div className="max-w-5xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-center mb-6">Interact with your community</h2>
      
      <div className="tabs tabs-lift">
        {/* Report Issue Tab */}
        <input type="radio" name="community_tabs" className="tab" aria-label="Report Issue" defaultChecked />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-error" />
            <h3 className="text-xl font-semibold">Report an Issue</h3>
          </div>
          <ReportInputForm />
        </div>

        {/* Give Away Tab */}
        <input type="radio" name="community_tabs" className="tab" aria-label="Give Away" />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaGift className="text-primary" />
            <h3 className="text-xl font-semibold">Give Away Items</h3>
          </div>
          <GiveAwayInputForm />
        </div>

        {/* Offer Help Tab */}
        <input type="radio" name="community_tabs" className="tab" aria-label="Offer Help" />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaHandsHelping className="text-success" />
            <h3 className="text-xl font-semibold">Offer Your Help</h3>
          </div>
          <OfferHelpInputForm />
        </div>

        {/* Request Help Tab */}
        <input type="radio" name="community_tabs" className="tab" aria-label="Request Help" />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaQuestion className="text-info" />
            <h3 className="text-xl font-semibold">Request Help</h3>
          </div>
          <HelpReportInputForm />
        </div>
      </div>
    </div>
  )
}